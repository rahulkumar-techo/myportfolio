import { NextResponse } from "next/server"
import path from "path"
import { v2 as cloudinary } from "cloudinary"
import { requireAdminApiSession } from "@/lib/auth"
import cloudinaryClient from "@/lib/clodudinary"

export const runtime = "nodejs"
export const maxDuration = 30

const CLOUDINARY_FOLDER = "portfolio/assets"

function sanitizeFileName(fileName: string) {
  return fileName.replace(/[^a-zA-Z0-9._-]/g, "-")
}

function buildPublicId(originalName: string) {
  const extension = path.extname(originalName)
  const baseName = path.basename(originalName, extension)
  return `${Date.now()}-${baseName}`
}

export async function POST(request: Request) {
  const { session, response } = await requireAdminApiSession()

  if (response || !session) {
    return response
  }

  const body = await request.json().catch(() => ({} as any))
  const fileName = typeof body?.fileName === "string" ? body.fileName.trim() : ""
  const fileType = typeof body?.fileType === "string" ? body.fileType.trim() : ""

  if (!fileName) {
    return NextResponse.json({ success: false, error: "fileName is required." }, { status: 400 })
  }

  const originalName = sanitizeFileName(fileName || "asset")
  const publicId = buildPublicId(originalName)
  const timestamp = Math.floor(Date.now() / 1000)
  const resourceType = fileType.startsWith("image/") ? "image" : "raw"

  cloudinaryClient.config()

  if (!process.env.CLOUDINARY_API_SECRET || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_CLOUD_NAME) {
    return NextResponse.json({ success: false, error: "Cloudinary is not configured." }, { status: 500 })
  }

  const signature = cloudinary.utils.api_sign_request(
    {
      folder: CLOUDINARY_FOLDER,
      public_id: publicId,
      timestamp
    },
    process.env.CLOUDINARY_API_SECRET ?? ""
  )

  return NextResponse.json({
    success: true,
    data: {
      cloudName: process.env.CLOUDINARY_CLOUD_NAME,
      apiKey: process.env.CLOUDINARY_API_KEY,
      timestamp,
      signature,
      folder: CLOUDINARY_FOLDER,
      publicId,
      resourceType
    }
  })
}
