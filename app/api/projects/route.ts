import { NextResponse } from "next/server";
import { requireAdminApiSession } from "@/lib/auth";
import { createPortfolioItem, listPortfolioItems } from "@/repositories/portfolio-repository";
import { removeTempProjectUploadsByPublicIds } from "@/repositories/temp-upload-repository";
import { notifySubscribers } from "@/utils/notify-subscribers";
import { slugify } from "@/utils/slugify";
import { getAppBaseUrl } from "@/utils/app-url";

export async function GET() {
  const projects = await listPortfolioItems("projects")

  return NextResponse.json({
    success: true,
    data: projects,
    meta: {
      total: projects.length,
      timestamp: new Date().toISOString()
    }
  })
}

export async function POST(request: Request) {
  try {
    const { session, response } = await requireAdminApiSession()

    if (response || !session) {
      return response
    }

    const body = await request.json()

    const requiredFields = ["title", "description", "category"]

    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json(
          { success: false, error: `Missing required field: ${field}` },
          { status: 400 }
        )
      }
    }

    const rawGalleryImages =
      typeof body.galleryImages === "string"
        ? (() => {
            try {
              return JSON.parse(body.galleryImages)
            } catch {
              return []
            }
          })()
        : body.galleryImages

    const galleryImages = Array.isArray(rawGalleryImages)
      ? rawGalleryImages
          .map((image: any) => (typeof image === "string" ? { url: image } : image))
          .filter((image: any) => image && typeof image.url === "string" && image.url.trim().length > 0)
      : []

    if (galleryImages.length > 5) {
      return NextResponse.json(
        { success: false, error: "Gallery images must be 5 or fewer." },
        { status: 400 }
      )
    }

    const rawCoverImage =
      typeof body.coverImage === "string"
        ? (() => {
            try {
              return JSON.parse(body.coverImage)
            } catch {
              return undefined
            }
          })()
        : body.coverImage

    if (!rawCoverImage && !(body.image && typeof body.image.url === "string") && !body.imageUrl) {
      return NextResponse.json(
        { success: false, error: "Cover image is required." },
        { status: 400 }
      )
    }

    const newProject = {
      id: crypto.randomUUID(),
      title: body.title,
      description: body.description,
      slug: body.slug || slugify(body.title || ""),
      longDescription: body.longDescription || "",
      problem: body.problem || "",
      solution: body.solution || "",
      architecture: body.architecture || "",
      results: body.results || "",
      techStack: body.techStack || [],
      coverImage: rawCoverImage && typeof rawCoverImage.url === "string"
        ? rawCoverImage
        : body.image && typeof body.image.url === "string"
          ? body.image
          : body.imageUrl
            ? { url: body.imageUrl }
            : null,
      galleryImages,
      liveUrl: body.liveUrl || "",
      githubUrl: body.githubUrl || "",
      featured: body.featured || false,
      category: body.category,
      createdAt: new Date()
    }


    const startMs = Date.now();
    const savedProject = await createPortfolioItem("projects", newProject, session.user.id);
    const createMs = Date.now() - startMs;
    console.log("createPortfolioItem ms:", createMs);

    // notify subscribers about the new project
    if (savedProject) {
      const usedPublicIds = [
        newProject.coverImage?.publicId,
        ...(newProject.galleryImages ?? []).map((image: any) => image?.publicId)
      ].filter((id): id is string => typeof id === "string" && id.length > 0)

      await removeTempProjectUploadsByPublicIds(session.user.id, usedPublicIds)

      const baseUrl = getAppBaseUrl();
      const projectUrl = baseUrl
        ? `${baseUrl}/projects/${newProject.slug}`
        : `/projects/${newProject.slug}`;

      await notifySubscribers({
        type: "project",
        title: newProject.title,
        description: newProject.description,
        url: projectUrl
      });
    }

    return NextResponse.json(
      { success: true, data: newProject },
      { status: 201 }
    )

  } catch (error: any) {
    console.log(error)
    return NextResponse.json(
      { success: false, error: "Invalid request body" },
      { status: 400 }
    )
  }
}
