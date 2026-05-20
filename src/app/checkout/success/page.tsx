import Link from "next/link";
import { CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export default async function CheckoutSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ order?: string }>;
}) {
  const params = await searchParams;

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#070d18] px-4 text-center">
      <CheckCircle className="h-16 w-16 text-emerald-400" />
      <h1 className="mt-6 text-2xl font-bold text-white">Оплата принята</h1>
      <p className="mt-2 max-w-md text-white/60">
        Заказ {params.order ? `#${params.order.slice(-8)}` : ""} обрабатывается. Агент появится в
        кабинете в течение нескольких минут.
      </p>
      <Button className="mt-8" asChild>
        <Link href="/dashboard/agents">Мои агенты</Link>
      </Button>
    </div>
  );
}
