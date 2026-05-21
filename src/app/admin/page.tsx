import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Bot, CreditCard, ShoppingBag } from "lucide-react";
import Link from "next/link";

export const metadata = { title: "Админ" };

export default async function AdminDashboardPage() {
  const [users, agents, orders, payments] = await Promise.all([
    prisma.user.count(),
    prisma.agent.count(),
    prisma.order.count({ where: { status: "PAID" } }),
    prisma.payment.count({ where: { status: "SUCCEEDED" } }),
  ]);

  const stats = [
    { label: "Пользователи", value: users, icon: Users, href: "/admin/users" },
    { label: "Агенты", value: agents, icon: Bot, href: "/admin/agents" },
    { label: "Оплаченные заказы", value: orders, icon: ShoppingBag, href: "/admin/orders" },
    { label: "Платежи", value: payments, icon: CreditCard, href: "/admin/payments" },
  ];

  const recentLogs = await prisma.auditLog.findMany({
    orderBy: { createdAt: "desc" },
    take: 15,
    include: { user: { select: { email: true, name: true } } },
  });

  return (
    <div>
      <h1 className="text-2xl font-bold text-white">Статистика</h1>
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => (
          <Link key={s.href} href={s.href}>
            <Card className="transition hover:border-sky-500/30">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm text-white/70">{s.label}</CardTitle>
                <s.icon className="h-4 w-4 text-sky-400" />
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold text-white">{s.value}</p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      <h2 className="mt-10 text-lg font-semibold text-white">Логи и мониторинг</h2>
      <div className="mt-4 max-h-96 overflow-y-auto rounded-xl border border-white/10">
        <table className="w-full text-left text-sm">
          <thead className="sticky top-0 bg-[#0f1729] text-white/50">
            <tr>
              <th className="p-3">Время</th>
              <th className="p-3">Действие</th>
              <th className="p-3">Пользователь</th>
            </tr>
          </thead>
          <tbody>
            {recentLogs.map((log) => (
              <tr key={log.id} className="border-t border-white/5 text-white/70">
                <td className="p-3 whitespace-nowrap">{log.createdAt.toLocaleString("ru")}</td>
                <td className="p-3">{log.action}</td>
                <td className="p-3">{log.user?.email ?? log.user?.name ?? "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-6 flex flex-wrap gap-3">
        <Link href="/admin/users" className="text-sky-400 hover:underline">
          Пользователи
        </Link>
        <Link href="/admin/agents" className="text-sky-400 hover:underline">
          Агенты
        </Link>
        <Link href="/admin/orders" className="text-sky-400 hover:underline">
          Заказы
        </Link>
        <Link href="/admin/products" className="text-sky-400 hover:underline">
          Товары и тарифы
        </Link>
        <Link href="/admin/notifications" className="text-amber-400 hover:underline">
          Telegram-уведомления
        </Link>
      </div>
    </div>
  );
}
