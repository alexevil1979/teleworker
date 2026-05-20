import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { prisma } from "@/lib/prisma";
import { ShopCatalog } from "@/components/shop/catalog";
import { auth } from "@/auth";

export const metadata = { title: "Магазин AI-агентов" };

export default async function ShopPage() {
  const products = await prisma.product.findMany({
    where: { isActive: true },
    orderBy: { sortOrder: "asc" },
  }).catch(() => []);

  const session = await auth();

  return (
    <>
      <SiteHeader />
      <main className="min-h-screen pt-24 pb-16">
        <div className="mx-auto max-w-6xl px-4">
          <h1 className="text-3xl font-bold text-white">Каталог агентов</h1>
          <p className="mt-2 text-white/60">
            Выберите тип аккаунта. После оплаты — автоматическая выдача в кабинет.
          </p>
          <ShopCatalog products={products} isLoggedIn={!!session} />
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
