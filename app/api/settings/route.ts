import { NextResponse } from "next/server"
import { getPublicSiteSettings } from "@/repositories/user-repository"

export async function GET() {
  const settings = await getPublicSiteSettings()

  return NextResponse.json({
    success: true,
    data: settings
  })
}
