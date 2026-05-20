import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { DashboardSidebar } from "@/components/dashboard/sidebar";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") {
    redirect("/dashboard");
  }

  return (
    <div className="flex min-h-screen bg-[#070d18]">
      <DashboardSidebar isAdmin />
      <main className="flex-1 overflow-auto p-6 md:p-8">
        <p className="mb-4 text-xs uppercase tracking-wider text-amber-400/80">Админ-панель</p>
        {children}
      </main>
    </div>
  );
}
