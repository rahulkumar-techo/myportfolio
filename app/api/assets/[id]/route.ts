import { unlink } from "fs/promises"
import path from "path"
import { NextResponse } from "next/server"
import { requireAdminApiSession } from "@/lib/auth"
import { deleteAsset } from "@/repositories/asset-repository"

export async function DELETE(_request: Request, context: { params: Promise<{ id: string }> }) {
  const { session, response } = await requireAdminApiSession()

  if (response || !session) {
    return response
  }

  const { id } = await context.params

  try {
    const asset = await deleteAsset(session.user.id, id)
    const filePath = path.join(process.cwd(), "public", asset.fileUrl.replace(/^\//, ""))

    await unlink(filePath).catch(() => null)

    return NextResponse.json({ success: true })
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error?.message ?? "Unable to delete the asset." },
      { status: 400 }
    )
  }
}
