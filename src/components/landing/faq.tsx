"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

const faqs = [
  {
    q: "Как быстро я получу аккаунт после оплаты?",
    a: "Обычно в течение 5–15 минут. Статус «Выдача» отображается в личном кабинете, затем аккаунт переходит в «Активен».",
  },
  {
    q: "Какие AI-модели поддерживаются?",
    a: "Gigachat (по умолчанию), Grok и Claude — выбор в настройках каждого агента.",
  },
  {
    q: "Можно ли загрузить свою базу знаний?",
    a: "Да, в кабинете для каждого агента: текстовые блоки для RAG, сценарии и системный промпт.",
  },
  {
    q: "Какие способы оплаты?",
    a: "ЮKassa для РФ (карты, СБП), Stripe для международных платежей в USD.",
  },
  {
    q: "Это легально?",
    a: "Вы используете автоматизацию коммуникаций под свою ответственность. Рекомендуем соблюдать правила Telegram и маркировку ботов где требуется.",
  },
];

export function FAQ() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section id="faq" className="py-24">
      <div className="mx-auto max-w-3xl px-4">
        <h2 className="text-center text-3xl font-bold text-white">FAQ</h2>
        <div className="mt-10 space-y-3">
          {faqs.map((item, i) => (
            <div key={item.q} className="rounded-xl border border-white/10 bg-white/[0.03]">
              <button
                type="button"
                className="flex w-full items-center justify-between p-4 text-left text-white"
                onClick={() => setOpen(open === i ? null : i)}
              >
                {item.q}
                <ChevronDown className={cn("h-5 w-5 transition", open === i && "rotate-180")} />
              </button>
              {open === i && <p className="border-t border-white/10 px-4 pb-4 text-sm text-white/60">{item.a}</p>}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
