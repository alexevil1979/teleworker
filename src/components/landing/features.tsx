"use client";

import { motion } from "framer-motion";
import { Brain, Users, Zap, Shield, Database, BarChart3 } from "lucide-react";

const items = [
  {
    icon: Brain,
    title: "Живые диалоги",
    desc: "ИИ ведёт переписку в личке как реальный человек — с контекстом и эмоциями.",
  },
  {
    icon: Database,
    title: "RAG по вашей базе",
    desc: "Загрузите FAQ, прайсы, скрипты — агент отвечает точно по вашим данным.",
  },
  {
    icon: Users,
    title: "Группы и каналы",
    desc: "Умные комментарии, реплаи и реакции для поддержания активности.",
  },
  {
    icon: Zap,
    title: "Быстрая выдача",
    desc: "После оплаты аккаунт автоматически появляется в личном кабинете.",
  },
  {
    icon: Shield,
    title: "Безопасность",
    desc: "Rate limiting, аудит-логи, защита от спама и ботов.",
  },
  {
    icon: BarChart3,
    title: "Аналитика",
    desc: "Статистика сообщений, реакций и логов чатов в реальном времени.",
  },
];

export function Features() {
  return (
    <section id="features" className="py-24 bg-white/[0.02]" aria-labelledby="features-heading">
      <div className="mx-auto max-w-6xl px-4">
        <h2 id="features-heading" className="text-center text-3xl font-bold text-white">
          Возможности платформы
        </h2>
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item, i) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="rounded-2xl border border-white/10 bg-[#0f1729] p-6"
            >
              <item.icon className="h-8 w-8 text-sky-400" />
              <h3 className="mt-4 text-lg font-semibold text-white">{item.title}</h3>
              <p className="mt-2 text-sm text-white/60">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
