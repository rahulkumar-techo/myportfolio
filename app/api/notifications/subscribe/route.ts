import { NextResponse } from "next/server";
import { getEmailSubscriber, upsertEmailSubscriber } from "@/repositories/notification-repository";
import { sendConfirmationMail } from "@/services/email.service";
import { getAppBaseUrl } from "@/utils/app-url";

export const runtime = "nodejs";

function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({} as any));
  const email = typeof body?.email === "string" ? body.email.trim() : "";

  if (!email || !isValidEmail(email)) {
    return NextResponse.json({ success: false, error: "Valid email is required." }, { status: 400 });
  }

  const existing = await getEmailSubscriber(email);
  if (existing?.status === "subscribed") {
    return NextResponse.json({ success: true, data: existing, status: "subscribed" });
  }

  const subscriber = await upsertEmailSubscriber({
    email,
    name: typeof body?.name === "string" ? body.name.trim() : "",
    preferences: body?.preferences ?? undefined,
    source: "website"
  });

  const baseUrl = getAppBaseUrl();
  const confirmUrl = baseUrl
    ? `${baseUrl}/notifications/confirm?token=${subscriber.verificationToken}`
    : `/notifications/confirm?token=${subscriber.verificationToken}`;

  await sendConfirmationMail({
    user: {
      name: subscriber.name || email.split("@")[0],
      email: subscriber.email
    },
    confirmUrl
  });

  return NextResponse.json({ success: true, status: "pending" });
}
