import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { getToken } from "next-auth/jwt"

const authPages = new Set(["/admin/login", "/admin/register"])

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  if (!pathname.startsWith("/admin")) {
    return NextResponse.next()
  }

  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
    secureCookie: process.env.NODE_ENV === "production"
  })

  const isAuthPage = authPages.has(pathname)

  if (isAuthPage && token?.role === "admin") {
    return NextResponse.redirect(new URL("/admin", request.url))
  }

  if (isAuthPage) {
    return NextResponse.next()
  }

  if (!token) {
    const loginUrl = new URL("/admin/login", request.url)
    loginUrl.searchParams.set("callbackUrl", pathname)
    return NextResponse.redirect(loginUrl)
  }

  if (token.role !== "admin") {
    return NextResponse.redirect(new URL("/admin/login?error=unauthorized", request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/admin/:path*"]
}
