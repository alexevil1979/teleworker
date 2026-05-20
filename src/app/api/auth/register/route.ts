import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { hashPassword } from "@/lib/password";
import { registerSchema } from "@/lib/validations";
import { rateLimit, getClientIp } from "@/lib/rate-limit";
import { auditLog } from "@/lib/logger";

export async function POST(request: Request) {
  const ip = getClientIp(request);
  const rl = rateLimit(`register:${ip}`, 5, 3600_000);
  if (!rl.success) {
    return NextResponse.json({ error: "Слишком много попыток" }, { status: 429 });
  }

  const body = await request.json();
  const parsed = registerSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const { email, password, name } = parsed.data;
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return NextResponse.json({ error: "Email уже зарегистрирован" }, { status: 409 });
  }

  const user = await prisma.user.create({
    data: {
      email,
      name,
      passwordHash: await hashPassword(password),
    },
  });

  await auditLog({ userId: user.id, action: "user.register", ip });

  return NextResponse.json({ ok: true });
}
