import { ImageResponse } from "next/og";
import { SITE_NAME } from "@/lib/seo";

export const runtime = "edge";
export const alt = "TeleAgent — AI Telegram-аккаунты";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: 80,
          background: "linear-gradient(135deg, #070d18 0%, #0f1729 50%, #1e3a5f 100%)",
          color: "#f0f4f8",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        <div style={{ fontSize: 28, color: "#38bdf8", marginBottom: 16 }}>teleworker.fun</div>
        <div style={{ fontSize: 64, fontWeight: 700, lineHeight: 1.1, maxWidth: 900 }}>
          {SITE_NAME}
        </div>
        <div style={{ fontSize: 32, marginTop: 24, color: "#94a3b8", maxWidth: 800 }}>
          AI Telegram-аккаунты: диалоги, RAG, группы · Gigachat, Grok, Claude
        </div>
      </div>
    ),
    { ...size }
  );
}
