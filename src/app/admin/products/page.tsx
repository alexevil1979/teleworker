import { prisma } from "@/lib/prisma";
import { formatPrice } from "@/lib/utils";

export const metadata = { title: "Товары" };

export default async function AdminProductsPage() {
  const [products, plans] = await Promise.all([
    prisma.product.findMany({ orderBy: { sortOrder: "asc" } }),
    prisma.plan.findMany({ orderBy: { sortOrder: "asc" } }),
  ]);

  return (
    <div>
      <h1 className="text-2xl font-bold text-white">Товары и тарифы</h1>

      <h2 className="mt-8 text-lg text-white">Продукты (магазин)</h2>
      <div className="mt-4 space-y-2">
        {products.map((p) => (
          <div key={p.id} className="rounded-lg border border-white/10 p-4 flex justify-between">
            <div>
              <p className="font-medium text-white">{p.name}</p>
              <p className="text-sm text-white/50">{p.slug}</p>
            </div>
            <p className="text-sky-300">{formatPrice(p.priceRub)}</p>
          </div>
        ))}
      </div>

      <h2 className="mt-8 text-lg text-white">Планы подписки</h2>
      <div className="mt-4 space-y-2">
        {plans.map((p) => (
          <div key={p.id} className="rounded-lg border border-white/10 p-4 flex justify-between">
            <div>
              <p className="font-medium text-white">{p.name}</p>
              <p className="text-sm text-white/50">до {p.maxAgents} агентов</p>
            </div>
            <p className="text-sky-300">{formatPrice(p.monthlyPriceRub)}/мес</p>
          </div>
        ))}
      </div>
    </div>
  );
}
