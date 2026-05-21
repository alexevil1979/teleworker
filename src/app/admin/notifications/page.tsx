import Link from "next/link";
import { AdminNotificationsForm } from "@/components/admin/notifications-form";
import { ChevronLeft } from "lucide-react";

export const metadata = { title: "Уведомления — Админ" };

export default function AdminNotificationsPage() {
  return (
    <div>
      <Link
        href="/admin"
        className="inline-flex items-center gap-1 text-sm text-white/60 hover:text-white"
      >
        <ChevronLeft className="h-4 w-4" />
        Назад в админку
      </Link>
      <h1 className="mt-4 text-2xl font-bold text-white">Уведомления в Telegram</h1>
      <p className="mt-2 text-white/60">
        Настройте бота для оповещений о важных действиях на сайте.
      </p>
      <div className="mt-8 max-w-xl">
        <AdminNotificationsForm />
      </div>
    </div>
  );
}
