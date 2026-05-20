"use client";

import { motion } from "framer-motion";
import { TrendingUp } from "lucide-react";

const cases = [
  { title: "Интернет-магазин", metric: "+31% заявок", detail: "Агент в личке консультирует по размерам и доставке" },
  { title: "Крипто-сообщество", metric: "12K реакций/мес", detail: "Поддержание активности в 8 чатах" },
  { title: "Агентство недвижимости", metric: "−40% нагрузки", detail: "Квалификация лидов до передачи риелтору" },
];

export function Cases() {
  return (
    <section id="cases" className="py-24">
      <div className="mx-auto max-w-6xl px-4">
        <h2 className="text-center text-3xl font-bold text-white">Кейсы и результаты</h2>
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {cases.map((c, i) => (
            <motion.div
              key={c.title}
              initial={{ opacity: 0, x: -12 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-6"
            >
              <TrendingUp className="h-6 w-6 text-emerald-400" />
              <h3 className="mt-4 text-lg font-semibold text-white">{c.title}</h3>
              <p className="mt-2 text-2xl font-bold text-emerald-300">{c.metric}</p>
              <p className="mt-2 text-sm text-white/60">{c.detail}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
