import { NextResponse } from "next/server";
import { confirmEmailSubscriber } from "@/repositories/notification-repository";

export const runtime = "nodejs";

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const token = url.searchParams.get("token");

    if (!token) {
      return NextResponse.json({ success: false, error: "Token is required." }, { status: 400 });
    }

    const subscriber = await confirmEmailSubscriber(token);
    if (!subscriber) {
      return NextResponse.json({ success: false, error: "Token is invalid or expired." }, { status: 400 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to confirm notification subscription", error);
    return NextResponse.json(
      { success: false, error: "Notification service is temporarily unavailable. Please try again later." },
      { status: 503 }
    );
  }
}
