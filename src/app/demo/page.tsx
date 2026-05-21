import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { MessageCircle } from "lucide-react";

import { buildPageMetadata } from "@/lib/seo";

export const metadata = buildPageMetadata({
  title: "Демо AI-агента в Telegram",
  description:
    "Попробуйте демо TeleAgent в Telegram: живые ответы, сценарии продаж и пример работы AI-аккаунта.",
  path: "/demo",
});

export default function DemoPage() {
  const demoBot = process.env.NEXT_PUBLIC_TELEGRAM_DEMO_LINK ?? "https://t.me/";

  return (
    <>
      <SiteHeader />
      <main className="flex min-h-[70vh] flex-col items-center justify-center px-4 pt-24 text-center">
        <MessageCircle className="h-16 w-16 text-sky-400" />
        <h1 className="mt-6 text-3xl font-bold text-white">Демо TeleAgent</h1>
        <p className="mt-4 max-w-lg text-white/60">
          Напишите демо-боту в Telegram — увидите, как AI-агент отвечает в живом стиле с учётом
          сценария продаж.
        </p>
        <Button size="lg" className="mt-8" asChild>
          <a href={demoBot} target="_blank" rel="noopener noreferrer">
            Открыть демо в Telegram
          </a>
        </Button>
        <Button variant="secondary" className="mt-4" asChild>
          <Link href="/shop">Купить полноценного агента</Link>
        </Button>
      </main>
      <SiteFooter />
    </>
  );
}
