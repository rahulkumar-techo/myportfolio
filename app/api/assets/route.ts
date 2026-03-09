import { mkdir, writeFile } from "fs/promises"
import path from "path"
import { NextResponse } from "next/server"
import { requireAdminApiSession } from "@/lib/auth"
import { createAsset, listPublicAssets } from "@/repositories/asset-repository"
import type { AssetItem } from "@/lib/types"

const MAX_FILE_SIZE = 10 * 1024 * 1024
const ALLOWED_CATEGORIES = new Set(["cv", "achievement", "image", "certificate", "other"])

function sanitizeFileName(fileName: string) {
  return fileName.replace(/[^a-zA-Z0-9._-]/g, "-")
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

  const uploadDirectory = path.join(process.cwd(), "public", "uploads", "assets")
  await mkdir(uploadDirectory, { recursive: true })

  const originalName = sanitizeFileName(file.name || "asset")
  const extension = path.extname(originalName)
  const baseName = path.basename(originalName, extension)
  const fileName = `${Date.now()}-${baseName}${extension}`
  const filePath = path.join(uploadDirectory, fileName)
  const buffer = Buffer.from(await file.arrayBuffer())

  await writeFile(filePath, buffer)

  const asset: AssetItem = {
    id: crypto.randomUUID(),
    label,
    category: category as AssetItem["category"],
    fileName,
    originalName,
    fileUrl: `/uploads/assets/${fileName}`,
    fileType: file.type || "application/octet-stream",
    size: file.size,
    uploadedAt: new Date().toISOString()
  }

  const createdAsset = await createAsset(session.user.id, asset)

  return NextResponse.json({
    success: true,
    data: createdAsset
  }, { status: 201 })
}
