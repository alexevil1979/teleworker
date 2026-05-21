import Link from "next/link";
import { NOINDEX_METADATA } from "@/lib/seo";
import { Button } from "@/components/ui/button";

export const metadata = NOINDEX_METADATA;

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#070d18] px-4 text-center">
      <h1 className="text-4xl font-bold text-white">404</h1>
      <p className="mt-2 text-white/60">Страница не найдена</p>
      <Button className="mt-8" asChild>
        <Link href="/">На главную</Link>
      </Button>
    </div>
  );
}
