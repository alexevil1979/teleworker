"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Hero() {
  return (
    <section className="relative overflow-hidden pt-28 pb-20">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,_#1d9bf033,_transparent_55%)]" />
      <div className="pointer-events-none absolute -right-32 top-20 h-96 w-96 rounded-full bg-sky-500/10 blur-3xl" />

      <div className="relative mx-auto max-w-6xl px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 rounded-full border border-sky-500/30 bg-sky-500/10 px-4 py-1.5 text-sm text-sky-300"
        >
          <Sparkles className="h-4 w-4" />
          AI-агенты, неотличимые от живых людей
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mt-6 max-w-3xl text-4xl font-bold tracking-tight text-white md:text-6xl"
        >
          Готовые Telegram-аккаунты с ИИ — продавайте, общайтесь, масштабируйтесь
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-6 max-w-2xl text-lg text-white/60"
        >
          TeleAgent выдаёт «живые» аккаунты с Gigachat, Grok или Claude: личные диалоги, RAG по вашей
          базе знаний, умные комментарии и реакции в группах.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-10 flex flex-wrap gap-4"
        >
          <Button size="lg" asChild>
            <Link href="/shop">
              Купить аккаунт
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
          <Button size="lg" variant="secondary" asChild>
            <Link href="/demo">
              <MessageCircle className="h-4 w-4" />
              Попробовать демо
            </Link>
          </Button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-16 grid gap-4 sm:grid-cols-3"
        >
          {[
            { label: "Активных агентов", value: "2 400+" },
            { label: "Сообщений / день", value: "180K+" },
            { label: "NPS клиентов", value: "72" },
          ].map((stat) => (
            <div
              key={stat.label}
              className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 backdrop-blur"
            >
              <p className="text-2xl font-bold text-white">{stat.value}</p>
              <p className="text-sm text-white/50">{stat.label}</p>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
