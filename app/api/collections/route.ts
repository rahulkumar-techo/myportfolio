/**
 * GET collection sizes from MongoDB
 */

import { NextResponse } from "next/server"
import { requireAdminApiSession } from "@/lib/auth"
import { connectDB } from "@/lib/db"

const MB_DIVISOR = 1024 * 1024

function roundTo(value: number, decimals: number) {
  const factor = Math.pow(10, decimals)
  return Math.round(value * factor) / factor
}

export async function GET() {
  const { response } = await requireAdminApiSession()

  if (response) {
    return response
  }

  try {
    const conn = await connectDB()
    const db = conn.connection?.db

    if (!db) {
      throw new Error("MongoDB connection is not ready")
    }

    const collections = await db.listCollections().toArray()
    const collectionStats = await Promise.all(
      collections
        .filter((collection) => !collection.name.startsWith("system."))
        .map(async (collection) => {
          try {
            const sizeBytes = await getCollectionSizeBytes(db, collection.name)
            const sizeMB = sizeBytes / MB_DIVISOR
            return {
              name: collection.name,
              size: roundTo(sizeMB, 2)
            }
          } catch {
            console.error(`Failed to fetch stats for collection ${collection.name}`)
            return { name: collection.name, size: 0 }
          }
        })
    )

    const sorted = collectionStats.sort((a, b) => b.size - a.size)

    return NextResponse.json({
      success: true,
      data: sorted
    })
  } catch (error) {
    console.error("Failed to fetch collection usage", error)
    return NextResponse.json(
      { success: false, error: "Failed to fetch collection usage" },
      { status: 500 }
    )
  }
}

async function getCollectionSizeBytes(db: any, name: string) {
  // Preferred: collStats command (supported by MongoDB server)
  try {
    const stats = await db.command({ collStats: name })
    const size = typeof stats.size === "number" ? stats.size : 0
    const storageSize = typeof stats.storageSize === "number" ? stats.storageSize : 0
    const indexSize =
      typeof stats.totalIndexSize === "number"
        ? stats.totalIndexSize
        : typeof stats.indexSize === "number"
          ? stats.indexSize
          : 0
    const computed = Math.max(size + indexSize, storageSize, size)
    if (computed > 0) {
      return computed
    }
  } catch {
    // fall through to aggregation-based stats
  }

  // Fallback: $collStats aggregation (requires server support and permissions)
  try {
    const result = await db
      .collection(name)
      .aggregate([{ $collStats: { storageStats: {} } }])
      .toArray()
    const storageStats = result?.[0]?.storageStats
    const size = typeof storageStats?.size === "number" ? storageStats.size : 0
    const storageSize =
      typeof storageStats?.storageSize === "number" ? storageStats.storageSize : 0
    const indexSize =
      typeof storageStats?.totalIndexSize === "number"
        ? storageStats.totalIndexSize
        : typeof storageStats?.indexSize === "number"
          ? storageStats.indexSize
          : 0
    const computed = Math.max(size + indexSize, storageSize, size)
    if (computed > 0) {
      return computed
    }
  } catch {
    // ignore and fall through
  }

  return 0
}
