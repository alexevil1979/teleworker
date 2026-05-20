import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const metadata = { title: "Профиль" };

export default async function ProfilePage() {
  const session = await auth();
  const user = await prisma.user.findUnique({
    where: { id: session!.user.id },
  });

  return (
    <div className="max-w-lg">
      <h1 className="text-2xl font-bold text-white">Профиль</h1>
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Данные аккаунта</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          <p>
            <span className="text-white/50">Имя: </span>
            <span className="text-white">{user?.name ?? "—"}</span>
          </p>
          <p>
            <span className="text-white/50">Email: </span>
            <span className="text-white">{user?.email ?? "—"}</span>
          </p>
          <p>
            <span className="text-white/50">Telegram: </span>
            <span className="text-white">
              {user?.telegramUsername ? `@${user.telegramUsername}` : "—"}
            </span>
          </p>
          <p>
            <span className="text-white/50">Роль: </span>
            <span className="text-white">{user?.role}</span>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
