import { prisma } from "@/lib/prisma";
import { Badge } from "@/components/ui/badge";

export const metadata = { title: "Агенты" };

export default async function AdminAgentsPage() {
  const agents = await prisma.agent.findMany({
    orderBy: { createdAt: "desc" },
    take: 100,
    include: { user: { select: { email: true, name: true } }, product: true },
  });

  return (
    <div>
      <h1 className="text-2xl font-bold text-white">Агенты</h1>
      <p className="text-sm text-white/50">Выдача, замена, блокировка — через API или Prisma Studio</p>
      <div className="mt-6 overflow-x-auto rounded-xl border border-white/10">
        <table className="w-full text-left text-sm">
          <thead className="bg-[#0f1729] text-white/50">
            <tr>
              <th className="p-3">Имя</th>
              <th className="p-3">Владелец</th>
              <th className="p-3">Продукт</th>
              <th className="p-3">Статус</th>
              <th className="p-3">TG</th>
            </tr>
          </thead>
          <tbody>
            {agents.map((a) => (
              <tr key={a.id} className="border-t border-white/5 text-white/80">
                <td className="p-3">{a.displayName}</td>
                <td className="p-3">{a.user.email ?? a.user.name}</td>
                <td className="p-3">{a.product.name}</td>
                <td className="p-3">
                  <Badge>{a.status}</Badge>
                </td>
                <td className="p-3">{a.telegramUsername ?? "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
