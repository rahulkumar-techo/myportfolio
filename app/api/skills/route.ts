import { NextRequest, NextResponse } from "next/server"
import { requireAdminApiSession } from "@/lib/auth"
import { createPortfolioItem, listPortfolioItems } from "@/repositories/portfolio-repository"

export async function GET(request: NextRequest) {
  const skills = await listPortfolioItems("skills")

  const { searchParams } = new URL(request.url)
  const category = searchParams.get("category")

  let filteredSkills = skills

  if (category) {
    filteredSkills = skills.filter((s: any) => s.category === category)
  }

  // Group by category
  const grouped = filteredSkills.reduce((acc: any, skill: any) => {
    if (!acc[skill.category]) {
      acc[skill.category] = []
    }

    acc[skill.category].push(skill)
    return acc
  }, {})

  return NextResponse.json({
    success: true,
    data: filteredSkills,
    grouped,
    meta: {
      total: filteredSkills.length,
      categories: Object.keys(grouped)
    }
  })
}

export async function POST(request: NextRequest) {
  try {
    const { session, response } = await requireAdminApiSession()

    if (response || !session) {
      return response
    }

    const body = await request.json()

    const newSkill = {
      id: crypto.randomUUID(),
      name: body.name,
      category: body.category,
      proficiency: body.proficiency || 50,
      icon: body.icon || ""
    }

    await createPortfolioItem("skills", newSkill, session.user.id)

    return NextResponse.json(
      { success: true, data: newSkill },
      { status: 201 }
    )

  } catch {
    return NextResponse.json(
      { success: false, error: "Invalid request body" },
      { status: 400 }
    )
  }
}
