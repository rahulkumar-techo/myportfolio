import { NextResponse } from "next/server"
import { requireAdminApiSession } from "@/lib/auth"
import { getUserSettings, updateUserSettings } from "@/repositories/user-repository"

export async function GET() {
  const { session, response } = await requireAdminApiSession()

  if (response || !session) {
    return response
  }

  const settings = await getUserSettings(session.user.id)

  return NextResponse.json({
    success: true,
    data: settings
  })
}

export async function PUT(request: Request) {
  const { session, response } = await requireAdminApiSession()

  if (response || !session) {
    return response
  }

  const body = await request.json()
  const settings = await updateUserSettings(session.user.id, body)

  return NextResponse.json({
    success: true,
    data: settings
  })
}
