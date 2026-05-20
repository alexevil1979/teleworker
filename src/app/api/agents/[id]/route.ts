import { NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { agentConfigSchema } from "@/lib/validations";
import { auditLog } from "@/lib/logger";

export async function PATCH(
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
  const parsed = agentConfigSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const updated = await prisma.agent.update({
    where: { id },
    data: {
      displayName: parsed.data.displayName,
      systemPrompt: parsed.data.systemPrompt,
      aiProvider: parsed.data.aiProvider,
      scenarioConfig: parsed.data.scenarioConfig as Prisma.InputJsonValue | undefined,
    },
  });

  await auditLog({
    userId: session.user.id,
    action: "agent.updated",
    entity: "Agent",
    entityId: id,
  });

  return NextResponse.json({ agent: updated });
}
