import { NextRequest, NextResponse } from "next/server"
import { requireAdminApiSession } from "@/lib/auth"
import { deleteUserAccount, updateUserBlockedStatus } from "@/repositories/user-repository"

export async function PATCH(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  const { session, response } = await requireAdminApiSession()

  if (response || !session) {
    return response
  }

  const { id } = await context.params
  const body = await request.json()

  if (typeof body.blocked !== "boolean") {
    return NextResponse.json({ success: false, error: "Blocked must be a boolean." }, { status: 400 })
  }

  try {
    const user = await updateUserBlockedStatus(id, body.blocked, session.user.id)

    return NextResponse.json({
      success: true,
      data: {
        id: user._id.toString(),
        blocked: user.blocked
      }
    })
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error?.message ?? "Unable to update the user." },
      { status: 400 }
    )
  }
}

export async function DELETE(_request: NextRequest, context: { params: Promise<{ id: string }> }) {
  const { session, response } = await requireAdminApiSession()

  if (response || !session) {
    return response
  }

  const { id } = await context.params

  try {
    await deleteUserAccount(id, session.user.id)

    return NextResponse.json({ success: true })
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error?.message ?? "Unable to delete the user." },
      { status: 400 }
    )
  }
}
