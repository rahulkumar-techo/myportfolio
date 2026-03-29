import { NextResponse } from "next/server";
import { listNotificationFeedEntries } from "@/repositories/notification-repository";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const limitParam = Number(searchParams.get("limit") ?? "50");
  const limit = Number.isFinite(limitParam) ? limitParam : 50;

  const entries = await listNotificationFeedEntries(limit);
  const serializedEntries = entries.map((entry) => ({
    type: entry.type,
    title: entry.title,
    createdAt: entry.createdAt instanceof Date ? entry.createdAt.toISOString() : String(entry.createdAt)
  }));

  return NextResponse.json({ entries: serializedEntries });
}
