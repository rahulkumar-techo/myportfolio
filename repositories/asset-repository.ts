import { findFirstAdmin, findUserById } from "@/repositories/user-repository"
import type { AssetItem } from "@/lib/types"

export async function listAssets(userId: string) {
  const user = await findUserById(userId)

  if (!user) {
    throw new Error("User not found")
  }

  return [...(user.assets ?? [])].sort(
    (left: any, right: any) => new Date(right.uploadedAt).getTime() - new Date(left.uploadedAt).getTime()
  )
}

export async function listPublicAssets() {
  const admin = await findFirstAdmin()

  if (!admin) {
    return []
  }

  return [...(admin.assets ?? [])].sort(
    (left: any, right: any) => new Date(right.uploadedAt).getTime() - new Date(left.uploadedAt).getTime()
  )
}

export async function createAsset(userId: string, asset: AssetItem) {
  const user = await findUserById(userId)

  if (!user) {
    throw new Error("User not found")
  }

  user.assets = [asset, ...(user.assets ?? [])]
  await user.save()

  return asset
}

export async function deleteAsset(userId: string, assetId: string) {
  const user = await findUserById(userId)

  if (!user) {
    throw new Error("User not found")
  }

  const asset = (user.assets ?? []).find((item: any) => item.id === assetId)

  if (!asset) {
    throw new Error("Asset not found")
  }

  user.assets = (user.assets ?? []).filter((item: any) => item.id !== assetId)
  await user.save()

  return asset
}
