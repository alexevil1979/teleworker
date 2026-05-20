import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const addSchema = z.object({
  productId: z.string(),
  quantity: z.number().int().min(1).max(99).default(1),
});

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const items = await prisma.cartItem.findMany({
    where: { userId: session.user.id },
    include: { product: true },
  });

  return NextResponse.json({ items });
}

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const parsed = addSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid data" }, { status: 400 });
  }

  const item = await prisma.cartItem.upsert({
    where: {
      userId_productId: {
        userId: session.user.id,
        productId: parsed.data.productId,
      },
    },
    create: {
      userId: session.user.id,
      productId: parsed.data.productId,
      quantity: parsed.data.quantity,
    },
    update: { quantity: parsed.data.quantity },
    include: { product: true },
  });

  return NextResponse.json({ item });
}

export async function DELETE(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const productId = searchParams.get("productId");

  if (productId) {
    await prisma.cartItem.deleteMany({
      where: { userId: session.user.id, productId },
    });
  } else {
    await prisma.cartItem.deleteMany({ where: { userId: session.user.id } });
  }

  return NextResponse.json({ ok: true });
}
