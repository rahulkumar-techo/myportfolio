import { createHash } from "crypto"
import path from "path"
import { NextResponse } from "next/server"
import { v2 as cloudinary } from "cloudinary"
import cloudinaryClient from "@/lib/clodudinary"
import { getPublicAssetById } from "@/repositories/asset-repository"

export const runtime = "nodejs"
export const maxDuration = 60

function encodeContentDispositionFileName(fileName: string) {
  return encodeURIComponent(fileName).replace(/['()*]/g, (char) => `%${char.charCodeAt(0).toString(16).toUpperCase()}`)
}

function sanitizeContentDispositionFileName(fileName: string) {
  return fileName.replace(/["\\\r\n]/g, "_")
}

function buildSignedCloudinaryDownloadUrl(fileId: string, fileName: string) {
  cloudinaryClient.config()

  const extension = path.extname(fileName || fileId).replace(/^\./, "")

  return cloudinary.utils.private_download_url(fileId, extension || "", {
    resource_type: "raw",
    type: "upload",
    expires_at: Math.floor(Date.now() / 1000) + 60
  })
}

async function fetchAssetBytes(asset: Awaited<ReturnType<typeof getPublicAssetById>>) {
  const directResponse = await fetch(asset.fileUrl, { cache: "no-store" })

  if (directResponse.ok) {
    return directResponse
  }

  if (asset.fileType === "application/pdf" && asset.fileId) {
    const signedUrl = buildSignedCloudinaryDownloadUrl(asset.fileId, asset.originalName || asset.fileName)
    const signedResponse = await fetch(signedUrl, { cache: "no-store" })

    if (signedResponse.ok) {
      return signedResponse
    }

    throw new Error(`Unable to fetch the asset file from storage. Direct status: ${directResponse.status}. Signed status: ${signedResponse.status}.`)
  }

  throw new Error(`Unable to fetch the asset file from storage. Status: ${directResponse.status}.`)
}

export async function GET(request: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params

  try {
    const asset = await getPublicAssetById(id)
    const upstreamResponse = await fetchAssetBytes(asset)

    const arrayBuffer = await upstreamResponse.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)
    const checksum = createHash("sha256").update(buffer).digest("hex")
    const url = new URL(request.url)
    const shouldDownload = url.searchParams.get("download") === "1"
    const fileName = asset.originalName || asset.fileName || "file"
    const safeFileName = sanitizeContentDispositionFileName(fileName)
    const contentType =
      asset.fileType ||
      upstreamResponse.headers.get("content-type") ||
      "application/octet-stream"
    const contentDisposition = `${shouldDownload ? "attachment" : "inline"}; filename="${safeFileName}"; filename*=UTF-8''${encodeContentDispositionFileName(fileName)}`

    return new Response(buffer, {
      status: 200,
      headers: {
        "Content-Type": contentType,
        "Content-Disposition": contentDisposition,
        "Content-Length": String(buffer.length),
        "Cache-Control": "private, no-store, max-age=0",
        "X-Asset-SHA256": checksum
      }
    })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : "Unable to serve the asset file." },
      { status: 404 }
    )
  }
}
