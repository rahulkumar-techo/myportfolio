import { NextResponse } from "next/server"
import { requireAdminApiSession } from "@/lib/auth"
import { listPortfolioItems } from "@/repositories/portfolio-repository"
import { findFirstAdmin, findUserById, updateUserProfileImage } from "@/repositories/user-repository"

export async function GET() {
  const { session, response } = await requireAdminApiSession()

  if (response || !session) {
    return response
  }

  let user = await findUserById(session.user.id)

  if (!user) {
    user = await findFirstAdmin()
  }

  if (!user) {
    return NextResponse.json(
      { success: false, error: "User not found" },
      { status: 404 }
    )
  }

  const ownerId = user._id.toString()
  const [projects, skills, experiences, testimonials] = await Promise.all([
    listPortfolioItems("projects", ownerId),
    listPortfolioItems("skills", ownerId),
    listPortfolioItems("experiences", ownerId),
    listPortfolioItems("testimonials", ownerId)
  ])

  const skillsByCategory = skills.reduce((acc: any, skill: any) => {
    acc[skill.category] = (acc[skill.category] || 0) + 1
    return acc
  }, {})

  const avgProficiency =
    skills.length > 0
      ? Math.round(
          skills.reduce((sum: number, s: any) => sum + s.proficiency, 0) /
            skills.length
        )
      : 0

  return NextResponse.json({
    success: true,
    data: {
      profile: {
        name: user.name,
        email: user.email,
        image: user.image
      },

      stats: {
        totalProjects: projects.length,
        featuredProjects: projects.filter((p: any) => p.featured).length,
        totalSkills: skills.length,
        yearsExperience: experiences.length,
        testimonials: testimonials.length
      },

      skills: {
        total: skills.length,
        byCategory: skillsByCategory,
        averageProficiency: avgProficiency
      }
    },

    meta: {
      version: "1.0.0",
      lastUpdated: new Date().toISOString()
    }
  })
}

export async function PUT(request: Request) {
  const { session, response } = await requireAdminApiSession()

  if (response || !session) {
    return response
  }

  const body = await request.json().catch(() => ({} as any))
  const imageUrl = typeof body?.imageUrl === "string" ? body.imageUrl.trim() : ""

  if (!imageUrl) {
    return NextResponse.json({ success: false, error: "imageUrl is required." }, { status: 400 })
  }

  try {
    const user = await updateUserProfileImage(session.user.id, imageUrl)
    return NextResponse.json({
      success: true,
      data: {
        profile: {
          name: user.name,
          email: user.email,
          image: user.image
        }
      }
    })
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error?.message ?? "Unable to update profile image." },
      { status: 400 }
    )
  }
}
