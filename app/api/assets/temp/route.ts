import { NextResponse } from "next/server"
import { requireAdminApiSession } from "@/lib/auth"
import cloudinary from "@/lib/clodudinary"
import { addTempAssetUpload, removeTempAssetUploadsByPublicIds } from "@/repositories/temp-asset-upload-repository"

export const runtime = "nodejs"
export const maxDuration = 60

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

export async function POST(request: Request) {
  const { session, response } = await requireAdminApiSession()

  if (response || !session) {
    return response
  }

  const body = await request.json().catch(() => ({} as any))
  const action = typeof body?.action === "string" ? body.action : "register"
  const publicId = typeof body?.publicId === "string" ? body.publicId.trim() : ""
  const url = typeof body?.url === "string" ? body.url.trim() : ""

  if (!publicId) {
    return NextResponse.json({ success: false, error: "publicId is required." }, { status: 400 })
  }

  if (action === "register") {
    if (!url) {
      return NextResponse.json({ success: false, error: "url is required." }, { status: 400 })
    }

    await addTempAssetUpload(session.user.id, {
      id: crypto.randomUUID(),
      publicId,
      url,
      createdAt: new Date().toISOString()
    })

    return NextResponse.json({ success: true })
  }

  if (action === "cleanup") {
    await destroyCloudinaryAsset(publicId)
    await removeTempAssetUploadsByPublicIds(session.user.id, [publicId])
    return NextResponse.json({ success: true })
  }

  return NextResponse.json({ success: false, error: "Invalid action." }, { status: 400 })
}
