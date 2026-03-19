import type { PublicProfileSummary, SiteSettings } from "@/lib/types"
import { listPortfolioItemsByOwnerId } from "@/repositories/portfolio-repository"
import { listPublicAssetsByOwnerId } from "@/repositories/asset-repository"
import { findFirstAdmin, getDefaultSettings, getUserSettings } from "@/repositories/user-repository"

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

function buildEmptyProfile(settings: SiteSettings): PublicProfileSummary {
  return {
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
}

async function resolvePublicOwner() {
  const admin = await findFirstAdmin()

  if (!admin) {
    return {
      admin: null,
      settings: getDefaultSettings()
    }
  }

  const settings = await getUserSettings(admin._id.toString())
  return {
    admin,
    settings
  }
}

async function getPublicCollections(ownerId: string) {
  const [projects, skills, experiences, testimonials] = await Promise.all([
    listPortfolioItemsByOwnerId("projects", ownerId),
    listPortfolioItemsByOwnerId("skills", ownerId),
    listPortfolioItemsByOwnerId("experiences", ownerId),
    listPortfolioItemsByOwnerId("testimonials", ownerId)
  ])

  return { projects, skills, experiences, testimonials }
}

export async function getPublicProfileData() {
  const { admin, settings } = await resolvePublicOwner()

  if (!admin) {
    return buildEmptyProfile(settings)
  }

  const { projects, skills, experiences, testimonials } = await getPublicCollections(admin._id.toString())

  const topSkills = [...skills]
    .sort((left: any, right: any) => (right.proficiency ?? 0) - (left.proficiency ?? 0))
    .slice(0, 5)
    .map((skill: any) => skill.name)
  const yearsExperience = calculateYearsExperience(experiences)

  return {
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
  } satisfies PublicProfileSummary
}

export async function getPublicHomeData() {
  const { admin, settings } = await resolvePublicOwner()

  if (!admin) {
    return {
      profile: buildEmptyProfile(settings),
      projects: [],
      skills: [],
      experiences: [],
      testimonials: [],
      assets: []
    }
  }

  const ownerId = admin._id.toString()
  const [collections, assets] = await Promise.all([
    getPublicCollections(ownerId),
    listPublicAssetsByOwnerId(ownerId)
  ])

  const topSkills = [...collections.skills]
    .sort((left: any, right: any) => (right.proficiency ?? 0) - (left.proficiency ?? 0))
    .slice(0, 5)
    .map((skill: any) => skill.name)
  const yearsExperience = calculateYearsExperience(collections.experiences)

  return {
    profile: {
      profile: {
        name: admin.name,
        email: admin.email,
        image: admin.image ?? null
      },
      settings,
      stats: {
        totalProjects: collections.projects.length,
        featuredProjects: collections.projects.filter((project: any) => project.featured).length,
        totalSkills: collections.skills.length,
        totalExperience: collections.experiences.length,
        yearsExperience,
        testimonials: collections.testimonials.length
      },
      highlights: {
        topSkills
      }
    },
    projects: collections.projects,
    skills: collections.skills,
    experiences: collections.experiences,
    testimonials: collections.testimonials,
    assets
  }
}

export function serializeForClient<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T
}
