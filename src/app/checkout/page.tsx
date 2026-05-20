"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { SiteHeader } from "@/components/layout/site-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatPrice } from "@/lib/utils";

type CartItem = {
  id: string;
  quantity: number;
  product: { id: string; name: string; priceRub: number; priceUsd: number };
};

export default function CheckoutPage() {
  const [items, setItems] = useState<CartItem[]>([]);
  const [provider, setProvider] = useState<"YOOKASSA" | "STRIPE">("YOOKASSA");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch("/api/cart")
      .then((r) => r.json())
      .then((d) => setItems(d.items ?? []));
  }, []);

  const totalRub = items.reduce((s, i) => s + i.product.priceRub * i.quantity, 0);
  const totalUsd = items.reduce((s, i) => s + i.product.priceUsd * i.quantity, 0);

  async function pay() {
    setLoading(true);
    const res = await fetch("/api/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        provider,
        currency: provider === "YOOKASSA" ? "RUB" : "USD",
      }),
    });
    const data = await res.json();
    setLoading(false);
    if (data.redirectUrl) window.location.href = data.redirectUrl;
    else alert(data.error ?? "Ошибка оплаты");
  }

  return (
    <>
      <SiteHeader />
      <main className="min-h-screen pt-24 pb-16">
        <div className="mx-auto max-w-lg px-4">
          <h1 className="text-2xl font-bold text-white">Оформление заказа</h1>
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Корзина</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {items.length === 0 ? (
                <p className="text-white/50">
                  Пусто. <Link href="/shop" className="text-sky-400">В магазин</Link>
                </p>
              ) : (
                <>
                  {items.map((i) => (
                    <div key={i.id} className="flex justify-between text-sm text-white/80">
                      <span>
                        {i.product.name} × {i.quantity}
                      </span>
                      <span>{formatPrice(i.product.priceRub * i.quantity)}</span>
                    </div>
                  ))}
                  <p className="text-lg font-bold text-white">
                    Итого: {formatPrice(totalRub)} / {formatPrice(totalUsd, "USD")}
                  </p>
                  <div className="flex gap-2">
                    <Button
                      variant={provider === "YOOKASSA" ? "default" : "secondary"}
                      onClick={() => setProvider("YOOKASSA")}
                    >
                      ЮKassa
                    </Button>
                    <Button
                      variant={provider === "STRIPE" ? "default" : "secondary"}
                      onClick={() => setProvider("STRIPE")}
                    >
                      Stripe
                    </Button>
                  </div>
                  <Button className="w-full" onClick={pay} disabled={loading}>
                    {loading ? "Перенаправление..." : "Оплатить"}
                  </Button>
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </>
  );
}
