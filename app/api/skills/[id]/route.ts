import { NextRequest, NextResponse } from "next/server"
import { requireAdminApiSession } from "@/lib/auth"
import {
  deletePortfolioItemById,
  getPortfolioItemById,
  updatePortfolioItemById
} from "@/repositories/portfolio-repository"

/* ================= GET SKILL ================= */

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const skill = await getPortfolioItemById("skills", id)

  if (!skill) {
    return NextResponse.json(
      { success: false, error: "Skill not found" },
      { status: 404 }
    )
  }

  return NextResponse.json({
    success: true,
    data: skill
  })
}

/* ================= UPDATE SKILL ================= */

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params

  try {
    const { session, response } = await requireAdminApiSession()

    if (response || !session) {
      return response
    }

    const body = await request.json()
    const updatedSkill = await updatePortfolioItemById(
      "skills",
      id,
      { ...body, updatedAt: new Date() },
      session.user.id
    )

    if (!updatedSkill) {
      return NextResponse.json(
        { success: false, error: "Skill not found" },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: updatedSkill
    })

  } catch {
    return NextResponse.json(
      { success: false, error: "Invalid request body" },
      { status: 400 }
    )
  }
}

/* ================= DELETE SKILL ================= */

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const { session, response } = await requireAdminApiSession()

  if (response || !session) {
    return response
  }

  const deleted = await deletePortfolioItemById("skills", id, session.user.id)

  if (!deleted) {
    return NextResponse.json(
      { success: false, error: "Skill not found" },
      { status: 404 }
    )
  }

  return NextResponse.json({
    success: true,
    message: `Skill ${id} deleted successfully`
})
}
