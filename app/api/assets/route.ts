import { NextResponse } from "next/server"
import path from "path"
import { requireAdminApiSession } from "@/lib/auth"
import cloudinary from "@/lib/clodudinary"
import { createAsset, listPublicAssets } from "@/repositories/asset-repository"
import type { AssetItem } from "@/lib/types"

const MAX_FILE_SIZE = 10 * 1024 * 1024
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

function uploadToCloudinary(file: File, originalName: string) {
  return new Promise<{
    secure_url: string
    public_id: string
    format?: string
    resource_type: string
    bytes: number
  }>(async (resolve, reject) => {
    const buffer = Buffer.from(await file.arrayBuffer())
    const publicId = buildPublicId(originalName)
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: CLOUDINARY_FOLDER,
        public_id: publicId,
        resource_type: "auto",
        use_filename: false,
        unique_filename: false
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

  if (file.size > MAX_FILE_SIZE) {
    return NextResponse.json({ success: false, error: "File must be 10MB or smaller." }, { status: 400 })
  }

  const originalName = sanitizeFileName(file.name || "asset")
  const uploadedFile = await uploadToCloudinary(file, originalName)

  const asset = {
    id: crypto.randomUUID(),
    label,
    category: category as AssetItem["category"],
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
