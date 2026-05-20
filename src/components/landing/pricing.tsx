"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const plans = [
  {
    name: "Starter",
    price: "4 990 ₽",
    desc: "1 агент, личка + базовый RAG",
    features: ["1 AI-аккаунт", "До 500 сообщений/мес", "Gigachat", "Email-поддержка"],
    popular: false,
  },
  {
    name: "Pro",
    price: "14 990 ₽",
    desc: "3 агента, группы и каналы",
    features: ["3 AI-аккаунта", "Группы и реакции", "Gigachat / Grok", "Приоритетная выдача"],
    popular: true,
  },
  {
    name: "Business",
    price: "39 990 ₽",
    desc: "10 агентов, кастомные сценарии",
    features: ["10 AI-аккаунтов", "Claude + RAG", "API вебхуки", "Менеджер"],
    popular: false,
  },
  {
    name: "Enterprise",
    price: "По запросу",
    desc: "Безлимит, SLA, on-prem",
    features: ["Неограниченно", "Выделенные IP", "SLA 99.9%", "Интеграции 1С/CRM"],
    popular: false,
  },
];

export function Pricing() {
  return (
    <section id="pricing" className="py-24">
      <div className="mx-auto max-w-6xl px-4">
        <h2 className="text-center text-3xl font-bold text-white md:text-4xl">Тарифы</h2>
        <p className="mx-auto mt-4 max-w-xl text-center text-white/60">
          Подписка с ежемесячным продлением. Оплата через ЮKassa или Stripe.
        </p>

        <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {plans.map((plan, i) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
            >
              <Card
                className={`h-full ${plan.popular ? "border-sky-500/50 ring-1 ring-sky-500/30" : ""}`}
              >
                <CardHeader>
                  {plan.popular && (
                    <span className="mb-2 w-fit rounded-full bg-sky-500/20 px-2 py-0.5 text-xs text-sky-300">
                      Популярный
                    </span>
                  )}
                  <CardTitle>{plan.name}</CardTitle>
                  <CardDescription>{plan.desc}</CardDescription>
                  <p className="text-3xl font-bold text-white">{plan.price}</p>
                  <p className="text-xs text-white/40">/ месяц</p>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {plan.features.map((f) => (
                      <li key={f} className="flex items-center gap-2 text-sm text-white/70">
                        <Check className="h-4 w-4 shrink-0 text-sky-400" />
                        {f}
                      </li>
                    ))}
                  </ul>
                  <Button className="mt-6 w-full" variant={plan.popular ? "default" : "secondary"} asChild>
                    <Link href="/shop">{plan.name === "Enterprise" ? "Связаться" : "Выбрать"}</Link>
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
