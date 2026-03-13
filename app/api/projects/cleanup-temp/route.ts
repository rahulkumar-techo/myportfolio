import { NextResponse } from "next/server"
import { requireAdminApiSession } from "@/lib/auth"
import cloudinary from "@/lib/clodudinary"
import { cleanupTempProjectUploads, removeTempProjectUploadsByPublicIds } from "@/repositories/temp-upload-repository"
import type { TempProjectUpload } from "@/lib/types"

const DEFAULT_TTL_MS = 2 * 60 * 60 * 1000

export async function POST(request: Request) {
  const { session, response } = await requireAdminApiSession()

  if (response || !session) {
    return response
  }

  const body = await request.json().catch(() => ({}))
  const publicIds = Array.isArray(body?.publicIds)
    ? body.publicIds.filter((id: unknown) => typeof id === "string" && id.trim().length > 0)
    : []
  const ttlMs = typeof body?.ttlMs === "number" ? body.ttlMs : DEFAULT_TTL_MS

  cloudinary.config()

  if (publicIds.length > 0) {
    await Promise.allSettled(
      publicIds.map((publicId: string) =>
        cloudinary.uploader.destroy(publicId, { resource_type: "image", invalidate: true })
      )
    )
    await removeTempProjectUploadsByPublicIds(session.user.id, publicIds)

    return NextResponse.json({ success: true, removed: publicIds.length })
  }

  const expired = await cleanupTempProjectUploads(session.user.id, ttlMs)

  if (expired.length > 0) {
    await Promise.allSettled(
      (expired as TempProjectUpload[]).map((upload) =>
        cloudinary.uploader.destroy(upload.publicId, { resource_type: "image", invalidate: true })
      )
    )
  }

  return NextResponse.json({ success: true, removed: expired.length })
}
