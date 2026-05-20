"use client";

import { useState } from "react";
import Link from "next/link";
import { ShoppingCart, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { formatPrice } from "@/lib/utils";
import type { Product } from "@prisma/client";

type Props = {
  products: Product[];
  isLoggedIn: boolean;
};

export function ShopCatalog({ products, isLoggedIn }: Props) {
  const [added, setAdded] = useState<string | null>(null);
  const [loading, setLoading] = useState<string | null>(null);

  async function addToCart(productId: string) {
    if (!isLoggedIn) {
      window.location.href = `/login?callbackUrl=/shop`;
      return;
    }
    setLoading(productId);
    await fetch("/api/cart", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ productId, quantity: 1 }),
    });
    setAdded(productId);
    setLoading(null);
  }

  if (!products.length) {
    return (
      <p className="mt-12 text-center text-white/50">
        Каталог загружается. Запустите <code className="text-sky-400">npm run db:seed</code>
      </p>
    );
  }

  return (
    <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {products.map((p) => {
        const features = (p.features as string[]) ?? [];
        return (
          <Card key={p.id} className="flex flex-col">
            <CardHeader>
              <CardTitle>{p.name}</CardTitle>
              <CardDescription className="line-clamp-2">{p.description}</CardDescription>
              <p className="text-2xl font-bold text-white">{formatPrice(p.priceRub)}</p>
              <p className="text-xs text-white/40">{formatPrice(p.priceUsd, "USD")}</p>
            </CardHeader>
            <CardContent className="flex flex-1 flex-col">
              <ul className="flex-1 space-y-1 text-sm text-white/60">
                {features.map((f) => (
                  <li key={f} className="flex gap-2">
                    <Check className="h-4 w-4 shrink-0 text-sky-400" />
                    {f}
                  </li>
                ))}
              </ul>
              <div className="mt-6 flex gap-2">
                <Button
                  className="flex-1"
                  onClick={() => addToCart(p.id)}
                  disabled={loading === p.id}
                >
                  {added === p.id ? (
                    <>
                      <Check className="h-4 w-4" /> В корзине
                    </>
                  ) : (
                    <>
                      <ShoppingCart className="h-4 w-4" /> В корзину
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        );
      })}
      <div className="md:col-span-2 lg:col-span-3 flex justify-center">
        <Button size="lg" asChild>
          <Link href="/checkout">Оформить заказ</Link>
        </Button>
      </div>
    </div>
  );
}
