import { NextResponse } from "next/server";
import { getEmailSubscriber, updateEmailPreferences } from "@/repositories/notification-repository";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({} as any));
  const email = typeof body?.email === "string" ? body.email.trim() : "";
  const preferences = body?.preferences ?? null;

  if (!email) {
    return NextResponse.json({ success: false, error: "Email is required." }, { status: 400 });
  }

  if (!preferences) {
    return NextResponse.json({ success: false, error: "Preferences are required." }, { status: 400 });
  }

  const subscriber = await getEmailSubscriber(email);
  if (!subscriber) {
    return NextResponse.json({ success: false, error: "Subscriber not found." }, { status: 404 });
  }

  if (subscriber.status !== "subscribed") {
    return NextResponse.json(
      { success: false, error: "Please confirm your email first.", status: subscriber.status },
      { status: 400 }
    );
  }

  const updated = await updateEmailPreferences(email, preferences);
  return NextResponse.json({ success: true, data: updated });
}
