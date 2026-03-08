import { connectDB } from "@/lib/db"
import { UserModel } from "@/model/user.model"
import type { SiteSettings } from "@/lib/types"

export type UserRole = "admin" | "user"

const defaultSettings: SiteSettings = {
  siteTitle: "Developer Portfolio",
  siteTagline: "Futuristic Developer Portfolio",
  adminPanelTitle: "Admin Panel",
  bio: "",
  location: "",
  contactEmail: "",
  resumeUrl: "",
  githubUrl: "",
  linkedinUrl: "",
  twitterUrl: "",
  websiteUrl: ""
}

type CreateUserInput = {
  name: string
  email: string
  password?: string
  image?: string | null
  role?: UserRole
}

type OAuthUserInput = {
  name: string
  email: string
  image?: string | null
}

type OAuthResult =
  | { ok: true; user: any }

export async function findUserByEmail(email: string) {
  await connectDB()
  return UserModel.findOne({ email: email.toLowerCase() })
}

export async function findUserById(id: string) {
  await connectDB()
  return UserModel.findById(id)
}

export async function findFirstAdmin() {
  await connectDB()
  return UserModel.findOne({ role: "admin" }).sort({ createdAt: 1 })
}

export async function hasAdminUser() {
  await connectDB()
  const count = await UserModel.countDocuments({ role: "admin" })
  return count > 0
}

export async function createUser(input: CreateUserInput) {
  await connectDB()

  return UserModel.create({
    name: input.name,
    email: input.email.toLowerCase(),
    password: input.password,
    image: input.image ?? null,
    role: input.role ?? "user",
    settings: {
      ...defaultSettings,
      contactEmail: input.email.toLowerCase()
    }
  })
}

export async function findOrCreateOAuthUser(input: OAuthUserInput): Promise<OAuthResult> {
  await connectDB()

  const normalizedEmail = input.email.toLowerCase()
  const existingUser = await UserModel.findOne({ email: normalizedEmail })

  if (existingUser) {
    if (input.image && existingUser.image !== input.image) {
      existingUser.image = input.image
      await existingUser.save()
    }

    return { ok: true, user: existingUser }
  }

  const user = await createUser({
    name: input.name,
    email: normalizedEmail,
    image: input.image ?? null,
    role: (await hasAdminUser()) ? "user" : "admin"
  })

  return { ok: true, user }
}

export function getMergedSettings(user: any): SiteSettings {
  const rawSettings = user?.settings?.toObject?.() ?? user?.settings ?? {}
  const { theme: _theme, ...safeSettings } = rawSettings

  return {
    ...defaultSettings,
    contactEmail: user?.email ?? defaultSettings.contactEmail,
    ...safeSettings
  }
}

export async function getPublicSiteSettings() {
  const admin = await findFirstAdmin()

  if (!admin) {
    return defaultSettings
  }

  return getMergedSettings(admin)
}

export async function getUserSettings(userId: string) {
  const user = await findUserById(userId)

  if (!user) {
    throw new Error("User not found")
  }

  return getMergedSettings(user)
}

export async function updateUserSettings(userId: string, updates: Partial<SiteSettings>) {
  const user = await findUserById(userId)

  if (!user) {
    throw new Error("User not found")
  }

  const { theme: _theme, ...safeUpdates } = updates as Partial<SiteSettings> & {
    theme?: "light" | "dark" | "system"
  }

  user.settings = {
    ...getMergedSettings(user),
    ...safeUpdates
  }

  await user.save()

  return getMergedSettings(user)
}
