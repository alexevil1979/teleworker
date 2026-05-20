import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";

type AuditParams = {
  userId?: string | null;
  action: string;
  entity?: string;
  entityId?: string;
  metadata?: Record<string, unknown>;
  ip?: string | null;
};

export async function auditLog(params: AuditParams) {
  try {
    await prisma.auditLog.create({
      data: {
        userId: params.userId ?? undefined,
        action: params.action,
        entity: params.entity,
        entityId: params.entityId,
        metadata: params.metadata as Prisma.InputJsonValue | undefined,
        ip: params.ip ?? undefined,
      },
    });
  } catch (e) {
    console.error("[auditLog]", e);
  }
}

export function logInfo(message: string, meta?: Record<string, unknown>) {
  console.log(JSON.stringify({ level: "info", message, ...meta, ts: new Date().toISOString() }));
}

export function logError(message: string, meta?: Record<string, unknown>) {
  console.error(JSON.stringify({ level: "error", message, ...meta, ts: new Date().toISOString() }));
}
