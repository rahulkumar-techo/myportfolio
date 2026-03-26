import type { CloudinaryImage, Project } from "@/lib/types"

type ProjectSource = Partial<Project> & {
  id?: string
  title?: string
  description?: string
  slug?: string
  longDescription?: string
  problem?: string
  solution?: string
  architecture?: string
  results?: string
  techStack?: unknown
  coverImage?: unknown
  image?: unknown
  imageUrl?: unknown
  galleryImages?: unknown
  liveUrl?: string
  githubUrl?: string
  featured?: boolean
  category?: string
  createdAt?: string | Date
  updatedAt?: string | Date
}

function normalizeImage(image: unknown, fallback?: unknown): CloudinaryImage | null {
  const candidate = image ?? fallback
  if (!candidate) {
    return null
  }

  if (typeof candidate === "string") {
    return candidate ? { url: candidate } : null
  }

  if (typeof candidate === "object") {
    const record = candidate as Partial<CloudinaryImage>
    if (typeof record.url === "string" && record.url.trim().length > 0) {
      return {
        url: record.url,
        publicId: typeof record.publicId === "string" ? record.publicId : undefined,
        format: typeof record.format === "string" ? record.format : undefined,
        width: typeof record.width === "number" ? record.width : undefined,
        height: typeof record.height === "number" ? record.height : undefined,
        bytes: typeof record.bytes === "number" ? record.bytes : undefined
      }
    }
  }

  return null
}

function normalizeGallery(images: unknown): CloudinaryImage[] {
  if (!Array.isArray(images)) {
    return []
  }

  return images
    .map((image) => normalizeImage(image))
    .filter((image): image is CloudinaryImage => Boolean(image))
    .slice(0, 5)
}

export function normalizeProject(project: ProjectSource): Project {
  const normalizedCoverImage = normalizeImage(
    project.coverImage,
    project.image ?? project.imageUrl
  )
  const normalizedGallery = normalizeGallery(project.galleryImages)

  return {
    id: project.id ?? "",
    title: project.title ?? "",
    description: project.description ?? "",
    slug: typeof project.slug === "string" ? project.slug : undefined,
    longDescription: project.longDescription ?? "",
    problem: project.problem ?? "",
    solution: project.solution ?? "",
    architecture: project.architecture ?? "",
    results: project.results ?? "",
    techStack: Array.isArray(project.techStack)
      ? project.techStack.filter((tech): tech is string => typeof tech === "string")
      : [],
    coverImage: normalizedCoverImage,
    galleryImages: normalizedGallery,
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
