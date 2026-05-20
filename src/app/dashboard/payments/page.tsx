import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { formatPrice } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

export const metadata = { title: "Платежи" };

export default async function PaymentsPage() {
  const session = await auth();
  const [payments, subscriptions] = await Promise.all([
    prisma.payment.findMany({
      where: { userId: session!.user.id },
      orderBy: { createdAt: "desc" },
      take: 50,
    }),
    prisma.subscription.findMany({
      where: { userId: session!.user.id },
      include: { plan: true },
      orderBy: { createdAt: "desc" },
    }),
  ]);

  return (
    <div>
      <h1 className="text-2xl font-bold text-white">Платежи и подписки</h1>

      <h2 className="mt-8 text-lg font-medium text-white">Подписки</h2>
      <div className="mt-4 space-y-2">
        {subscriptions.length === 0 ? (
          <p className="text-white/50">Нет активных подписок</p>
        ) : (
          subscriptions.map((s) => (
            <Card key={s.id}>
              <CardContent className="flex justify-between py-4">
                <span className="text-white">{s.plan.name}</span>
                <Badge variant={s.status === "ACTIVE" ? "success" : "secondary"}>{s.status}</Badge>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      <h2 className="mt-8 text-lg font-medium text-white">История платежей</h2>
      <div className="mt-4 space-y-2">
        {payments.map((p) => (
          <Card key={p.id}>
            <CardContent className="flex flex-wrap justify-between gap-2 py-4 text-sm">
              <span className="text-white">
                {p.provider} · {formatPrice(p.amount, p.currency === "USD" ? "USD" : "RUB")}
              </span>
              <Badge variant={p.status === "SUCCEEDED" ? "success" : "warning"}>{p.status}</Badge>
              <span className="text-white/40 w-full">{p.createdAt.toLocaleString("ru")}</span>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
