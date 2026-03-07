import { NextRequest, NextResponse } from "next/server"
import { requireAdminApiSession } from "@/lib/auth"
import {
  deletePortfolioItemById,
  getPortfolioItemById,
  updatePortfolioItemById
} from "@/repositories/portfolio-repository"

/* ================= GET SINGLE EXPERIENCE ================= */

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const experience = await getPortfolioItemById("experiences", id)

  if (!experience) {
    return NextResponse.json(
      { error: "Experience not found" },
      { status: 404 }
    )
  }

  return NextResponse.json(experience)
}

/* ================= UPDATE EXPERIENCE ================= */

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
  const updatedExperience = await updatePortfolioItemById("experiences", id, body, session.user.id)

  if (!updatedExperience) {
    return NextResponse.json(
      { error: "Experience not found" },
      { status: 404 }
    )
  }
  return NextResponse.json(updatedExperience)
}

/* ================= DELETE EXPERIENCE ================= */

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const { session, response } = await requireAdminApiSession()

  if (response || !session) {
    return response
  }

  const deleted = await deletePortfolioItemById("experiences", id, session.user.id)

  if (!deleted) {
    return NextResponse.json(
      { error: "Experience not found" },
      { status: 404 }
    )
  }

  return NextResponse.json({ success: true })
}
