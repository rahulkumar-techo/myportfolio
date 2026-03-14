import { NextResponse } from "next/server"
import { listPortfolioItems } from "@/repositories/portfolio-repository"
import {
  findFirstAdmin,
  getPublicSiteSettings
} from "@/repositories/user-repository"

export const dynamic = "force-dynamic"
export const revalidate = 0

function calculateYearsExperience(experiences: any[]) {
  const startDates = experiences
    .map((experience) => new Date(experience.startDate))
    .filter((date) => !Number.isNaN(date.getTime()))

  if (startDates.length === 0) {
    return 0
  }

  const earliestStart = startDates.sort((left, right) => left.getTime() - right.getTime())[0]
  const diffMs = Date.now() - earliestStart.getTime()
  return Math.max(1, Math.floor(diffMs / (1000 * 60 * 60 * 24 * 365.25)))
}

export async function GET() {
  const admin = await findFirstAdmin()
  const settings = await getPublicSiteSettings()

  if (!admin) {
    return NextResponse.json({
      success: true,
      data: {
        profile: {
          name: settings.siteTitle,
          email: settings.contactEmail,
          image: null
        },
        settings,
        stats: {
          totalProjects: 0,
          featuredProjects: 0,
          totalSkills: 0,
          totalExperience: 0,
          yearsExperience: 0,
          testimonials: 0
        },
        highlights: {
          topSkills: []
        }
      }
    })
  }

  const [projects, skills, experiences, testimonials] = await Promise.all([
    listPortfolioItems("projects", admin._id.toString()),
    listPortfolioItems("skills", admin._id.toString()),
    listPortfolioItems("experiences", admin._id.toString()),
    listPortfolioItems("testimonials", admin._id.toString())
  ])

  const topSkills = [...skills]
    .sort((left: any, right: any) => (right.proficiency ?? 0) - (left.proficiency ?? 0))
    .slice(0, 5)
    .map((skill: any) => skill.name)
  const yearsExperience = calculateYearsExperience(experiences)

  return NextResponse.json({
    success: true,
    data: {
      profile: {
        name: admin.name,
        email: admin.email,
        image: admin.image ?? null
      },
      settings,
      stats: {
        totalProjects: projects.length,
        featuredProjects: projects.filter((project: any) => project.featured).length,
        totalSkills: skills.length,
        totalExperience: experiences.length,
        yearsExperience,
        testimonials: testimonials.length
      },
      highlights: {
        topSkills
      }
    },
    meta: {
      lastUpdated: new Date().toISOString()
    }
  })
}
