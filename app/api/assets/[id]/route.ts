import { NextResponse } from "next/server"
import path from "path"
import { requireAdminApiSession } from "@/lib/auth"
import cloudinary from "@/lib/clodudinary"
import { createAsset, deleteAsset } from "@/repositories/asset-repository"
import type { AssetItem } from "@/lib/types"

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

function uploadToCloudinary(file: File, originalName: string) {
  return new Promise<{
    secure_url: string
    public_id: string
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

  if (file !== null && !(file instanceof File)) {
    return NextResponse.json({ success: false, error: "Invalid file." }, { status: 400 })
  }

  if (file instanceof File && file.size > MAX_FILE_SIZE) {
    return NextResponse.json({ success: false, error: "File must be 10MB or smaller." }, { status: 400 })
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
      uploadedFile = await uploadToCloudinary(file, originalName)
    }

    const nextAsset = {
      ...previousAsset,
      id,
      label,
      category: category as AssetItem["category"],
      fileId: uploadedFile?.public_id ?? previousAsset.fileId,
      fileName: uploadedFile ? path.basename(uploadedFile.public_id) : previousAsset.fileName,
      originalName:
        file instanceof File && file.size > 0
          ? sanitizeFileName(file.name || previousAsset.originalName || "asset")
          : previousAsset.originalName,
      fileUrl: uploadedFile?.secure_url ?? previousAsset.fileUrl,
      fileType: file instanceof File && file.size > 0 ? file.type || previousAsset.fileType : previousAsset.fileType,
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
