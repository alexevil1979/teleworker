import type { Agent } from "http";
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

function getProxyAgent(): Agent | undefined {
  if (cachedAgent !== null) return cachedAgent ?? undefined;

  const proxyUrl = process.env.TELEGRAM_PROXY?.trim();
  if (!proxyUrl) {
    cachedAgent = undefined;
    return undefined;
  }

  const timeoutSec = parseInt(process.env.TELEGRAM_PROXY_CONNECT_TIMEOUT ?? "10", 10);
  const timeout = (Number.isFinite(timeoutSec) && timeoutSec > 0 ? timeoutSec : 10) * 1000;
  const type = resolveProxyType(proxyUrl);

  cachedAgent =
    type === "http"
      ? new HttpsProxyAgent(proxyUrl, { timeout })
      : new SocksProxyAgent(proxyUrl, { timeout });

  return cachedAgent;
}

/** Все запросы к api.telegram.org — через TELEGRAM_PROXY, если задан. */
export async function telegramApiFetch(
  path: string,
  init?: RequestInit
): Promise<Response> {
  const url = path.startsWith("http") ? path : `${TELEGRAM_API}${path.startsWith("/") ? "" : "/"}${path}`;
  const agent = getProxyAgent();
  if (!agent) return fetch(url, init);
  return fetch(url, { ...init, dispatcher: agent } as RequestInit);
}

export function isTelegramProxyEnabled(): boolean {
  return Boolean(process.env.TELEGRAM_PROXY?.trim());
}
