import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Bot, MessageSquare, CreditCard } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export const metadata = { title: "Личный кабинет" };

export default async function DashboardPage() {
  const session = await auth();
  const userId = session!.user.id;

  const [agents, orders, payments] = await Promise.all([
    prisma.agent.count({ where: { userId } }),
    prisma.order.count({ where: { userId, status: "PAID" } }),
    prisma.payment.count({ where: { userId, status: "SUCCEEDED" } }),
  ]);

  const recentAgents = await prisma.agent.findMany({
    where: { userId },
    take: 5,
    orderBy: { createdAt: "desc" },
    include: { product: true },
  });

  return (
    <div>
      <h1 className="text-2xl font-bold text-white">Добро пожаловать, {session!.user.name ?? "пользователь"}</h1>
      <p className="mt-1 text-white/50">Управляйте AI-агентами и подписками</p>

      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-white/70">Агенты</CardTitle>
            <Bot className="h-4 w-4 text-sky-400" />
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-white">{agents}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-white/70">Заказы</CardTitle>
            <MessageSquare className="h-4 w-4 text-emerald-400" />
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-white">{orders}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-white/70">Платежи</CardTitle>
            <CreditCard className="h-4 w-4 text-amber-400" />
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-white">{payments}</p>
          </CardContent>
        </Card>
      </div>

      <div className="mt-8">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-white">Последние агенты</h2>
          <Button variant="secondary" size="sm" asChild>
            <Link href="/dashboard/agents">Все агенты</Link>
          </Button>
        </div>
        <div className="mt-4 space-y-3">
          {recentAgents.length === 0 ? (
            <Card>
              <CardContent className="py-8 text-center text-white/50">
                Пока нет агентов.{" "}
                <Link href="/shop" className="text-sky-400">
                  Купить в магазине
                </Link>
              </CardContent>
            </Card>
          ) : (
            recentAgents.map((a) => (
              <Card key={a.id}>
                <CardContent className="flex items-center justify-between py-4">
                  <div>
                    <p className="font-medium text-white">{a.displayName}</p>
                    <p className="text-sm text-white/50">{a.product.name} · {a.status}</p>
                  </div>
                  <Button size="sm" variant="outline" asChild>
                    <Link href={`/dashboard/agents/${a.id}`}>Настроить</Link>
                  </Button>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
