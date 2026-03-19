import type { AssetItem } from "@/lib/types"
import { connectDB } from "@/lib/db"
import { AssetModel } from "@/model/portfolio.model"
import { findFirstAdmin, findUserById } from "@/repositories/user-repository"

function toPlainAsset(item: any) {
  const plain = typeof item?.toObject === "function" ? item.toObject() : item

  if (!plain || typeof plain !== "object") {
    return plain
  }

  const rest = { ...(plain as Record<string, unknown>) }
  delete rest._id
  delete rest.__v
  delete rest.ownerId
  return rest as unknown as AssetItem
}

async function getAssetOwnerId(userId?: string) {
  if (userId) {
    const user = await findUserById(userId)
    if (user) {
      return user._id
    }
  }

  const admin = await findFirstAdmin()

  if (!admin) {
    throw new Error("User not found")
  }

  return admin._id
}

export async function listAssets(userId: string) {
  const ownerId = await getAssetOwnerId(userId)
  const items = await AssetModel.find({ ownerId }).sort({ uploadedAt: -1 }).lean()
  return items.map((item: unknown) => toPlainAsset(item))
}

export async function listPublicAssets() {
  const ownerId = await getAssetOwnerId()
  const items = await AssetModel.find({ ownerId }).sort({ uploadedAt: -1 }).lean()
  return items.map((item: unknown) => toPlainAsset(item))
}

export async function listPublicAssetsByOwnerId(ownerId: string) {
  await connectDB()
  const items = await AssetModel.find({ ownerId }).sort({ uploadedAt: -1 }).lean()
  return items.map((item: unknown) => toPlainAsset(item))
}

export async function createAsset(userId: string, asset: AssetItem) {
  const ownerId = await getAssetOwnerId(userId)
  const created = await AssetModel.create({
    ...asset,
    ownerId
  })

  return toPlainAsset(created)
}

export async function deleteAsset(userId: string, assetId: string) {
  const ownerId = await getAssetOwnerId(userId)
  const asset = await AssetModel.findOneAndDelete({ ownerId, id: assetId }).lean()

  if (!asset) {
    throw new Error("Asset not found")
  }

  return toPlainAsset(asset)
}
