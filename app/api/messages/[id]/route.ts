import { NextRequest, NextResponse } from "next/server"
import { requireAdminApiSession } from "@/lib/auth"
import {
  deletePortfolioItemById,
  getPortfolioItemById,
  updatePortfolioItemById
} from "@/repositories/portfolio-repository"

/* ================= GET SINGLE MESSAGE ================= */

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const { session, response } = await requireAdminApiSession()

  if (response || !session) {
    return response
  }

  const message = await getPortfolioItemById("contactMessages", id, session.user.id)

  if (!message) {
    return NextResponse.json(
      { success: false, error: "Message not found" },
      { status: 404 }
    )
  }

  return NextResponse.json({ success: true, data: message })
}

/* ================= UPDATE MESSAGE ================= */

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const { session, response } = await requireAdminApiSession()

  if (response || !session) {
    return response
  }

  const body = await request.json()
  const updatedMessage = await updatePortfolioItemById("contactMessages", id, body, session.user.id)

  if (!updatedMessage) {
    return NextResponse.json(
      { success: false, error: "Message not found" },
      { status: 404 }
    )
  }

  return NextResponse.json({
    success: true,
    data: updatedMessage
  })
}

/* ================= DELETE MESSAGE ================= */

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const { session, response } = await requireAdminApiSession()

  if (response || !session) {
    return response
  }

  const deleted = await deletePortfolioItemById("contactMessages", id, session.user.id)

  if (!deleted) {
    return NextResponse.json(
      { success: false, error: "Message not found" },
      { status: 404 }
    )
  }

  return NextResponse.json({ success: true })
}
