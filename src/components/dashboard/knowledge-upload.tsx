"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type Chunk = { id: string; title: string | null; content: string; createdAt: Date };

export function KnowledgeUpload({
  agentId,
  chunks,
}: {
  agentId: string;
  chunks: Chunk[];
}) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [list, setList] = useState(chunks);
  const [loading, setLoading] = useState(false);

  async function upload(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    const res = await fetch(`/api/agents/${agentId}/knowledge`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, content }),
    });
    const data = await res.json();
    if (data.chunk) setList([data.chunk, ...list]);
    setContent("");
    setTitle("");
    setLoading(false);
  }

  return (
    <div>
      <form onSubmit={upload} className="space-y-3">
        <div>
          <Label>Заголовок (опционально)</Label>
          <Input className="mt-1" value={title} onChange={(e) => setTitle(e.target.value)} />
        </div>
        <div>
          <Label>Текст базы знаний</Label>
          <textarea
            className="mt-1 flex min-h-[100px] w-full rounded-lg border border-white/15 bg-white/5 p-3 text-sm text-white"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
            minLength={10}
          />
        </div>
        <Button type="submit" disabled={loading}>
          {loading ? "Загрузка..." : "Добавить в RAG"}
        </Button>
      </form>
      <ul className="mt-6 space-y-2">
        {list.map((c) => (
          <li key={c.id} className="rounded-lg border border-white/10 p-3 text-sm">
            {c.title && <p className="font-medium text-white">{c.title}</p>}
            <p className="text-white/60 line-clamp-2">{c.content}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
