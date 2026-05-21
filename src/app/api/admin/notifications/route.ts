import { NextResponse } from "next/server";
import { auth } from "@/auth";
import {
  getAdminNotifyConfig,
  saveAdminNotifyConfig,
  type AdminNotifyConfig,
} from "@/lib/admin-notifications";

async function requireAdmin() {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") {
    return null;
  }
  return session;
}

export async function GET() {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  const config = await getAdminNotifyConfig();
  return NextResponse.json(config);
}

export async function POST(req: Request) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  const body = (await req.json()) as Partial<AdminNotifyConfig>;
  const config: AdminNotifyConfig = {
    enabled: Boolean(body.enabled),
    botToken: String(body.botToken ?? "").trim(),
    chatId: String(body.chatId ?? "").trim(),
  };
  await saveAdminNotifyConfig(config);
  return NextResponse.json({ ok: true });
}
