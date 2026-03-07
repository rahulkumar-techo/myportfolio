'use client'

/**
 * Auth Provider
 * Wraps the application with NextAuth SessionProvider
 */

import { SessionProvider } from "next-auth/react"

export default function AuthProvider({
  children
}: {
  children: React.ReactNode
}) {

  return (
    <SessionProvider>
      {children}
    </SessionProvider>
  )

}