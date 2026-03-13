import type { Project } from "@/lib/types"

type ProjectSource = Partial<Project> & {
  id?: string
  title?: string
  description?: string
  slug?: string
  longDescription?: string
  techStack?: unknown
  imageUrl?: string
  galleryImages?: unknown
  liveUrl?: string
  githubUrl?: string
  featured?: boolean
  category?: string
  createdAt?: string | Date
  updatedAt?: string | Date
}

export function normalizeProject(project: ProjectSource): Project {
  return {
    id: project.id ?? "",
    title: project.title ?? "",
    description: project.description ?? "",
    slug: typeof project.slug === "string" ? project.slug : undefined,
    longDescription: project.longDescription ?? "",
    techStack: Array.isArray(project.techStack)
      ? project.techStack.filter((tech): tech is string => typeof tech === "string")
      : [],
    imageUrl: project.imageUrl ?? "",
    galleryImages: Array.isArray(project.galleryImages)
      ? project.galleryImages.filter((image): image is string => typeof image === "string")
      : [],
    liveUrl: project.liveUrl ?? "",
    githubUrl: project.githubUrl ?? "",
    featured: Boolean(project.featured),
    category: project.category ?? "General",
    createdAt: project.createdAt
      ? new Date(project.createdAt).toISOString()
      : new Date().toISOString(),
    updatedAt: project.updatedAt
      ? new Date(project.updatedAt).toISOString()
      : undefined
  }
}

export function normalizeProjects(projects: unknown): Project[] {
  if (!Array.isArray(projects)) {
    return []
  }

  return projects.map((project) => normalizeProject((project ?? {}) as ProjectSource))
}
