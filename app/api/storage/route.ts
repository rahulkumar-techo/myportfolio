/**
 * GET storage usage from MongoDB
 */

import { NextResponse } from "next/server"
import { requireAdminApiSession } from "@/lib/auth"
import { connectDB } from "@/lib/db"
import { getStorageUsage } from "@/lib/services/storage.service"

export async function GET() {
  const { response } = await requireAdminApiSession()

  if (response) {
    return response
  }

  try {
    const conn = await connectDB()
    const storage = await getStorageUsage(conn)

    return NextResponse.json({
      success: true,
      data: storage
    })
  } catch (error) {
    console.error("Failed to fetch storage usage", error)
    return NextResponse.json(
      { success: false, error: "Failed to fetch storage usage" },
      { status: 500 }
    )
  }
}
