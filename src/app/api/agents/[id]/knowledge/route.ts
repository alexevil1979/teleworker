import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { knowledgeSchema } from "@/lib/validations";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const agent = await prisma.agent.findFirst({
    where: { id, userId: session.user.id },
  });
  if (!agent) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const body = await request.json();
  const parsed = knowledgeSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const chunk = await prisma.knowledgeChunk.create({
    data: {
      agentId: id,
      title: parsed.data.title,
      content: parsed.data.content,
    },
  });

  return NextResponse.json({ chunk });
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const agent = await prisma.agent.findFirst({
    where: { id, userId: session.user.id },
  });
  if (!agent) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const chunks = await prisma.knowledgeChunk.findMany({
    where: { agentId: id },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({ chunks });
}
