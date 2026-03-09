import { NextResponse } from "next/server"
import { requireAdminApiSession } from "@/lib/auth"
import { getUserAnalytics } from "@/repositories/user-repository"

export async function GET() {
  const { response } = await requireAdminApiSession()

  if (response) {
    return response
  }

  const analytics = await getUserAnalytics()

  return NextResponse.json({
    success: true,
    data: analytics,
    meta: {
      generatedAt: new Date().toISOString(),
      activeWindowHours: 24
    }
  })
}
