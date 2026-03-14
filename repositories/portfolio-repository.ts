import { connectDB } from "@/lib/db"
import {
  ContactMessageModel,
  ExperienceModel,
  ProjectModel,
  SkillModel,
  TestimonialModel
} from "@/model/portfolio.model"
import { UserModel } from "@/model/user.model"

export type PortfolioCollection =
  | "projects"
  | "skills"
  | "experiences"
  | "testimonials"
  | "contactMessages"

const collectionModels = {
  projects: ProjectModel,
  skills: SkillModel,
  experiences: ExperienceModel,
  testimonials: TestimonialModel,
  contactMessages: ContactMessageModel
} as const

const collectionSorts: Record<PortfolioCollection, Record<string, 1 | -1>> = {
  projects: { createdAt: -1 },
  skills: { name: 1 },
  experiences: { startDate: -1 },
  testimonials: { createdAt: -1 },
  contactMessages: { createdAt: -1 }
}

function toPlainItem<T>(item: T) {
  const plain = typeof (item as any)?.toObject === "function" ? (item as any).toObject() : item

  if (!plain || typeof plain !== "object") {
    return plain
  }

  const rest = { ...(plain as Record<string, unknown>) }
  delete rest._id
  delete rest.__v
  delete rest.ownerId
  return rest as T
}

async function findOwner(userId?: string) {
  await connectDB()

  if (userId) {
    const user = await UserModel.findById(userId)

    if (user) {
      return user
    }
  }

  const admin = await UserModel.findOne({ role: "admin" }).sort({ createdAt: 1 })
  return admin
}

async function getCollectionContext(collection: PortfolioCollection, userId?: string) {
  const owner = await findOwner(userId)

  if (!owner) {
    return null
  }

  return {
    ownerId: owner._id,
    Model: collectionModels[collection]
  }
}

export async function getPortfolioOwner(userId?: string) {
  const owner = await findOwner(userId)

  if (!owner) {
    throw new Error("Portfolio owner not found")
  }

  return owner
}

export async function getPortfolioOwnerId(userId?: string) {
  const owner = await getPortfolioOwner(userId)
  return owner._id
}

export async function listPortfolioItems(collection: PortfolioCollection, userId?: string) {
  const context = await getCollectionContext(collection, userId)

  if (!context) {
    return []
  }

  const { ownerId, Model } = context
  const items = await Model.find({ ownerId }).sort(collectionSorts[collection]).lean()
  return items.map((item: unknown) => toPlainItem(item))
}

export async function getPortfolioItemById(
  collection: PortfolioCollection,
  id: string,
  userId?: string
) {
  const context = await getCollectionContext(collection, userId)

  if (!context) {
    return null
  }

  const { ownerId, Model } = context
  const item = await Model.findOne({ ownerId, id }).lean()
  return item ? toPlainItem(item) : null
}

export async function createPortfolioItem(
  collection: PortfolioCollection,
  value: Record<string, unknown>,
  userId?: string
) {
  const context = await getCollectionContext(collection, userId)

  if (!context) {
    throw new Error("Portfolio owner not found")
  }

  const { ownerId, Model } = context
  const created = await Model.create({
    ...value,
    ownerId
  })

  return toPlainItem(created)
}

export async function updatePortfolioItemById(
  collection: PortfolioCollection,
  id: string,
  updates: Record<string, unknown>,
  userId?: string
) {
  const context = await getCollectionContext(collection, userId)

  if (!context) {
    return null
  }

  const { ownerId, Model } = context
  const updated = await Model.findOneAndUpdate(
    { ownerId, id },
    { $set: updates },
    { new: true, runValidators: true, lean: true }
  )

  return updated ? toPlainItem(updated) : null
}

export async function deletePortfolioItemById(
  collection: PortfolioCollection,
  id: string,
  userId?: string
) {
  const context = await getCollectionContext(collection, userId)

  if (!context) {
    return false
  }

  const { ownerId, Model } = context
  const deleted = await Model.findOneAndDelete({ ownerId, id }).lean()
  return Boolean(deleted)
}
