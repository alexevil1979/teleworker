import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { provisionAgentForOrder } from "@/lib/agents";
import { verifyYooKassaWebhookAuth } from "@/lib/payments/yookassa";
import { auditLog } from "@/lib/logger";

export async function POST(request: Request) {
  if (!verifyYooKassaWebhookAuth(request.headers.get("authorization"))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const event = await request.json();
  const payment = event?.object;
  if (!payment?.id) return NextResponse.json({ ok: true });

  const orderId = payment.metadata?.orderId as string | undefined;
  if (!orderId) return NextResponse.json({ ok: true });

  if (payment.status === "succeeded") {
    await prisma.order.update({
      where: { id: orderId },
      data: { status: "PAID" },
    });

    await prisma.payment.updateMany({
      where: { externalId: payment.id },
      data: { status: "SUCCEEDED" },
    });

    await provisionAgentForOrder(orderId);
    await auditLog({
      action: "payment.yookassa.succeeded",
      entity: "Order",
      entityId: orderId,
      metadata: { paymentId: payment.id },
    });
  }

  if (payment.status === "canceled") {
    await prisma.payment.updateMany({
      where: { externalId: payment.id },
      data: { status: "FAILED" },
    });
  }

  return NextResponse.json({ ok: true });
}
