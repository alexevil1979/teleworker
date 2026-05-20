import { prisma } from "@/lib/prisma";
import { formatPrice } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

export const metadata = { title: "Заказы" };

export default async function AdminOrdersPage() {
  const orders = await prisma.order.findMany({
    orderBy: { createdAt: "desc" },
    take: 50,
    include: { user: { select: { email: true } }, items: { include: { product: true } } },
  });

  return (
    <div>
      <h1 className="text-2xl font-bold text-white">Заказы</h1>
      <div className="mt-6 space-y-3">
        {orders.map((o) => (
          <div key={o.id} className="rounded-xl border border-white/10 p-4">
            <div className="flex flex-wrap justify-between gap-2">
              <span className="font-mono text-sm text-white/60">{o.id}</span>
              <Badge>{o.status}</Badge>
            </div>
            <p className="mt-2 text-white">{o.user.email ?? "user"}</p>
            <p className="text-sky-300">{formatPrice(o.totalRub)}</p>
            <ul className="mt-2 text-sm text-white/50">
              {o.items.map((i) => (
                <li key={i.id}>
                  {i.product.name} × {i.quantity}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
