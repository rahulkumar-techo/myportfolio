import { NextResponse } from "next/server"
import { getPublicProfileData } from "@/lib/public-data"

export const revalidate = 60

export async function GET() {
  const profile = await getPublicProfileData()

  return NextResponse.json({
    success: true,
    data: profile,
    meta: {
      lastUpdated: new Date().toISOString()
    }
  })
}
