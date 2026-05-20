import { prisma } from "@/lib/prisma";
import { Badge } from "@/components/ui/badge";

export const metadata = { title: "Пользователи" };

export default async function AdminUsersPage() {
  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    take: 100,
    include: { _count: { select: { agents: true, orders: true } } },
  });

  return (
    <div>
      <h1 className="text-2xl font-bold text-white">Пользователи</h1>
      <div className="mt-6 overflow-x-auto rounded-xl border border-white/10">
        <table className="w-full text-left text-sm">
          <thead className="bg-[#0f1729] text-white/50">
            <tr>
              <th className="p-3">Email / TG</th>
              <th className="p-3">Имя</th>
              <th className="p-3">Роль</th>
              <th className="p-3">Агенты</th>
              <th className="p-3">Заказы</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id} className="border-t border-white/5 text-white/80">
                <td className="p-3">{u.email ?? u.telegramUsername ?? u.telegramId}</td>
                <td className="p-3">{u.name ?? "—"}</td>
                <td className="p-3">
                  <Badge variant={u.role === "ADMIN" ? "warning" : "secondary"}>{u.role}</Badge>
                </td>
                <td className="p-3">{u._count.agents}</td>
                <td className="p-3">{u._count.orders}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
