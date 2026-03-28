import { NextResponse } from "next/server";
import { registerPushToken } from "@/repositories/notification-repository";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({} as any));
  const token = typeof body?.token === "string" ? body.token.trim() : "";

  if (!token) {
    return NextResponse.json({ success: false, error: "Token is required." }, { status: 400 });
  }

  const record = await registerPushToken({
    token,
    preferences: body?.preferences ?? undefined,
    userAgent: request.headers.get("user-agent") ?? ""
  });

  return NextResponse.json({ success: true, data: record });
}
