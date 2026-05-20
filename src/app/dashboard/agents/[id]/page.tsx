import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { AgentSettingsForm } from "@/components/dashboard/agent-settings-form";
import { KnowledgeUpload } from "@/components/dashboard/knowledge-upload";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default async function AgentDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = await auth();

  const agent = await prisma.agent.findFirst({
    where: { id, userId: session!.user.id },
    include: {
      product: true,
      knowledgeChunks: { orderBy: { createdAt: "desc" }, take: 10 },
      chatLogs: { orderBy: { createdAt: "desc" }, take: 20 },
      activityStats: { orderBy: { date: "desc" }, take: 7 },
    },
  });

  if (!agent) notFound();

  const totalMessages = agent.activityStats.reduce((s, a) => s + a.messages, 0);

  return (
    <div className="max-w-3xl">
      <h1 className="text-2xl font-bold text-white">{agent.displayName}</h1>
      <p className="text-white/50">{agent.product.name} · {agent.aiProvider}</p>

      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        <Card>
          <CardContent className="py-4">
            <p className="text-2xl font-bold text-white">{totalMessages}</p>
            <p className="text-xs text-white/50">Сообщений (7 дн.)</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="py-4">
            <p className="text-2xl font-bold text-white">{agent.knowledgeChunks.length}</p>
            <p className="text-xs text-white/50">Блоков RAG</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="py-4">
            <p className="text-2xl font-bold text-white">{agent.chatLogs.length}</p>
            <p className="text-xs text-white/50">Логов (последние)</p>
          </CardContent>
        </Card>
      </div>

      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Настройки и промпт</CardTitle>
        </CardHeader>
        <CardContent>
          <AgentSettingsForm
            agentId={agent.id}
            defaultValues={{
              displayName: agent.displayName,
              systemPrompt: agent.systemPrompt ?? "",
              aiProvider: agent.aiProvider as "gigachat" | "grok" | "claude",
            }}
          />
        </CardContent>
      </Card>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>База знаний (RAG)</CardTitle>
        </CardHeader>
        <CardContent>
          <KnowledgeUpload agentId={agent.id} chunks={agent.knowledgeChunks} />
        </CardContent>
      </Card>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Логи чатов</CardTitle>
        </CardHeader>
        <CardContent className="max-h-64 space-y-2 overflow-y-auto text-sm">
          {agent.chatLogs.length === 0 ? (
            <p className="text-white/50">Пока нет логов</p>
          ) : (
            agent.chatLogs.map((log) => (
              <div key={log.id} className="rounded border border-white/10 p-2">
                <span className="text-xs text-white/40">{log.direction}</span>
                <p className="text-white/80">{log.message.slice(0, 200)}</p>
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
}
