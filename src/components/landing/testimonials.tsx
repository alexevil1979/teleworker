"use client";

import { motion } from "framer-motion";
import { Star } from "lucide-react";

const reviews = [
  {
    name: "Алексей М.",
    role: "E-commerce",
    text: "За неделю 3 агента обработали 400+ лидов в Telegram. Конверсия в заявку выросла на 23%.",
  },
  {
    name: "Марина К.",
    role: "EdTech",
    text: "RAG по нашей базе курсов — ответы точные, студенты не отличают от менеджера.",
  },
  {
    name: "Игорь В.",
    role: "B2B SaaS",
    text: "Активность в отраслевых чатах принесла 15 встреч без ручного комментирования.",
  },
];

export function Testimonials() {
  return (
    <section className="py-24 bg-white/[0.02]">
      <div className="mx-auto max-w-6xl px-4">
        <h2 className="text-center text-3xl font-bold text-white">Отзывы</h2>
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {reviews.map((r, i) => (
            <motion.blockquote
              key={r.name}
              initial={{ opacity: 0, scale: 0.98 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="rounded-2xl border border-white/10 bg-[#0f1729] p-6"
            >
              <div className="flex gap-1 text-amber-400">
                {Array.from({ length: 5 }).map((_, j) => (
                  <Star key={j} className="h-4 w-4 fill-current" />
                ))}
              </div>
              <p className="mt-4 text-sm text-white/70">&ldquo;{r.text}&rdquo;</p>
              <footer className="mt-4">
                <p className="font-medium text-white">{r.name}</p>
                <p className="text-xs text-white/50">{r.role}</p>
              </footer>
            </motion.blockquote>
          ))}
        </div>
      </div>
    </section>
  );
}
