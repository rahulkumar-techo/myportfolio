import { DefaultSession } from "next-auth"
import { JWT } from "next-auth/jwt"
import { UserRole } from "@/repositories/user-repository"

declare module "next-auth" {
  interface Session {
    user: DefaultSession["user"] & {
      id: string
      role: UserRole
      provider?: string
    }
  }

  interface User {
    id: string
    role: UserRole
    provider?: string
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role?: UserRole
    provider?: string
  }
}
