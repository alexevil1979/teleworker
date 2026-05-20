import Stripe from "stripe";
import { absoluteUrl } from "@/lib/utils";

let stripeClient: Stripe | null = null;

export function getStripe() {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) throw new Error("Stripe not configured");
  if (!stripeClient) stripeClient = new Stripe(key);
  return stripeClient;
}

export async function createStripeCheckoutSession(input: {
  amountUsd: number;
  orderId: string;
  userEmail?: string | null;
  lineItems: { name: string; quantity: number; amountUsd: number }[];
}) {
  const stripe = getStripe();

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    customer_email: input.userEmail ?? undefined,
    success_url: absoluteUrl(`/checkout/success?order=${input.orderId}&session_id={CHECKOUT_SESSION_ID}`),
    cancel_url: absoluteUrl("/checkout"),
    metadata: { orderId: input.orderId },
    line_items: input.lineItems.map((item) => ({
      quantity: item.quantity,
      price_data: {
        currency: "usd",
        unit_amount: item.amountUsd,
        product_data: { name: item.name },
      },
    })),
  });

  return session;
}

export function getStripeWebhookEvent(payload: string, signature: string) {
  const stripe = getStripe();
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!secret) throw new Error("STRIPE_WEBHOOK_SECRET missing");
  return stripe.webhooks.constructEvent(payload, signature, secret);
}
