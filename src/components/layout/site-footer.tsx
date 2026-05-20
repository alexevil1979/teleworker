import Link from "next/link";
import { Bot } from "lucide-react";

export function SiteFooter() {
  return (
    <footer className="border-t border-white/10 bg-[#070d18] py-12">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 md:grid-cols-4">
        <div className="md:col-span-2">
          <div className="flex items-center gap-2 font-semibold text-white">
            <Bot className="h-5 w-5 text-sky-400" />
            TeleAgent
          </div>
          <p className="mt-3 max-w-md text-sm text-white/50">
            Платформа готовых AI Telegram-аккаунтов для бизнеса. Живые диалоги, RAG, активность в
            группах — под ключ.
          </p>
          <p className="mt-4 text-xs text-white/40">teleworker.fun</p>
        </div>
        <div>
          <h4 className="text-sm font-medium text-white">Продукт</h4>
          <ul className="mt-3 space-y-2 text-sm text-white/50">
            <li>
              <Link href="/shop">Магазин</Link>
            </li>
            <li>
              <Link href="/#pricing">Тарифы</Link>
            </li>
            <li>
              <Link href="/demo">Демо</Link>
            </li>
          </ul>
        </div>
        <div>
          <h4 className="text-sm font-medium text-white">Аккаунт</h4>
          <ul className="mt-3 space-y-2 text-sm text-white/50">
            <li>
              <Link href="/login">Вход</Link>
            </li>
            <li>
              <Link href="/register">Регистрация</Link>
            </li>
            <li>
              <Link href="/dashboard">Личный кабинет</Link>
            </li>
          </ul>
        </div>
      </div>
      <div className="mx-auto mt-10 max-w-6xl border-t border-white/10 px-4 pt-6 text-center text-xs text-white/40">
        © {new Date().getFullYear()} TeleAgent. Все права защищены.
      </div>
    </footer>
  );
}
