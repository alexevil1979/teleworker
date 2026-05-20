import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export const metadata = { title: "Мои агенты" };

const statusVariant: Record<string, "default" | "success" | "warning" | "destructive" | "secondary"> = {
  ACTIVE: "success",
  PROVISIONING: "warning",
  PAUSED: "secondary",
  BLOCKED: "destructive",
  REPLACED: "secondary",
};

export default async function AgentsPage() {
  const session = await auth();
  const agents = await prisma.agent.findMany({
    where: { userId: session!.user.id },
    include: { product: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">Мои агенты</h1>
        <Button asChild>
          <Link href="/shop">Купить ещё</Link>
        </Button>
      </div>
      <div className="mt-6 space-y-3">
        {agents.map((a) => (
          <Card key={a.id}>
            <CardContent className="flex flex-wrap items-center justify-between gap-4 py-4">
              <div>
                <p className="font-medium text-white">{a.displayName}</p>
                <p className="text-sm text-white/50">
                  {a.product.name}
                  {a.telegramUsername && ` · @${a.telegramUsername}`}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <Badge variant={statusVariant[a.status] ?? "secondary"}>{a.status}</Badge>
                <Button size="sm" asChild>
                  <Link href={`/dashboard/agents/${a.id}`}>Управление</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
        {!agents.length && (
          <p className="text-white/50">Нет агентов. Купите в магазине.</p>
        )}
      </div>
    </div>
  );
}
