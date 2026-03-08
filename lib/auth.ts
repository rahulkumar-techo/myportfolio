import { NextResponse } from "next/server"
import { getServerSession, type NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import GoogleProvider from "next-auth/providers/google"
import bcrypt from "bcryptjs"
import { findOrCreateOAuthUser, findUserByEmail, type UserRole } from "@/repositories/user-repository"

type AuthUser = {
  id: string
  name: string
  email: string
  role: UserRole
  provider?: string
  image?: string | null
}

const providers: NextAuthOptions["providers"] = [
  CredentialsProvider({
    name: "Credentials",
    credentials: {
      email: { label: "Email", type: "email" },
      password: { label: "Password", type: "password" }
    },
    async authorize(credentials) {
      try {
        const email = credentials?.email?.trim().toLowerCase()
        const password = credentials?.password

        if (!email || !password) {
          return null
        }

        const user = await findUserByEmail(email)

        if (!user?.password || user.role !== "admin") {
          console.error("Admin authorize rejected user", {
            email,
            hasUser: Boolean(user),
            role: user?.role ?? null,
            hasPassword: Boolean(user?.password)
          })
          return null
        }

        const isValid = await bcrypt.compare(password, user.password)

        if (!isValid) {
          console.error("Admin authorize password mismatch", { email })
          return null
        }

        return {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
          role: user.role,
          image: user.image ?? null
        } satisfies AuthUser
      } catch (error) {
        console.error("Admin authorize failed", error)
        return null
      }
    }
  })
]

if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  providers.unshift(
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET
    })
  )
}

export const authOptions: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === "development",
  useSecureCookies: process.env.NODE_ENV === "production",
  providers,
  session: {
    strategy: "jwt"
  },
  pages: {
    signIn: "/admin/login",
    error: "/admin/login"
  },
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === "google" && user.email) {
        const result = await findOrCreateOAuthUser({
          email: user.email,
          name: user.name ?? "Google User",
          image: user.image
        })

        ;(user as AuthUser).id = result.user._id.toString()
        ;(user as AuthUser).role = result.user.role
        ;(user as AuthUser).provider = account.provider
        ;(user as AuthUser).image = result.user.image ?? user.image ?? null
      }

      return true
    },
    async jwt({ token, user }) {
      if (user) {
        token.sub = (user as AuthUser).id
        token.role = (user as AuthUser).role
        token.name = user.name
        token.email = user.email
        token.picture = user.image
        token.provider = (user as AuthUser).provider ?? token.provider
      }

      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.sub ?? ""
        session.user.role = (token.role as UserRole | undefined) ?? "user"
        session.user.name = token.name
        session.user.email = token.email
        session.user.image = token.picture
        session.user.provider = typeof token.provider === "string" ? token.provider : undefined
      }

      return session
    }
  }
}

export function auth() {
  return getServerSession(authOptions)
}

export async function requireAdminApiSession() {
  const session = await auth()

  if (!session?.user?.id) {
    return {
      session: null,
      response: NextResponse.json(
        { success: false, error: "Authentication required" },
        { status: 401 }
      )
    }
  }

  if (session.user.role !== "admin") {
    return {
      session: null,
      response: NextResponse.json(
        { success: false, error: "Admin access required" },
        { status: 403 }
      )
    }
  }

  return { session, response: null }
}

export async function requireVerifiedGoogleUserSession() {
  const session = await auth()

  if (!session?.user?.id || !session.user.email) {
    return {
      session: null,
      response: NextResponse.json(
        { success: false, error: "Please sign in with Google to continue." },
        { status: 401 }
      )
    }
  }

  if (session.user.provider !== "google") {
    return {
      session: null,
      response: NextResponse.json(
        { success: false, error: "Google sign-in is required for this action." },
        { status: 403 }
      )
    }
  }

  return { session, response: null }
}
