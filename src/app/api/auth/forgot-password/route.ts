import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { forgotPasswordSchema } from "@/lib/validations";
import { rateLimit, getClientIp } from "@/lib/rate-limit";
import crypto from "crypto";

export async function POST(request: Request) {
  const ip = getClientIp(request);
  const rl = rateLimit(`forgot:${ip}`, 3, 3600_000);
  if (!rl.success) {
    return NextResponse.json({ error: "Слишком много попыток" }, { status: 429 });
  }

  const body = await request.json();
  const parsed = forgotPasswordSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Некорректный email" }, { status: 400 });
  }

  const user = await prisma.user.findUnique({ where: { email: parsed.data.email } });
  if (user) {
    const token = crypto.randomBytes(32).toString("hex");
    await prisma.verificationToken.create({
      data: {
        identifier: parsed.data.email,
        token,
        expires: new Date(Date.now() + 3600_000),
      },
    });
    // TODO: отправка email через SMTP (nodemailer)
    if (process.env.NODE_ENV === "development") {
      console.log("[reset-link]", `${process.env.NEXT_PUBLIC_APP_URL}/reset-password?token=${token}`);
    }
  }

  return NextResponse.json({
    ok: true,
    message: "Если email существует, ссылка отправлена",
  });
}
