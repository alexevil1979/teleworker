"use client";

import { useState } from "react";
import Link from "next/link";
import { Bot } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    await fetch("/api/auth/forgot-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    setSent(true);
    setLoading(false);
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#070d18] px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <Link href="/" className="mx-auto flex w-fit items-center gap-2 text-white">
            <Bot className="h-6 w-6 text-sky-400" />
            <span className="font-semibold">TeleAgent</span>
          </Link>
          <CardTitle className="mt-4">Восстановление пароля</CardTitle>
          <CardDescription>
            {sent ? "Проверьте почту" : "Введите email для ссылки сброса"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {sent ? (
            <Button asChild className="w-full">
              <Link href="/login">На страницу входа</Link>
            </Button>
          ) : (
            <form onSubmit={submit} className="space-y-4">
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  className="mt-1"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Отправка..." : "Отправить ссылку"}
              </Button>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
