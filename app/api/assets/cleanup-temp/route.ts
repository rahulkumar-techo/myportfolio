import { NextResponse } from "next/server"
import { requireAdminApiSession } from "@/lib/auth"
import cloudinary from "@/lib/clodudinary"
import { cleanupTempAssetUploads } from "@/repositories/temp-asset-upload-repository"

export const runtime = "nodejs"
export const maxDuration = 60

const TWO_HOURS = 2 * 60 * 60 * 1000

export async function POST() {
  const { session, response } = await requireAdminApiSession()

  if (response || !session) {
    return response
  }

  const expired = await cleanupTempAssetUploads(session.user.id, TWO_HOURS)

  if (expired.length === 0) {
    return NextResponse.json({ success: true, deleted: 0 })
  }

  cloudinary.config()
  await Promise.allSettled(
    expired.map((upload) =>
      Promise.allSettled([
        cloudinary.uploader.destroy(upload.publicId, { resource_type: "image", invalidate: true }),
        cloudinary.uploader.destroy(upload.publicId, { resource_type: "raw", invalidate: true }),
        cloudinary.uploader.destroy(upload.publicId, { resource_type: "video", invalidate: true })
      ])
    )
  )

  return NextResponse.json({ success: true, deleted: expired.length })
}
