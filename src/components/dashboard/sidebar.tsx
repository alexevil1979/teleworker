"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Bot,
  LayoutDashboard,
  CreditCard,
  Settings,
  ShoppingBag,
  Shield,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";

const links = [
  { href: "/dashboard", label: "Обзор", icon: LayoutDashboard },
  { href: "/dashboard/agents", label: "Мои агенты", icon: Bot },
  { href: "/dashboard/payments", label: "Платежи", icon: CreditCard },
  { href: "/dashboard/profile", label: "Профиль", icon: Settings },
  { href: "/shop", label: "Магазин", icon: ShoppingBag },
];

export function DashboardSidebar({ isAdmin }: { isAdmin?: boolean }) {
  const pathname = usePathname();

  return (
    <aside className="flex w-64 flex-col border-r border-white/10 bg-[#0b1220] p-4">
      <Link href="/" className="flex items-center gap-2 font-semibold text-white">
        <Bot className="h-5 w-5 text-sky-400" />
        TeleAgent
      </Link>
      <nav className="mt-8 flex flex-1 flex-col gap-1">
        {links.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition",
              pathname === item.href
                ? "bg-sky-500/20 text-sky-300"
                : "text-white/60 hover:bg-white/5 hover:text-white"
            )}
          >
            <item.icon className="h-4 w-4" />
            {item.label}
          </Link>
        ))}
        {isAdmin && (
          <Link
            href="/admin"
            className={cn(
              "flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition",
              pathname.startsWith("/admin")
                ? "bg-amber-500/20 text-amber-300"
                : "text-white/60 hover:bg-white/5"
            )}
          >
            <Shield className="h-4 w-4" />
            Админ
          </Link>
        )}
      </nav>
      <Button variant="ghost" className="justify-start" onClick={() => signOut({ callbackUrl: "/" })}>
        Выйти
      </Button>
    </aside>
  );
}
