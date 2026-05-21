import type { Metadata } from "next";

export const SITE_URL = (
  process.env.NEXT_PUBLIC_APP_URL ?? "https://teleworker.fun"
).replace(/\/$/, "");

export const SITE_NAME = "TeleAgent";
export const SITE_DOMAIN = "teleworker.fun";

export const DEFAULT_DESCRIPTION =
  "TeleAgent — платформа готовых AI Telegram-аккаунтов: живые диалоги в личке, RAG по вашей базе знаний, активность в группах и каналах. Gigachat, Grok, Claude. Оплата ЮKassa и Stripe.";

export const DEFAULT_KEYWORDS = [
  "Telegram AI",
  "AI агент Telegram",
  "автоматизация Telegram",
  "Telegram бот для бизнеса",
  "Gigachat Telegram",
  "RAG Telegram",
  "продажа Telegram аккаунтов",
  "TeleAgent",
  "teleworker",
];

/** Публичные URL для sitemap (только индексируемые) */
export const SITEMAP_ROUTES: {
  path: string;
  changeFrequency: "always" | "hourly" | "daily" | "weekly" | "monthly" | "yearly" | "never";
  priority: number;
}[] = [
  { path: "", changeFrequency: "weekly", priority: 1 },
  { path: "/shop", changeFrequency: "weekly", priority: 0.9 },
  { path: "/demo", changeFrequency: "monthly", priority: 0.8 },
];

export function canonicalUrl(path = ""): string {
  const p = path.startsWith("/") ? path : path ? `/${path}` : "";
  return `${SITE_URL}${p}`;
}

type PageSeoInput = {
  title: string;
  description?: string;
  path?: string;
  keywords?: string[];
  noIndex?: boolean;
};

export function buildPageMetadata({
  title,
  description = DEFAULT_DESCRIPTION,
  path = "",
  keywords = DEFAULT_KEYWORDS,
  noIndex = false,
}: PageSeoInput): Metadata {
  const url = canonicalUrl(path);

  return {
    title,
    description,
    keywords,
    alternates: {
      canonical: url,
      languages: { "ru-RU": url },
    },
    openGraph: {
      type: "website",
      locale: "ru_RU",
      url,
      siteName: SITE_NAME,
      title: `${title} | ${SITE_NAME}`,
      description,
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} | ${SITE_NAME}`,
      description,
    },
    robots: noIndex
      ? { index: false, follow: false, googleBot: { index: false, follow: false } }
      : {
          index: true,
          follow: true,
          googleBot: {
            index: true,
            follow: true,
            "max-video-preview": -1,
            "max-image-preview": "large",
            "max-snippet": -1,
          },
        },
  };
}

export const NOINDEX_METADATA: Metadata = {
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: { index: false, follow: false, noimageindex: true },
  },
};
