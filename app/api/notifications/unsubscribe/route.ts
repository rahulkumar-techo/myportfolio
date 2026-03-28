import { NextResponse } from "next/server";
import { unsubscribeEmail } from "@/repositories/notification-repository";

export const runtime = "nodejs";

function getEmailFromUrl(request: Request) {
  try {
    const url = new URL(request.url);
    return url.searchParams.get("email") ?? "";
  } catch {
    return "";
  }
}

export async function GET(request: Request) {
  const email = getEmailFromUrl(request);
  if (!email) {
    return NextResponse.json({ success: false, error: "Email is required." }, { status: 400 });
  }

  await unsubscribeEmail(email);
  return NextResponse.json({ success: true });
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({} as any));
  const email = typeof body?.email === "string" ? body.email.trim() : "";

  if (!email) {
    return NextResponse.json({ success: false, error: "Email is required." }, { status: 400 });
  }

  await unsubscribeEmail(email);
  return NextResponse.json({ success: true });
}
