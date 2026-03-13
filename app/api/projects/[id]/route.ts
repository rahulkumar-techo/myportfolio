import { NextResponse } from "next/server"
import { requireAdminApiSession } from "@/lib/auth"
import {
  deletePortfolioItemById,
  getPortfolioItemById,
  listPortfolioItems,
  updatePortfolioItemById
} from "@/repositories/portfolio-repository"
import { removeTempProjectUploadsByPublicIds } from "@/repositories/temp-upload-repository"
import { slugify } from "@/utils/slugify"
import cloudinary from "@/lib/clodudinary"

/* ================= GET PROJECT ================= */

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  let project = await getPortfolioItemById("projects", id)

  if (!project) {
    const projects = await listPortfolioItems("projects")
    project = projects.find((item: any) => item?.slug === id) ?? null
  }

  if (!project) {
    return NextResponse.json(
      { success: false, error: "Project not found" },
      { status: 404 }
    )
  }

  return NextResponse.json({
    success: true,
    data: project
  })
}

/* ================= UPDATE PROJECT ================= */

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params

  try {
    const { session, response } = await requireAdminApiSession()

    if (response || !session) {
      return response
    }

    const body = await request.json()
    const rawGalleryImages =
      typeof body?.galleryImages === "string"
        ? (() => {
            try {
              return JSON.parse(body.galleryImages)
            } catch {
              return undefined
            }
          })()
        : body?.galleryImages

    const galleryImages = Array.isArray(rawGalleryImages)
      ? rawGalleryImages
          .map((image: any) => (typeof image === "string" ? { url: image } : image))
          .filter((image: any) => image && typeof image.url === "string" && image.url.trim().length > 0)
      : undefined

    if (galleryImages && galleryImages.length > 5) {
      return NextResponse.json(
        { success: false, error: "Gallery images must be 5 or fewer." },
        { status: 400 }
      )
    }

    const rawCoverImage =
      typeof body?.coverImage === "string"
        ? (() => {
            try {
              return JSON.parse(body.coverImage)
            } catch {
              return undefined
            }
          })()
        : body?.coverImage

    const hasCoverImageField = Object.prototype.hasOwnProperty.call(body ?? {}, "coverImage")
    const coverImageUrl =
      rawCoverImage && typeof rawCoverImage.url === "string" ? rawCoverImage.url : ""

    if (hasCoverImageField && !coverImageUrl) {
      return NextResponse.json(
        { success: false, error: "Cover image is required." },
        { status: 400 }
      )
    }

    const updates = {
      ...body,
      ...(galleryImages ? { galleryImages } : {}),
      ...(rawCoverImage && typeof rawCoverImage.url === "string"
        ? { coverImage: rawCoverImage }
        : body?.image && typeof body.image.url === "string"
          ? { coverImage: body.image }
          : body?.imageUrl
            ? { coverImage: { url: body.imageUrl } }
            : {}),
      updatedAt: new Date()
    }

    if (body?.title && !body?.slug) {
      updates.slug = slugify(body.title)
    }

    const updatedProject = await updatePortfolioItemById(
      "projects",
      id,
      updates,
      session.user.id
    )

    if (!updatedProject) {
      return NextResponse.json(
        { success: false, error: "Project not found" },
        { status: 404 }
      )
    }

    const usedPublicIds = [
      updatedProject.coverImage?.publicId,
      ...(updatedProject.galleryImages ?? []).map((image: any) => image?.publicId)
    ].filter((value: unknown): value is string => typeof value === "string" && value.length > 0)

    await removeTempProjectUploadsByPublicIds(session.user.id, usedPublicIds)

    return NextResponse.json({
      success: true,
      data: updatedProject
    })

  } catch {
    return NextResponse.json(
      { success: false, error: "Invalid request body" },
      { status: 400 }
    )
  }
}

/* ================= DELETE PROJECT ================= */

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const { session, response } = await requireAdminApiSession()

  if (response || !session) {
    return response
  }

  const project = await getPortfolioItemById("projects", id, session.user.id)
  const deleted = await deletePortfolioItemById("projects", id, session.user.id)

  if (!deleted) {
    return NextResponse.json(
      { success: false, error: "Project not found" },
      { status: 404 }
    )
  }

  const publicIds = [
    project?.coverImage?.publicId,
    ...(project?.galleryImages ?? []).map((image: any) => image?.publicId)
  ].filter((value: unknown): value is string => typeof value === "string" && value.length > 0)

  if (publicIds.length > 0) {
    cloudinary.config()
    void Promise.allSettled(
      publicIds.map((publicId) =>
        cloudinary.uploader.destroy(publicId, { resource_type: "image", invalidate: true })
      )
    ).then(() => removeTempProjectUploadsByPublicIds(session.user.id, publicIds))
  }

  return NextResponse.json({
    success: true,
    message: `Project ${id} deleted successfully`
  })
}
