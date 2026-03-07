import { NextRequest, NextResponse } from "next/server"
import { requireAdminApiSession } from "@/lib/auth"
import {
  deletePortfolioItemById,
  getPortfolioItemById,
  updatePortfolioItemById
} from "@/repositories/portfolio-repository"

/* ================= GET TESTIMONIAL ================= */

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const testimonial = await getPortfolioItemById("testimonials", id)

  if (!testimonial) {
    return NextResponse.json(
      { success: false, error: "Testimonial not found" },
      { status: 404 }
    )
  }

  return NextResponse.json({
    success: true,
    data: testimonial
  })
}

/* ================= UPDATE TESTIMONIAL ================= */

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
    const updatedTestimonial = await updatePortfolioItemById(
      "testimonials",
      id,
      { ...body, updatedAt: new Date() },
      session.user.id
    )

    if (!updatedTestimonial) {
      return NextResponse.json(
        { success: false, error: "Testimonial not found" },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: updatedTestimonial
    })

  } catch {
    return NextResponse.json(
      { success: false, error: "Invalid request body" },
      { status: 400 }
    )
  }
}

/* ================= DELETE TESTIMONIAL ================= */

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const { session, response } = await requireAdminApiSession()

  if (response || !session) {
    return response
  }

  const deleted = await deletePortfolioItemById("testimonials", id, session.user.id)

  if (!deleted) {
    return NextResponse.json(
      { success: false, error: "Testimonial not found" },
      { status: 404 }
    )
  }

  return NextResponse.json({
    success: true,
    message: `Testimonial ${id} deleted successfully`
})
}
