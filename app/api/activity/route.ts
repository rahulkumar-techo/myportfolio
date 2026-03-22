/**
 * GET storage growth activity (last 7 days)
 * NOTE: Replace mock data with real analytics when available.
 */

import { NextResponse } from "next/server"
import { requireAdminApiSession } from "@/lib/auth"
import { connectDB } from "@/lib/db"
import { getStorageUsage } from "@/lib/services/storage.service"

function formatDayLabel(date: Date) {
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" })
}

function roundTo(value: number, decimals: number) {
  const factor = Math.pow(10, decimals)
  return Math.round(value * factor) / factor
}

export async function GET() {
  const { response } = await requireAdminApiSession()

  if (response) {
    return response
  }

  const today = new Date()
  const conn = await connectDB()
  const { used } = await getStorageUsage(conn)

  const weights = [0.08, 0.12, 0.1, 0.15, 0.18, 0.17, 0.2]
  const data = Array.from({ length: 7 }, (_, index) => {
    const day = new Date(today)
    day.setDate(today.getDate() - (6 - index))

    const portion = weights.slice(0, index + 1).reduce((sum, value) => sum + value, 0)
    const usage = used > 0 ? used * portion : 0

    return {
      label: formatDayLabel(day),
      usageMB: roundTo(usage, 2)
    }
  })

  return NextResponse.json({
    success: true,
    data
  })
}
