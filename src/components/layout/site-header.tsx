"use client";

import Link from "next/link";
import { Bot, Menu, X } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";

const nav = [
  { href: "/#features", label: "Возможности" },
  { href: "/#pricing", label: "Тарифы" },
  { href: "/#cases", label: "Кейсы" },
  { href: "/#faq", label: "FAQ" },
  { href: "/shop", label: "Магазин" },
];

export function SiteHeader() {
  const [open, setOpen] = useState(false);

  return (
    <header className="fixed top-0 z-50 w-full border-b border-white/5 bg-[#0b1220]/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2 font-semibold text-white">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-sky-500/20 text-sky-400">
            <Bot className="h-5 w-5" />
          </span>
          TeleAgent
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm text-white/70 transition hover:text-white"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <Button variant="ghost" asChild>
            <Link href="/login">Войти</Link>
          </Button>
          <Button asChild>
            <Link href="/shop">Купить аккаунт</Link>
          </Button>
        </div>

        <button
          type="button"
          className="md:hidden text-white"
          onClick={() => setOpen(!open)}
          aria-label="Меню"
        >
          {open ? <X /> : <Menu />}
        </button>
      </div>

      {open && (
        <div className="border-t border-white/10 bg-[#0b1220] p-4 md:hidden">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="block py-2 text-white/80"
              onClick={() => setOpen(false)}
            >
              {item.label}
            </Link>
          ))}
          <div className="mt-4 flex flex-col gap-2">
            <Button variant="secondary" asChild>
              <Link href="/login">Войти</Link>
            </Button>
            <Button asChild>
              <Link href="/shop">Купить аккаунт</Link>
            </Button>
          </div>
        </div>
      )}
    </header>
  );
}
