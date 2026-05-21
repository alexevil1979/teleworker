import { telegramApiPost } from "@/lib/telegram-proxy";

export async function sendTelegramMessage(
  botToken: string,
  chatId: string,
  text: string
): Promise<{ ok: boolean; error?: string }> {
  const result = await telegramApiPost(`/bot${botToken}/sendMessage`, {
    chat_id: chatId,
    text,
    parse_mode: "HTML",
    disable_web_page_preview: true,
  });

  if (!result.ok) {
    return { ok: false, error: result.error ?? "Telegram API error" };
  }
  return { ok: true };
}
