"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

type Config = {
  enabled: boolean;
  botToken: string;
  chatId: string;
};

export function AdminNotificationsForm() {
  const [config, setConfig] = useState<Config>({
    enabled: false,
    botToken: "",
    chatId: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [testing, setTesting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/admin/notifications")
      .then((r) => r.json())
      .then((data: Config) => setConfig(data))
      .finally(() => setLoading(false));
  }, []);

  async function save() {
    setSaving(true);
    setMessage(null);
    const res = await fetch("/api/admin/notifications", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(config),
    });
    setSaving(false);
    setMessage(res.ok ? "Сохранено" : "Ошибка сохранения");
  }

  async function testSend() {
    setTesting(true);
    setMessage(null);
    try {
      const res = await fetch("/api/admin/notifications/test", { method: "POST" });
      const data = await res.json().catch(() => ({}));
      setMessage(
        res.ok ? "Тестовое сообщение отправлено" : (data.error ?? `Ошибка ${res.status}`)
      );
    } catch {
      setMessage("Ошибка: не удалось связаться с сервером");
    } finally {
      setTesting(false);
    }
  }

  if (loading) {
    return <p className="text-white/60">Загрузка…</p>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Telegram-уведомления админу</CardTitle>
        <CardDescription className="text-white/60">
          Отдельный бот только для вас: регистрации, заказы, оплаты, выдача агентов. Токен Login Widget
          (TELEGRAM_BOT_TOKEN) — другой.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center justify-between gap-4">
          <div>
            <Label htmlFor="notify-enabled">Включить уведомления</Label>
            <p className="text-sm text-white/50">При выключении сообщения не отправляются</p>
          </div>
          <input
            id="notify-enabled"
            type="checkbox"
            className="h-5 w-5 rounded border-white/20 bg-white/5 accent-sky-500"
            checked={config.enabled}
            onChange={(e) => setConfig((c) => ({ ...c, enabled: e.target.checked }))}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="bot-token">Токен бота (от @BotFather)</Label>
          <Input
            id="bot-token"
            type="text"
            className="font-mono text-sm"
            placeholder="123456789:AAH..."
            value={config.botToken}
            onChange={(e) => setConfig((c) => ({ ...c, botToken: e.target.value }))}
            autoComplete="off"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="chat-id">Chat ID администратора</Label>
          <Input
            id="chat-id"
            type="text"
            className="font-mono text-sm"
            placeholder="-1001234567890 или 123456789"
            value={config.chatId}
            onChange={(e) => setConfig((c) => ({ ...c, chatId: e.target.value }))}
          />
          <p className="text-sm text-white/50">
            Напишите боту /start, затем узнайте ID через @userinfobot или @getidsbot. Для группы —
            добавьте бота в группу и возьмите chat id (часто отрицательный).
          </p>
        </div>

        <div className="rounded-lg border border-white/10 bg-white/5 p-4 text-sm text-white/70">
          <p className="font-medium text-white">События с уведомлением:</p>
          <ul className="mt-2 list-inside list-disc space-y-1">
            <li>Регистрация пользователя</li>
            <li>Создание заказа (checkout)</li>
            <li>Успешная оплата (ЮKassa / Stripe)</li>
            <li>Выдача AI-агента после оплаты</li>
          </ul>
        </div>

        <div className="flex flex-wrap gap-3">
          <Button onClick={save} disabled={saving}>
            {saving ? "Сохранение…" : "Сохранить"}
          </Button>
          <Button variant="outline" onClick={testSend} disabled={testing}>
            {testing ? "Отправка…" : "Отправить тест"}
          </Button>
        </div>

        {message && (
          <p
            className={
              message.includes("отправлено") || message === "Сохранено"
                ? "text-emerald-400"
                : "text-red-400"
            }
          >
            {message}
          </p>
        )}
      </CardContent>
    </Card>
  );
}
