import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getStripeWebhookEvent } from "@/lib/payments/stripe";
import { provisionAgentForOrder } from "@/lib/agents";
import { auditLog } from "@/lib/logger";

export async function POST(request: Request) {
  const payload = await request.text();
  const signature = request.headers.get("stripe-signature");
  if (!signature) {
    return NextResponse.json({ error: "No signature" }, { status: 400 });
  }

  let event;
  try {
    event = getStripeWebhookEvent(payload, signature);
  } catch {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    const orderId = session.metadata?.orderId;
    if (orderId) {
      await prisma.order.update({
        where: { id: orderId },
        data: { status: "PAID" },
      });
      await prisma.payment.updateMany({
        where: { externalId: session.id },
        data: { status: "SUCCEEDED" },
      });
      await provisionAgentForOrder(orderId);
      await auditLog({
        action: "payment.stripe.succeeded",
        entity: "Order",
        entityId: orderId,
      });
    }
  }

  return NextResponse.json({ received: true });
}
