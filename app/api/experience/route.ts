import { NextRequest, NextResponse } from "next/server"
import { requireAdminApiSession } from "@/lib/auth"
import { createPortfolioItem, listPortfolioItems } from "@/repositories/portfolio-repository"

export async function GET() {
  const experiences = await listPortfolioItems("experiences")

  const sortedExperiences = [...experiences].sort((a, b) => {
    const dateA = new Date(a.startDate)
    const dateB = new Date(b.startDate)
    return dateB.getTime() - dateA.getTime()
  })

  return NextResponse.json({
    success: true,
    data: sortedExperiences,
    meta: {
      total: sortedExperiences.length,
      currentPosition: sortedExperiences.find((e: any) => e.current)
    }
  })
}

export async function POST(request: NextRequest) {
  const { session, response } = await requireAdminApiSession()

  if (response || !session) {
    return response
  }

  const body = await request.json()

  const newExperience = {
    id: crypto.randomUUID(),
    title: body.title,
    company: body.company,
    companyUrl: body.companyUrl || "",
    location: body.location,
    startDate: body.startDate,
    endDate: body.endDate || "",
    current: body.current || false,
    description: body.description,
    achievements: body.achievements || [],
    technologies: body.technologies || []
  }

  await createPortfolioItem("experiences", newExperience, session.user.id)

  return NextResponse.json({
    success: true,
    data: newExperience
  }, { status: 201 })
}
