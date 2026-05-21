"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { FAQ_ITEMS } from "@/lib/seo-content";

const faqs = FAQ_ITEMS;

export function FAQ() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section id="faq" className="py-24" aria-labelledby="faq-heading">
      <div className="mx-auto max-w-3xl px-4">
        <h2 id="faq-heading" className="text-center text-3xl font-bold text-white">
          Частые вопросы
        </h2>
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
