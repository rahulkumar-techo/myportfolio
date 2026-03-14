import { NextRequest, NextResponse } from "next/server"
import { requireVerifiedGoogleUserSession } from "@/lib/auth"
import { createPortfolioItem, listPortfolioItems } from "@/repositories/portfolio-repository"

/* ================= GET TESTIMONIALS ================= */

export async function GET() {
  const testimonials = await listPortfolioItems("testimonials")

  return NextResponse.json({
    success: true,
    data: testimonials,
    meta: {
      total: testimonials.length,
      timestamp: new Date().toISOString()
    }
  })
}

/* ================= CREATE TESTIMONIAL ================= */

export async function POST(request: NextRequest) {
  try {
    const { session, response } = await requireVerifiedGoogleUserSession()

    if (response || !session) {
      return response
    }

    const body = await request.json()

    const requiredFields = ["role", "company", "content"]

    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json(
          { success: false, error: `Missing required field: ${field}` },
          { status: 400 }
        )
      }
    }

    const existingTestimonials = await listPortfolioItems("testimonials")
    const alreadySent = existingTestimonials.some(
      (testimonial: any) => testimonial.submittedByEmail?.toLowerCase() === session.user.email?.toLowerCase()
    )

    if (alreadySent) {
      return NextResponse.json(
        { success: false, error: "You have already submitted a testimonial." },
        { status: 409 }
      )
    }

    const newTestimonial = {
      id: crypto.randomUUID(),
      name: session.user.name || body.name,
      role: body.role,
      company: body.company,
      content: body.content,
      avatarUrl: session.user.image || "/testimonials/default.jpg",
      rating: body.rating || 5,
      featured: body.featured || false,
      createdAt: new Date(),
      submittedByEmail: session.user.email
    }

    await createPortfolioItem("testimonials", newTestimonial)

    return NextResponse.json(
      { success: true, data: newTestimonial },
      { status: 201 }
    )

  } catch {
    return NextResponse.json(
      { success: false, error: "Invalid request body" },
      { status: 400 }
    )
  }
}
