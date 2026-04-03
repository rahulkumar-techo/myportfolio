import { NextResponse } from "next/server"
import path from "path"
import { requireAdminApiSession } from "@/lib/auth"
import cloudinary from "@/lib/clodudinary"
import { createAsset, listPublicAssets } from "@/repositories/asset-repository"
import { removeTempAssetUploadsByPublicIds } from "@/repositories/temp-asset-upload-repository"
import type { AssetItem } from "@/lib/types"
import { notifySubscribers } from "@/utils/notify-subscribers"
import { getAppBaseUrl } from "@/utils/app-url"

export const runtime = "nodejs"
export const maxDuration = 60

const MAX_FILE_SIZE = 10 * 1024 * 1024
const MAX_PDF_SIZE = 2 * 1024 * 1024
const ALLOWED_CATEGORIES = new Set(["cv", "achievement", "image", "certificate", "other"])
const CLOUDINARY_FOLDER = "portfolio/assets"

function sanitizeFileName(fileName: string) {
  return fileName.replace(/[^a-zA-Z0-9._-]/g, "-")
}

function buildPublicId(originalName: string) {
  const extension = path.extname(originalName)
  const baseName = path.basename(originalName, extension)

  return `${Date.now()}-${baseName}`
}

function isPdfFileType(fileType: string) {
  return fileType === "application/pdf"
}

function getAssetSizeError(fileType: string, size: number) {
  if (!Number.isFinite(size) || size <= 0) {
    return "File size is invalid."
  }

  if (isPdfFileType(fileType) && size > MAX_PDF_SIZE) {
    return "PDF files must be 2MB or smaller."
  }

  if (size > MAX_FILE_SIZE) {
    return "File must be 10MB or smaller."
  }

  return null
}

function uploadToCloudinary(file: File, originalName: string) {
  return new Promise<{
    secure_url: string
    public_id: string
    format?: string
    resource_type: string
    bytes: number
  }>(async (resolve, reject) => {
    cloudinary.config()
    const buffer = Buffer.from(await file.arrayBuffer())
    const publicId = buildPublicId(originalName)
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: CLOUDINARY_FOLDER,
        public_id: publicId,
        resource_type: "auto",
        use_filename: false,
        unique_filename: false,
        overwrite: false
      },
      (error, result) => {
        if (error || !result) {
          reject(error ?? new Error("Upload failed."))
          return
        }

        resolve({
          secure_url: result.secure_url,
          public_id: result.public_id,
          format: result.format,
          resource_type: result.resource_type,
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

export async function GET() {
  const publicAssets = await listPublicAssets()

  return NextResponse.json({
    success: true,
    data: publicAssets
  })
}

export async function POST(request: Request) {
  const { session, response } = await requireAdminApiSession()

  if (response || !session) {
    return response
  }

  const contentType = request.headers.get("content-type") ?? ""

  if (contentType.includes("application/json")) {
    const body = await request.json().catch(() => ({} as any))
    const label = String(body?.label ?? "").trim()
    const category = String(body?.category ?? "other").trim()
    const upload = body?.upload ?? null

    if (!label) {
      return NextResponse.json({ success: false, error: "Label is required." }, { status: 400 })
    }

    if (!ALLOWED_CATEGORIES.has(category)) {
      return NextResponse.json({ success: false, error: "Invalid category." }, { status: 400 })
    }

    if (!upload || typeof upload?.publicId !== "string" || typeof upload?.url !== "string") {
      return NextResponse.json({ success: false, error: "Upload data is required." }, { status: 400 })
    }

    const size = Number(upload?.size ?? upload?.bytes ?? 0)
    const fileType = String(upload?.fileType ?? "application/octet-stream")
    const sizeError = getAssetSizeError(fileType, size)
    if (sizeError) {
      return NextResponse.json({ success: false, error: sizeError }, { status: 400 })
    }

    const originalName = sanitizeFileName(String(upload?.originalName ?? "asset"))
    const asset = {
      id: crypto.randomUUID(),
      label,
      category: category as AssetItem["category"],
      featured: false,
      fileId: upload.publicId,
      fileName: path.basename(upload.publicId),
      originalName,
      fileUrl: upload.url,
      fileType,
      size,
      uploadedAt: new Date().toISOString()
    } as AssetItem

    try {
      const createdAsset = await createAsset(session.user.id, asset)
      await removeTempAssetUploadsByPublicIds(session.user.id, [upload.publicId])

      const baseUrl = getAppBaseUrl()
      const assetUrl = baseUrl ? `${baseUrl}/assets` : "/assets"

      await notifySubscribers({
        type: "asset",
        title: createdAsset.label,
        description: `New ${createdAsset.category} asset is now available.`,
        url: assetUrl
      })

      return NextResponse.json(
        {
          success: true,
          data: createdAsset
        },
        { status: 201 }
      )
    } catch (error) {
      return NextResponse.json(
        { success: false, error: error instanceof Error ? error.message : "Unable to create the asset." },
        { status: 400 }
      )
    }
  }

  const formData = await request.formData()
  const label = String(formData.get("label") ?? "").trim()
  const category = String(formData.get("category") ?? "other").trim()
  const file = formData.get("file")

  if (!label) {
    return NextResponse.json({ success: false, error: "Label is required." }, { status: 400 })
  }

  if (!ALLOWED_CATEGORIES.has(category)) {
    return NextResponse.json({ success: false, error: "Invalid category." }, { status: 400 })
  }

  if (!(file instanceof File)) {
    return NextResponse.json({ success: false, error: "File is required." }, { status: 400 })
  }

  const sizeError = getAssetSizeError(file.type || "application/octet-stream", file.size)
  if (sizeError) {
    return NextResponse.json({ success: false, error: sizeError }, { status: 400 })
  }

  const originalName = sanitizeFileName(file.name || "asset")
  const uploadedFile = await uploadToCloudinary(file, originalName)

  const asset = {
    id: crypto.randomUUID(),
    label,
    category: category as AssetItem["category"],
    featured: false,
    fileId: uploadedFile.public_id,
    fileName: path.basename(uploadedFile.public_id),
    originalName,
    fileUrl: uploadedFile.secure_url,
    fileType: file.type || "application/octet-stream",
    size: uploadedFile.bytes || file.size,
    uploadedAt: new Date().toISOString()
  } as AssetItem

  try {
    const createdAsset = await createAsset(session.user.id, asset)

    const baseUrl = getAppBaseUrl()
    const assetUrl = baseUrl ? `${baseUrl}/assets` : "/assets"

    await notifySubscribers({
      type: "asset",
      title: createdAsset.label,
      description: `New ${createdAsset.category} asset is now available.`,
      url: assetUrl
    })

    return NextResponse.json(
      {
        success: true,
        data: createdAsset
      },
      { status: 201 }
    )
  } catch (error) {
    await destroyCloudinaryAsset(uploadedFile.public_id)

    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : "Unable to create the asset." },
      { status: 400 }
    )
  }
}
