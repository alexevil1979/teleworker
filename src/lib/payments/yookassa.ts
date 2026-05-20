import { absoluteUrl } from "@/lib/utils";

type CreatePaymentInput = {
  amountRub: number;
  orderId: string;
  description: string;
  userEmail?: string | null;
};

export async function createYooKassaPayment(input: CreatePaymentInput) {
  const shopId = process.env.YOOKASSA_SHOP_ID;
  const secretKey = process.env.YOOKASSA_SECRET_KEY;

  if (!shopId || !secretKey) {
    throw new Error("YooKassa credentials not configured");
  }

  const idempotenceKey = `${input.orderId}-${Date.now()}`;
  const body = {
    amount: { value: (input.amountRub / 100).toFixed(2), currency: "RUB" },
    capture: true,
    confirmation: {
      type: "redirect",
      return_url: absoluteUrl(`/checkout/success?order=${input.orderId}`),
    },
    description: input.description,
    metadata: { orderId: input.orderId },
    receipt: input.userEmail
      ? {
          customer: { email: input.userEmail },
          items: [
            {
              description: input.description,
              quantity: "1",
              amount: { value: (input.amountRub / 100).toFixed(2), currency: "RUB" },
              vat_code: 1,
              payment_mode: "full_payment",
              payment_subject: "service",
            },
          ],
        }
      : undefined,
  };

  const res = await fetch("https://api.yookassa.ru/v3/payments", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Idempotence-Key": idempotenceKey,
      Authorization: `Basic ${Buffer.from(`${shopId}:${secretKey}`).toString("base64")}`,
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`YooKassa error: ${err}`);
  }

  return res.json() as Promise<{
    id: string;
    status: string;
    confirmation?: { confirmation_url?: string };
  }>;
}

export function verifyYooKassaWebhookAuth(authHeader: string | null) {
  const secret = process.env.YOOKASSA_WEBHOOK_SECRET;
  if (!secret) return true;
  return authHeader === secret;
}
