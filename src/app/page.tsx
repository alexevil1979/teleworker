import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { Hero } from "@/components/landing/hero";
import { Features } from "@/components/landing/features";
import { Pricing } from "@/components/landing/pricing";
import { Cases } from "@/components/landing/cases";
import { Testimonials } from "@/components/landing/testimonials";
import { FAQ } from "@/components/landing/faq";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function HomePage() {
  return (
    <>
      <SiteHeader />
      <main>
        <Hero />
        <Features />
        <Pricing />
        <Cases />
        <Testimonials />
        <FAQ />
        <section className="py-20">
          <div className="mx-auto max-w-4xl rounded-3xl border border-sky-500/30 bg-gradient-to-br from-sky-500/20 to-transparent p-10 text-center">
            <h2 className="text-2xl font-bold text-white md:text-3xl">
              Запустите первого агента сегодня
            </h2>
            <p className="mt-3 text-white/60">Автовыдача после оплаты · Поддержка 24/7</p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <Button size="lg" asChild>
                <Link href="/shop">Купить аккаунт</Link>
              </Button>
              <Button size="lg" variant="secondary" asChild>
                <Link href="/demo">Попробовать демо</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
