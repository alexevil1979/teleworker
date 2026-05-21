import { prisma } from "@/lib/prisma";
import { sendTelegramMessage } from "@/lib/telegram-notify";
import { SITE_URL } from "@/lib/seo";

export const ADMIN_NOTIFY_SETTING_KEY = "admin_telegram_notify";

export type AdminNotifyConfig = {
  enabled: boolean;
  botToken: string;
  chatId: string;
};

const DEFAULT_CONFIG: AdminNotifyConfig = {
  enabled: false,
  botToken: "",
  chatId: "",
};

/** События, о которых уходит уведомление админу */
export const NOTIFY_ACTIONS = new Set([
  "user.register",
  "checkout.created",
  "payment.yookassa.succeeded",
  "payment.stripe.succeeded",
  "agent.provisioned",
]);

const ACTION_LABELS: Record<string, string> = {
  "user.register": "🆕 Регистрация",
  "checkout.created": "🛒 Новый заказ (ожидает оплаты)",
  "payment.yookassa.succeeded": "💳 Оплата ЮKassa",
  "payment.stripe.succeeded": "💳 Оплата Stripe",
  "agent.provisioned": "🤖 Выдан AI-агент",
};

export async function getAdminNotifyConfig(): Promise<AdminNotifyConfig> {
  const row = await prisma.siteSetting.findUnique({
    where: { key: ADMIN_NOTIFY_SETTING_KEY },
  });
  if (!row?.value || typeof row.value !== "object") {
    return {
      ...DEFAULT_CONFIG,
      botToken: process.env.TELEGRAM_ADMIN_BOT_TOKEN ?? "",
      chatId: process.env.TELEGRAM_ADMIN_CHAT_ID ?? "",
    };
  }
  const v = row.value as Partial<AdminNotifyConfig>;
  return {
    enabled: Boolean(v.enabled),
    botToken: String(v.botToken ?? process.env.TELEGRAM_ADMIN_BOT_TOKEN ?? ""),
    chatId: String(v.chatId ?? process.env.TELEGRAM_ADMIN_CHAT_ID ?? ""),
  };
}

export async function saveAdminNotifyConfig(config: AdminNotifyConfig) {
  await prisma.siteSetting.upsert({
    where: { key: ADMIN_NOTIFY_SETTING_KEY },
    create: {
      key: ADMIN_NOTIFY_SETTING_KEY,
      value: config,
    },
    update: { value: config },
  });
}

function formatMetadata(metadata?: Record<string, unknown>): string {
  if (!metadata || !Object.keys(metadata).length) return "";
  const lines = Object.entries(metadata)
    .slice(0, 6)
    .map(([k, v]) => `• ${k}: <code>${String(v)}</code>`)
    .join("\n");
  return lines ? `\n${lines}` : "";
}

export async function notifyAdminEvent(params: {
  action: string;
  entity?: string;
  entityId?: string;
  userId?: string | null;
  metadata?: Record<string, unknown>;
}) {
  if (!NOTIFY_ACTIONS.has(params.action)) return;

  const config = await getAdminNotifyConfig();
  if (!config.enabled || !config.botToken || !config.chatId) return;

  const label = ACTION_LABELS[params.action] ?? params.action;
  const userLine = params.userId ? `\nПользователь: <code>${params.userId}</code>` : "";
  const entityLine =
    params.entity && params.entityId
      ? `\n${params.entity}: <code>${params.entityId}</code>`
      : "";

  const text = [
    `<b>TeleAgent</b>`,
    `<b>${label}</b>`,
    userLine,
    entityLine,
    formatMetadata(params.metadata),
    `\n<a href="${SITE_URL}/admin">Открыть админку</a>`,
  ]
    .filter(Boolean)
    .join("");

  const result = await sendTelegramMessage(config.botToken, config.chatId, text);
  if (!result.ok) {
    console.error("[notifyAdmin]", result.error);
  }
}

export async function sendAdminTestNotification() {
  const config = await getAdminNotifyConfig();
  if (!config.botToken || !config.chatId) {
    return { ok: false, error: "Укажите токен бота и Chat ID" };
  }
  return sendTelegramMessage(
    config.botToken,
    config.chatId,
    `✅ <b>TeleAgent</b>\nТестовое уведомление.\nАдмин-бот подключён успешно.\n<a href="${SITE_URL}/admin/notifications">Настройки</a>`
  );
}
