import { NextResponse } from "next/server"
import path from "path"
import { requireAdminApiSession } from "@/lib/auth"
import cloudinary from "@/lib/clodudinary"
import { IMAGE_UPLOAD_PRESETS, type ImageUploadKind } from "@/lib/image-presets"

const MAX_FILE_SIZE = 10 * 1024 * 1024
const CLOUDINARY_FOLDER = "portfolio/blogs"
const BLOG_UPLOAD_KINDS = new Set<ImageUploadKind>(["cover"])

function sanitizeFileName(fileName: string) {
  return fileName.replace(/[^a-zA-Z0-9._-]/g, "-")
}

function buildPublicId(originalName: string) {
  const extension = path.extname(originalName)
  const baseName = path.basename(originalName, extension)

  return `${Date.now()}-${baseName}`
}

function uploadToCloudinary(file: File, originalName: string, kind: ImageUploadKind) {
  return new Promise<{
    secure_url: string
    public_id: string
    format?: string
    resource_type: string
    bytes: number
    width?: number
    height?: number
  }>(async (resolve, reject) => {
    cloudinary.config()
    const buffer = Buffer.from(await file.arrayBuffer())
    const publicId = buildPublicId(originalName)
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: CLOUDINARY_FOLDER,
        public_id: publicId,
        resource_type: "image",
        format: "webp",
        use_filename: false,
        unique_filename: false,
        overwrite: false,
        context: {
          upload_kind: kind,
          target_width: String(IMAGE_UPLOAD_PRESETS[kind].width),
          target_height: String(IMAGE_UPLOAD_PRESETS[kind].height)
        }
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
          bytes: result.bytes,
          width: result.width,
          height: result.height
        })
      }
    )

    stream.end(buffer)
  })
}

export async function POST(request: Request) {
  const { session, response } = await requireAdminApiSession()

  if (response || !session) {
    return response
  }

  const formData = await request.formData()
  const file = formData.get("file")
  const kindValue = String(formData.get("kind") ?? "").trim() as ImageUploadKind

  if (!(file instanceof File)) {
    return NextResponse.json({ success: false, error: "File is required." }, { status: 400 })
  }

  if (!BLOG_UPLOAD_KINDS.has(kindValue)) {
    return NextResponse.json({ success: false, error: "Upload kind must be cover." }, { status: 400 })
  }

  if (!file.type.startsWith("image/")) {
    return NextResponse.json({ success: false, error: "Blog uploads must be images." }, { status: 400 })
  }

  if (file.size > MAX_FILE_SIZE) {
    return NextResponse.json({ success: false, error: "File must be 10MB or smaller." }, { status: 400 })
  }

  const preset = IMAGE_UPLOAD_PRESETS[kindValue]
  if (file.size > preset.maxBytes * 1.5) {
    return NextResponse.json(
      { success: false, error: "Optimized cover image is still too large. Please upload a smaller image." },
      { status: 400 }
    )
  }

  const originalName = sanitizeFileName(file.name || "blog-cover")
  const uploadedFile = await uploadToCloudinary(file, originalName, kindValue)

  return NextResponse.json(
    {
      success: true,
      data: {
        url: uploadedFile.secure_url,
        publicId: uploadedFile.public_id,
        format: uploadedFile.format,
        width: uploadedFile.width,
        height: uploadedFile.height,
        bytes: uploadedFile.bytes
      }
    },
    { status: 201 }
  )
}

export async function DELETE(request: Request) {
  const { session, response } = await requireAdminApiSession()

  if (response || !session) {
    return response
  }

  const body = await request.json()
  const publicId = typeof body?.publicId === "string" ? body.publicId.trim() : ""

  if (!publicId) {
    return NextResponse.json({ success: false, error: "publicId is required." }, { status: 400 })
  }

  try {
    cloudinary.config()
    await cloudinary.uploader.destroy(publicId, { resource_type: "image", invalidate: true })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : "Unable to delete image." },
      { status: 400 }
    )
  }

  return NextResponse.json({ success: true })
}
