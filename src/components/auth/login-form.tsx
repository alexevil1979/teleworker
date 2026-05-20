"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema } from "@/lib/validations";
import type { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { TelegramLoginWidget } from "@/components/auth/telegram-login-widget";

type FormData = z.infer<typeof loginSchema>;

declare global {
  interface Window {
    onTelegramAuth?: (user: Record<string, string>) => void;
  }
}

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") ?? "/dashboard";
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({ resolver: zodResolver(loginSchema) });

  async function onSubmit(data: FormData) {
    setError(null);
    const res = await signIn("credentials", {
      email: data.email,
      password: data.password,
      redirect: false,
    });
    if (res?.error) {
      setError("Неверный email или пароль");
      return;
    }
    router.push(callbackUrl);
    router.refresh();
  }

  if (typeof window !== "undefined") {
    window.onTelegramAuth = async (user) => {
      const res = await signIn("telegram", { ...user, redirect: false });
      if (!res?.error) {
        router.push(callbackUrl);
        router.refresh();
      }
    };
  }

  const botName = process.env.NEXT_PUBLIC_TELEGRAM_BOT_USERNAME;

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" className="mt-1" {...register("email")} />
          {errors.email && <p className="mt-1 text-xs text-red-400">{errors.email.message}</p>}
        </div>
        <div>
          <Label htmlFor="password">Пароль</Label>
          <Input id="password" type="password" className="mt-1" {...register("password")} />
          {errors.password && (
            <p className="mt-1 text-xs text-red-400">{errors.password.message}</p>
          )}
        </div>
        {error && <p className="text-sm text-red-400">{error}</p>}
        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? "Вход..." : "Войти"}
        </Button>
      </form>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t border-white/10" />
        </div>
        <div className="relative flex justify-center text-xs">
          <span className="bg-[#0b1220] px-2 text-white/50">или</span>
        </div>
      </div>

      {botName && (
        <div className="flex justify-center">
          <TelegramLoginWidget botUsername={botName} />
        </div>
      )}

      <p className="text-center text-sm text-white/50">
        <Link href="/forgot-password" className="text-sky-400 hover:underline">
          Забыли пароль?
        </Link>
        {" · "}
        <Link href="/register" className="text-sky-400 hover:underline">
          Регистрация
        </Link>
      </p>
    </div>
  );
}
