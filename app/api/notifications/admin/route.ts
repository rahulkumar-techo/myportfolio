import { NextResponse } from "next/server";
import { requireAdminApiSession } from "@/lib/auth";
import {
  listEmailSubscribersForAdmin,
  listPushSubscribersForAdmin
} from "@/repositories/notification-repository";

export const runtime = "nodejs";

export async function GET() {
  const { session, response } = await requireAdminApiSession();

  if (response || !session) {
    return response;
  }

  const ownerId = session.user.id;
  const [emails, tokens] = await Promise.all([
    listEmailSubscribersForAdmin(ownerId),
    listPushSubscribersForAdmin(ownerId)
  ]);

  return NextResponse.json({
    success: true,
    data: {
      emails,
      tokens
    }
  });
}
