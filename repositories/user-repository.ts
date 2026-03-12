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

const ACTIVE_LOGIN_WINDOW_MS = 1000 * 60 * 60 * 24

function startOfDay(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate())
}

function formatDayLabel(date: Date) {
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" })
}

export async function findUserByEmail(email: string) {
  await connectDB()
  return UserModel.findOne({ email: email.toLowerCase() })
}

export async function findUserById(id: string) {
  await connectDB()
  return UserModel.findById(id)
}
export async function findUsers() {
  await connectDB()
  return UserModel.find();
}

export async function findNonAdminUsers() {
  await connectDB()
  return UserModel.find({ role: { $ne: "admin" } });
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
    blocked: false,
    settings: {
      ...defaultSettings,
      contactEmail: input.email.toLowerCase()
    }
  })
}

export async function recordUserLogin(userId: string, provider?: string | null) {
  await connectDB()

  await UserModel.findByIdAndUpdate(userId, {
    $set: {
      lastLoginAt: new Date(),
      lastLoginProvider: provider ?? null
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

export async function getUserAnalytics() {
  await connectDB()

  const users = await UserModel.find(
    {},
    "name email role blocked image createdAt lastLoginAt lastLoginProvider"
  )
    .sort({ lastLoginAt: -1, createdAt: -1 })
    .lean()

  const now = Date.now()
  const activeUsers = users
    .filter((user: any) => user.lastLoginAt && now - new Date(user.lastLoginAt).getTime() <= ACTIVE_LOGIN_WINDOW_MS)
    .map((user: any) => ({
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      role: user.role,
      blocked: Boolean(user.blocked),
      image: user.image ?? null,
      lastLoginAt: user.lastLoginAt,
      lastLoginProvider: user.lastLoginProvider ?? null
    }))

  const usersList = users.map((user: any) => ({
    id: user._id.toString(),
    name: user.name,
    email: user.email,
    role: user.role,
    blocked: Boolean(user.blocked),
    image: user.image ?? null,
    lastLoginAt: user.lastLoginAt,
    lastLoginProvider: user.lastLoginProvider ?? null
  }))

  const today = startOfDay(new Date())
  const growth = Array.from({ length: 7 }, (_, index) => {
    const day = new Date(today)
    day.setDate(today.getDate() - (6 - index))

    const dayEnd = new Date(day)
    dayEnd.setHours(23, 59, 59, 999)

    return {
      label: formatDayLabel(day),
      totalUsers: users.filter((user: any) => new Date(user.createdAt).getTime() <= dayEnd.getTime()).length
    }
  })

  return {
    totals: {
      users: users.length,
      admins: users.filter((user: any) => user.role === "admin").length,
      members: users.filter((user: any) => user.role !== "admin").length,
      activeNow: activeUsers.length,
      blocked: users.filter((user: any) => user.blocked).length
    },
    growth,
    activeUsers,
    users: usersList
  }
}

export async function updateUserBlockedStatus(userId: string, blocked: boolean, actingAdminId: string) {
  await connectDB()

  if (userId === actingAdminId) {
    throw new Error("You cannot block your own account.")
  }

  const user = await UserModel.findById(userId)

  if (!user) {
    throw new Error("User not found")
  }

  user.blocked = blocked
  await user.save()

  return user
}

export async function deleteUserAccount(userId: string, actingAdminId: string) {
  await connectDB()

  if (userId === actingAdminId) {
    throw new Error("You cannot delete your own account.")
  }

  const user = await UserModel.findById(userId)

  if (!user) {
    throw new Error("User not found")
  }

  await UserModel.findByIdAndDelete(userId)
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
