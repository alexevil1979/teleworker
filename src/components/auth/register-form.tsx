"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerSchema } from "@/lib/validations";
import type { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { signIn } from "next-auth/react";

type FormData = z.infer<typeof registerSchema>;

export function RegisterForm() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({ resolver: zodResolver(registerSchema) });

  async function onSubmit(data: FormData) {
    setError(null);
    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const j = await res.json();
      setError(j.error?.email?.[0] ?? j.error ?? "Ошибка регистрации");
      return;
    }
    await signIn("credentials", { email: data.email, password: data.password, redirect: false });
    router.push("/dashboard");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <Label htmlFor="name">Имя</Label>
        <Input id="name" className="mt-1" {...register("name")} />
        {errors.name && <p className="mt-1 text-xs text-red-400">{errors.name.message}</p>}
      </div>
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
        {isSubmitting ? "Регистрация..." : "Создать аккаунт"}
      </Button>
      <p className="text-center text-sm text-white/50">
        Уже есть аккаунт?{" "}
        <Link href="/login" className="text-sky-400 hover:underline">
          Войти
        </Link>
      </p>
    </form>
  );
}
