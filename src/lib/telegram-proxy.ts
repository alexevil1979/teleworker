import https from "node:https";
import type { Agent } from "node:http";
import { HttpsProxyAgent } from "https-proxy-agent";
import { SocksProxyAgent } from "socks-proxy-agent";

const TELEGRAM_API = "https://api.telegram.org";

let cachedAgent: Agent | undefined | null = null;

function resolveProxyType(proxyUrl: string): "socks" | "http" {
  const explicit = (process.env.TELEGRAM_PROXY_TYPE ?? "auto").trim().toLowerCase();
  if (explicit === "socks" || explicit === "socks5" || explicit === "socks5h") return "socks";
  if (explicit === "http" || explicit === "https") return "http";
  if (/^socks/i.test(proxyUrl)) return "socks";
  if (/^https?:/i.test(proxyUrl)) return "http";
  return "socks";
}

function connectTimeoutMs(): number {
  const timeoutSec = parseInt(process.env.TELEGRAM_PROXY_CONNECT_TIMEOUT ?? "10", 10);
  return (Number.isFinite(timeoutSec) && timeoutSec > 0 ? timeoutSec : 10) * 1000;
}

function getProxyAgent(): Agent | undefined {
  if (cachedAgent !== null) return cachedAgent ?? undefined;

  const proxyUrl = process.env.TELEGRAM_PROXY?.trim();
  if (!proxyUrl) {
    cachedAgent = undefined;
    return undefined;
  }

  const timeout = connectTimeoutMs();
  const type = resolveProxyType(proxyUrl);

  cachedAgent =
    type === "http"
      ? new HttpsProxyAgent(proxyUrl, { timeout })
      : new SocksProxyAgent(proxyUrl, { timeout });

  return cachedAgent;
}

export function formatTelegramNetworkError(e: unknown): string {
  const msg = e instanceof Error ? e.message : String(e);
  const code = e && typeof e === "object" && "code" in e ? String((e as { code: string }).code) : "";

  if (code === "ECONNREFUSED" || msg.includes("ECONNREFUSED")) {
    return "Прокси недоступен. Проверьте, что SOCKS на 127.0.0.1:1080 запущен (ssh -D / dante).";
  }
  if (code === "ETIMEDOUT" || msg.includes("ETIMEDOUT") || msg.includes("timeout")) {
    return "Таймаут: прокси или api.telegram.org не отвечает.";
  }
  if (msg === "fetch failed") {
    return "Сбой сети через прокси. Проверьте TELEGRAM_PROXY и SOCKS-сервис на VPS.";
  }
  return msg;
}

type TelegramApiResult = {
  ok: boolean;
  status: number;
  data?: { ok: boolean; description?: string };
  error?: string;
};

/** POST к api.telegram.org — через TELEGRAM_PROXY (https + agent), совместимо с Next standalone. */
export function telegramApiPost(path: string, body: Record<string, unknown>): Promise<TelegramApiResult> {
  const url = `${TELEGRAM_API}${path.startsWith("/") ? path : `/${path}`}`;
  const payload = JSON.stringify(body);
  const agent = getProxyAgent();
  const timeout = connectTimeoutMs();

  return new Promise((resolve) => {
    const parsed = new URL(url);
    const req = https.request(
      {
        hostname: parsed.hostname,
        port: parsed.port || 443,
        path: parsed.pathname,
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Content-Length": Buffer.byteLength(payload),
        },
        agent,
        timeout,
      },
      (res) => {
        let raw = "";
        res.on("data", (chunk) => {
          raw += chunk;
        });
        res.on("end", () => {
          try {
            const data = JSON.parse(raw) as { ok: boolean; description?: string };
            resolve({
              ok: data.ok === true,
              status: res.statusCode ?? 0,
              data,
              error: data.ok ? undefined : (data.description ?? `HTTP ${res.statusCode}`),
            });
          } catch {
            resolve({
              ok: false,
              status: res.statusCode ?? 0,
              error: raw.slice(0, 300) || "Некорректный ответ Telegram API",
            });
          }
        });
      }
    );

    req.on("timeout", () => {
      req.destroy();
      resolve({
        ok: false,
        status: 0,
        error: isTelegramProxyEnabled()
          ? "Таймаут соединения через прокси"
          : "Таймаут соединения с Telegram API",
      });
    });

    req.on("error", (e) => {
      resolve({ ok: false, status: 0, error: formatTelegramNetworkError(e) });
    });

    req.write(payload);
    req.end();
  });
}

export function isTelegramProxyEnabled(): boolean {
  return Boolean(process.env.TELEGRAM_PROXY?.trim());
}
