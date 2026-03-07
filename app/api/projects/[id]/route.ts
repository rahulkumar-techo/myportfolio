import { NextResponse } from "next/server"
import { requireAdminApiSession } from "@/lib/auth"
import {
  deletePortfolioItemById,
  getPortfolioItemById,
  updatePortfolioItemById
} from "@/repositories/portfolio-repository"

/* ================= GET PROJECT ================= */

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const project = await getPortfolioItemById("projects", id)

  if (!project) {
    return NextResponse.json(
      { success: false, error: "Project not found" },
      { status: 404 }
    )
  }

  return NextResponse.json({
    success: true,
    data: project
  })
}

/* ================= UPDATE PROJECT ================= */

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params

  try {
    const { session, response } = await requireAdminApiSession()

    if (response || !session) {
      return response
    }

    const body = await request.json()
    const updatedProject = await updatePortfolioItemById(
      "projects",
      id,
      { ...body, updatedAt: new Date() },
      session.user.id
    )

    if (!updatedProject) {
      return NextResponse.json(
        { success: false, error: "Project not found" },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: updatedProject
    })

  } catch {
    return NextResponse.json(
      { success: false, error: "Invalid request body" },
      { status: 400 }
    )
  }
}

/* ================= DELETE PROJECT ================= */

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const { session, response } = await requireAdminApiSession()

  if (response || !session) {
    return response
  }

  const deleted = await deletePortfolioItemById("projects", id, session.user.id)

  if (!deleted) {
    return NextResponse.json(
      { success: false, error: "Project not found" },
      { status: 404 }
    )
  }

  return NextResponse.json({
    success: true,
    message: `Project ${id} deleted successfully`
  })
}
