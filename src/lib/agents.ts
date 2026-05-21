import { prisma } from "@/lib/prisma";
import { auditLog } from "@/lib/logger";

export async function provisionAgentForOrder(orderId: string) {
  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: { items: { include: { product: true } }, user: true },
  });

  if (!order || order.status !== "PAID") return [];

  const created = [];

  for (const item of order.items) {
    for (let i = 0; i < item.quantity; i++) {
      const agent = await prisma.agent.create({
        data: {
          userId: order.userId,
          productId: item.productId,
          displayName: `${item.product.name} #${Date.now().toString(36).slice(-4)}`,
          status: "PROVISIONING",
          systemPrompt: `Ты — живой Telegram-пользователь. Отвечай естественно, по базе знаний клиента. Продукт: ${item.product.name}.`,
          aiProvider: "gigachat",
        },
      });
      created.push(agent);
      await auditLog({
        userId: order.userId,
        action: "agent.provisioned",
        entity: "agent",
        entityId: agent.id,
        metadata: {
          orderId,
          product: item.product.name,
          email: order.user.email ?? undefined,
        },
      });
    }
  }

  return created;
}
