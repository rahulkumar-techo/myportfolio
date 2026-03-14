import { NextResponse } from "next/server"
import path from "path"
import { requireAdminApiSession } from "@/lib/auth"
import cloudinary from "@/lib/clodudinary"
import { IMAGE_UPLOAD_PRESETS, type ImageUploadKind } from "@/lib/image-presets"
import { createAsset, deleteAsset } from "@/repositories/asset-repository"
import { removeTempAssetUploadsByPublicIds } from "@/repositories/temp-asset-upload-repository"
import type { AssetItem } from "@/lib/types"

export const runtime = "nodejs"
export const maxDuration = 60

const MAX_FILE_SIZE = 10 * 1024 * 1024
const ALLOWED_CATEGORIES = new Set(["cv", "achievement", "image", "certificate", "other"])
const CLOUDINARY_FOLDER = "portfolio/assets"

type StoredAsset = AssetItem & {
  fileId?: string
}

function sanitizeFileName(fileName: string) {
  return fileName.replace(/[^a-zA-Z0-9._-]/g, "-")
}

function buildPublicId(originalName: string) {
  const extension = path.extname(originalName)
  const baseName = path.basename(originalName, extension)

  return `${Date.now()}-${baseName}`
}

function uploadToCloudinary(file: File, originalName: string, kind?: ImageUploadKind) {
  return new Promise<{
    secure_url: string
    public_id: string
    bytes: number
  }>(async (resolve, reject) => {
    cloudinary.config()
    const buffer = Buffer.from(await file.arrayBuffer())
    const publicId = buildPublicId(originalName)
    const isImage = file.type.startsWith("image/")
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: CLOUDINARY_FOLDER,
        public_id: publicId,
        resource_type: isImage ? "image" : "auto",
        format: isImage ? "webp" : undefined,
        use_filename: false,
        unique_filename: false,
        overwrite: false,
        context: kind
          ? {
              upload_kind: kind,
              target_width: String(IMAGE_UPLOAD_PRESETS[kind].width),
              target_height: String(IMAGE_UPLOAD_PRESETS[kind].height)
            }
          : undefined
      },
      (error, result) => {
        if (error || !result) {
          reject(error ?? new Error("Upload failed."))
          return
        }

        resolve({
          secure_url: result.secure_url,
          public_id: result.public_id,
          bytes: result.bytes
        })
      }
    )

    stream.end(buffer)
  })
}

async function destroyCloudinaryAsset(fileId?: string) {
  if (!fileId) {
    return
  }

  cloudinary.config()
  await Promise.allSettled([
    cloudinary.uploader.destroy(fileId, { resource_type: "image", invalidate: true }),
    cloudinary.uploader.destroy(fileId, { resource_type: "raw", invalidate: true }),
    cloudinary.uploader.destroy(fileId, { resource_type: "video", invalidate: true })
  ])
}

export async function DELETE(_request: Request, context: { params: Promise<{ id: string }> }) {
  const { session, response } = await requireAdminApiSession()

  if (response || !session) {
    return response
  }

  const { id } = await context.params

  try {
    const asset = (await deleteAsset(session.user.id, id)) as StoredAsset

    await destroyCloudinaryAsset(asset.fileId)

    return NextResponse.json({ success: true })
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error?.message ?? "Unable to delete the asset." },
      { status: 400 }
    )
  }
}

export async function PUT(request: Request, context: { params: Promise<{ id: string }> }) {
  const { session, response } = await requireAdminApiSession()

  if (response || !session) {
    return response
  }

  const { id } = await context.params
  const contentType = request.headers.get("content-type") ?? ""

  if (contentType.includes("application/json")) {
    const body = await request.json().catch(() => ({} as any))
    const label = String(body?.label ?? "").trim()
    const category = String(body?.category ?? "other").trim()
    const featured = Boolean(body?.featured)
    const upload = body?.upload ?? null

    if (!label) {
      return NextResponse.json({ success: false, error: "Label is required." }, { status: 400 })
    }

    if (!ALLOWED_CATEGORIES.has(category)) {
      return NextResponse.json({ success: false, error: "Invalid category." }, { status: 400 })
    }

    let previousAsset: StoredAsset | null = null

    try {
      previousAsset = (await deleteAsset(session.user.id, id)) as StoredAsset
    } catch (error: any) {
      return NextResponse.json(
        { success: false, error: error?.message ?? "Unable to find the asset." },
        { status: 400 }
      )
    }

    const hasUpload = upload && typeof upload?.publicId === "string" && typeof upload?.url === "string"
    if (hasUpload) {
      const size = Number(upload?.size ?? upload?.bytes ?? 0)
      if (!Number.isFinite(size) || size <= 0 || size > MAX_FILE_SIZE) {
        await createAsset(session.user.id, previousAsset as AssetItem).catch(() => null)
        return NextResponse.json({ success: false, error: "File must be 10MB or smaller." }, { status: 400 })
      }
    }

    const nextAsset = {
      ...previousAsset,
      id,
      label,
      category: category as AssetItem["category"],
      featured,
      fileId: hasUpload ? upload.publicId : previousAsset.fileId,
      fileName: hasUpload ? path.basename(upload.publicId) : previousAsset.fileName,
      originalName: hasUpload
        ? sanitizeFileName(String(upload?.originalName ?? previousAsset.originalName ?? "asset"))
        : previousAsset.originalName,
      fileUrl: hasUpload ? upload.url : previousAsset.fileUrl,
      fileType: hasUpload ? String(upload?.fileType ?? previousAsset.fileType) : previousAsset.fileType,
      size: hasUpload ? Number(upload?.size ?? upload?.bytes ?? previousAsset.size) : previousAsset.size,
      uploadedAt: new Date().toISOString()
    } as AssetItem

    try {
      const updatedAsset = await createAsset(session.user.id, nextAsset)

      if (hasUpload && previousAsset.fileId && previousAsset.fileId !== upload.publicId) {
        await destroyCloudinaryAsset(previousAsset.fileId)
      }

      if (hasUpload) {
        await removeTempAssetUploadsByPublicIds(session.user.id, [upload.publicId])
      }

      return NextResponse.json({
        success: true,
        data: updatedAsset
      })
    } catch (error: any) {
      if (hasUpload) {
        await destroyCloudinaryAsset(upload.publicId)
        await removeTempAssetUploadsByPublicIds(session.user.id, [upload.publicId])
      }

      if (previousAsset) {
        await createAsset(session.user.id, previousAsset as AssetItem).catch(() => null)
      }

      return NextResponse.json(
        { success: false, error: error?.message ?? "Unable to update the asset." },
        { status: 400 }
      )
    }
  }

  const formData = await request.formData()
  const label = String(formData.get("label") ?? "").trim()
  const category = String(formData.get("category") ?? "other").trim()
  const file = formData.get("file")
  const kindValue = String(formData.get("kind") ?? "").trim()

  if (!label) {
    return NextResponse.json({ success: false, error: "Label is required." }, { status: 400 })
  }

  if (!ALLOWED_CATEGORIES.has(category)) {
    return NextResponse.json({ success: false, error: "Invalid category." }, { status: 400 })
  }

  if (file !== null && !(file instanceof File)) {
    return NextResponse.json({ success: false, error: "Invalid file." }, { status: 400 })
  }

  if (file instanceof File && file.size > MAX_FILE_SIZE) {
    return NextResponse.json({ success: false, error: "File must be 10MB or smaller." }, { status: 400 })
  }

  const uploadKind =
    file instanceof File && file.type.startsWith("image/") && kindValue === "asset-image"
      ? ("asset-image" as const)
      : undefined

  if (file instanceof File && uploadKind && file.size > IMAGE_UPLOAD_PRESETS[uploadKind].maxBytes) {
    return NextResponse.json({ success: false, error: "Optimized image assets must be under 2MB." }, { status: 400 })
  }

  let previousAsset: StoredAsset | null = null

  try {
    previousAsset = (await deleteAsset(session.user.id, id)) as StoredAsset
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error?.message ?? "Unable to find the asset." },
      { status: 400 }
    )
  }

  let uploadedFile:
    | {
        secure_url: string
        public_id: string
        bytes: number
      }
    | null = null

  try {
    if (file instanceof File && file.size > 0) {
      const originalName = sanitizeFileName(file.name || previousAsset.originalName || "asset")
      uploadedFile = await uploadToCloudinary(file, originalName, uploadKind)
    }

    const nextAsset = {
      ...previousAsset,
      id,
      label,
      category: category as AssetItem["category"],
      featured: String(formData.get("featured") ?? previousAsset.featured ?? "false") === "true",
      fileId: uploadedFile?.public_id ?? previousAsset.fileId,
      fileName: uploadedFile ? path.basename(uploadedFile.public_id) : previousAsset.fileName,
      originalName:
        file instanceof File && file.size > 0
          ? sanitizeFileName(file.name || previousAsset.originalName || "asset")
          : previousAsset.originalName,
      fileUrl: uploadedFile?.secure_url ?? previousAsset.fileUrl,
      fileType:
        file instanceof File && file.size > 0
          ? uploadKind
            ? "image/webp"
            : file.type || previousAsset.fileType
          : previousAsset.fileType,
      size: uploadedFile?.bytes ?? previousAsset.size,
      uploadedAt: new Date().toISOString()
    } as AssetItem

    const updatedAsset = await createAsset(session.user.id, nextAsset)

    if (uploadedFile?.public_id && previousAsset.fileId && previousAsset.fileId !== uploadedFile.public_id) {
      await destroyCloudinaryAsset(previousAsset.fileId)
    }

    return NextResponse.json({
      success: true,
      data: updatedAsset
    })
  } catch (error: any) {
    if (uploadedFile?.public_id) {
      await destroyCloudinaryAsset(uploadedFile.public_id)
    }

    if (previousAsset) {
      await createAsset(session.user.id, previousAsset as AssetItem).catch(() => null)
    }

    return NextResponse.json(
      { success: false, error: error?.message ?? "Unable to update the asset." },
      { status: 400 }
    )
  }
}
