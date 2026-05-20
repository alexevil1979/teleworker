import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { checkoutSchema } from "@/lib/validations";
import { createYooKassaPayment } from "@/lib/payments/yookassa";
import { createStripeCheckoutSession } from "@/lib/payments/stripe";
import { rateLimit, getClientIp } from "@/lib/rate-limit";
import { auditLog } from "@/lib/logger";

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const ip = getClientIp(request);
  const rl = rateLimit(`checkout:${session.user.id}`, 10, 3600_000);
  if (!rl.success) {
    return NextResponse.json({ error: "Rate limit" }, { status: 429 });
  }

  const body = await request.json();
  const parsed = checkoutSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const cart = await prisma.cartItem.findMany({
    where: { userId: session.user.id },
    include: { product: true },
  });

  if (!cart.length) {
    return NextResponse.json({ error: "Корзина пуста" }, { status: 400 });
  }

  const totalRub = cart.reduce((s, i) => s + i.product.priceRub * i.quantity, 0);
  const totalUsd = cart.reduce((s, i) => s + i.product.priceUsd * i.quantity, 0);
  const { currency, provider } = parsed.data;

  const order = await prisma.order.create({
    data: {
      userId: session.user.id,
      totalRub,
      totalUsd,
      currency,
      items: {
        create: cart.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
          priceRub: item.product.priceRub,
          priceUsd: item.product.priceUsd,
        })),
      },
    },
    include: { items: { include: { product: true } } },
  });

  const user = await prisma.user.findUnique({ where: { id: session.user.id } });

  let redirectUrl: string | null = null;
  let externalId: string | null = null;

  if (provider === "YOOKASSA") {
    const yk = await createYooKassaPayment({
      amountRub: totalRub,
      orderId: order.id,
      description: `TeleAgent заказ ${order.id.slice(-8)}`,
      userEmail: user?.email,
    });
    externalId = yk.id;
    redirectUrl = yk.confirmation?.confirmation_url ?? null;

    await prisma.payment.create({
      data: {
        userId: session.user.id,
        orderId: order.id,
        provider: "YOOKASSA",
        amount: totalRub,
        currency: "RUB",
        externalId: yk.id,
      },
    });
  } else {
    const stripeSession = await createStripeCheckoutSession({
      amountUsd: totalUsd,
      orderId: order.id,
      userEmail: user?.email,
      lineItems: order.items.map((i) => ({
        name: i.product.name,
        quantity: i.quantity,
        amountUsd: i.priceUsd,
      })),
    });
    externalId = stripeSession.id;
    redirectUrl = stripeSession.url;

    await prisma.payment.create({
      data: {
        userId: session.user.id,
        orderId: order.id,
        provider: "STRIPE",
        amount: totalUsd,
        currency: "USD",
        externalId: stripeSession.id,
      },
    });
  }

  await prisma.cartItem.deleteMany({ where: { userId: session.user.id } });
  await auditLog({
    userId: session.user.id,
    action: "checkout.created",
    entity: "Order",
    entityId: order.id,
    ip,
    metadata: { provider, externalId },
  });

  return NextResponse.json({ orderId: order.id, redirectUrl });
}
