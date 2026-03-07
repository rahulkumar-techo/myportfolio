import { connectDB } from "@/lib/db"
import { UserModel } from "@/model/user.model"

export type PortfolioCollection =
  | "projects"
  | "skills"
  | "experiences"
  | "testimonials"
  | "contactMessages"

async function getOwner(userId?: string) {
  await connectDB()

  if (userId) {
    const user = await UserModel.findById(userId)

    if (user) {
      return user
    }
  }

  return UserModel.findOne({ role: "admin" }).sort({ createdAt: 1 })
}

function toPlainItem(item: any) {
  return typeof item?.toObject === "function" ? item.toObject() : item
}

export async function getPortfolioOwner(userId?: string) {
  const owner = await getOwner(userId)

  if (!owner) {
    throw new Error("Portfolio owner not found")
  }

  return owner
}

export async function listPortfolioItems(collection: PortfolioCollection, userId?: string) {
  const owner = await getPortfolioOwner(userId)
  return owner[collection] ?? []
}

export async function getPortfolioItemById(
  collection: PortfolioCollection,
  id: string,
  userId?: string
) {
  const owner = await getPortfolioOwner(userId)
  return owner[collection].find((item: any) => item.id === id) ?? null
}

export async function createPortfolioItem(
  collection: PortfolioCollection,
  value: Record<string, unknown>,
  userId?: string
) {
  const owner = await getPortfolioOwner(userId)
  owner[collection].push(value)
  await owner.save()
  return value
}

export async function updatePortfolioItemById(
  collection: PortfolioCollection,
  id: string,
  updates: Record<string, unknown>,
  userId?: string
) {
  const owner = await getPortfolioOwner(userId)
  const index = owner[collection].findIndex((item: any) => item.id === id)

  if (index === -1) {
    return null
  }

  owner[collection][index] = {
    ...toPlainItem(owner[collection][index]),
    ...updates
  }

  await owner.save()

  return owner[collection][index]
}

export async function deletePortfolioItemById(
  collection: PortfolioCollection,
  id: string,
  userId?: string
) {
  const owner = await getPortfolioOwner(userId)
  const index = owner[collection].findIndex((item: any) => item.id === id)

  if (index === -1) {
    return false
  }

  owner[collection].splice(index, 1)
  await owner.save()

  return true
}
