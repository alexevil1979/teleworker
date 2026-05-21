import Link from "next/link";
import { Bot } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { RegisterForm } from "@/components/auth/register-form";

import { buildPageMetadata } from "@/lib/seo";

export const metadata = buildPageMetadata({
  title: "Регистрация",
  path: "/register",
  noIndex: true,
});

export default function RegisterPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#070d18] px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <Link href="/" className="mx-auto flex w-fit items-center gap-2 text-white">
            <Bot className="h-6 w-6 text-sky-400" />
            <span className="font-semibold">TeleAgent</span>
          </Link>
          <CardTitle className="mt-4">Регистрация</CardTitle>
          <CardDescription>Создайте аккаунт TeleAgent</CardDescription>
        </CardHeader>
        <CardContent>
          <RegisterForm />
        </CardContent>
      </Card>
    </div>
  );
}
