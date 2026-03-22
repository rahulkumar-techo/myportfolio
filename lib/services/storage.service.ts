import type mongoose from "mongoose"

const MB_DIVISOR = 1024 * 1024
const DEFAULT_TOTAL_MB = 512

export type StorageUsage = {
  used: number
  total: number
  remaining: number
}

function roundTo(value: number, decimals: number) {
  const factor = Math.pow(10, decimals)
  return Math.round(value * factor) / factor
}

export async function getStorageUsage(conn: typeof mongoose): Promise<StorageUsage> {
  if (!conn.connection?.db) {
    throw new Error("MongoDB connection is not ready")
  }

  const stats = await conn.connection.db.stats()
  const dataSize = typeof stats.dataSize === "number" ? stats.dataSize : 0
  const storageSize = typeof stats.storageSize === "number" ? stats.storageSize : 0
  const indexSize =
    typeof stats.indexSize === "number"
      ? stats.indexSize
      : typeof stats.totalIndexSize === "number"
        ? stats.totalIndexSize
        : 0
  const usedBytes = Math.max(dataSize + indexSize, storageSize, dataSize)
  const usedMB = usedBytes / MB_DIVISOR
  const totalMB = DEFAULT_TOTAL_MB
  const remainingMB = Math.max(0, totalMB - usedMB)

  return {
    used: roundTo(usedMB, 2),
    total: totalMB,
    remaining: roundTo(remainingMB, 2)
  }
}
