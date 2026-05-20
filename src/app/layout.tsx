import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin", "cyrillic"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL ?? "https://teleworker.fun"),
  title: {
    default: "TeleAgent — AI Telegram-аккаунты под ключ",
    template: "%s | TeleAgent",
  },
  description:
    "Платформа готовых автоматизированных Telegram-аккаунтов с ИИ: диалоги, RAG, активность в группах. Gigachat, Grok, Claude.",
  keywords: ["Telegram", "AI", "бот", "Gigachat", "автоматизация", "TeleAgent"],
  openGraph: {
    title: "TeleAgent — живые Telegram-аккаунты с ИИ",
    description: "Покупайте готовые AI-агенты для Telegram. Оплата ЮKassa и Stripe.",
    url: "https://teleworker.fun",
    siteName: "TeleAgent",
    locale: "ru_RU",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "TeleAgent",
    description: "AI Telegram-аккаунты для бизнеса",
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru" className="dark">
      <body className={`${geistSans.variable} ${geistMono.variable} min-h-screen antialiased`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
