"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { agentConfigSchema } from "@/lib/validations";
import type { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type FormData = z.infer<typeof agentConfigSchema>;

export function AgentSettingsForm({
  agentId,
  defaultValues,
}: {
  agentId: string;
  defaultValues: FormData;
}) {
  const [saved, setSaved] = useState(false);
  const { register, handleSubmit, formState: { isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(agentConfigSchema),
    defaultValues,
  });

  async function onSubmit(data: FormData) {
    await fetch(`/api/agents/${agentId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <Label>Имя агента</Label>
        <Input className="mt-1" {...register("displayName")} />
      </div>
      <div>
        <Label>AI-провайдер</Label>
        <select
          className="mt-1 flex h-10 w-full rounded-lg border border-white/15 bg-white/5 px-3 text-white"
          {...register("aiProvider")}
        >
          <option value="gigachat">Gigachat</option>
          <option value="grok">Grok</option>
          <option value="claude">Claude</option>
        </select>
      </div>
      <div>
        <Label>Системный промпт</Label>
        <textarea
          className="mt-1 flex min-h-[120px] w-full rounded-lg border border-white/15 bg-white/5 p-3 text-sm text-white"
          {...register("systemPrompt")}
        />
      </div>
      <Button type="submit" disabled={isSubmitting}>
        {saved ? "Сохранено" : "Сохранить"}
      </Button>
    </form>
  );
}
