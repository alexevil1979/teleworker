import { prisma } from "@/lib/prisma";
import { formatPrice } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

export const metadata = { title: "Платежи" };

export default async function AdminPaymentsPage() {
  const payments = await prisma.payment.findMany({
    orderBy: { createdAt: "desc" },
    take: 100,
    include: { user: { select: { email: true } } },
  });

  return (
    <div>
      <h1 className="text-2xl font-bold text-white">Платежи</h1>
      <div className="mt-6 overflow-x-auto rounded-xl border border-white/10">
        <table className="w-full text-left text-sm">
          <thead className="bg-[#0f1729] text-white/50">
            <tr>
              <th className="p-3">Провайдер</th>
              <th className="p-3">Сумма</th>
              <th className="p-3">Статус</th>
              <th className="p-3">Пользователь</th>
              <th className="p-3">Дата</th>
            </tr>
          </thead>
          <tbody>
            {payments.map((p) => (
              <tr key={p.id} className="border-t border-white/5 text-white/80">
                <td className="p-3">{p.provider}</td>
                <td className="p-3">
                  {formatPrice(p.amount, p.currency === "USD" ? "USD" : "RUB")}
                </td>
                <td className="p-3">
                  <Badge variant={p.status === "SUCCEEDED" ? "success" : "warning"}>
                    {p.status}
                  </Badge>
                </td>
                <td className="p-3">{p.user.email ?? "—"}</td>
                <td className="p-3">{p.createdAt.toLocaleString("ru")}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
