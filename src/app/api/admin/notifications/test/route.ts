import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { sendAdminTestNotification } from "@/lib/admin-notifications";

export async function POST() {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  const result = await sendAdminTestNotification();
  if (!result.ok) {
    return NextResponse.json({ error: result.error }, { status: 400 });
  }
  return NextResponse.json({ ok: true });
}
