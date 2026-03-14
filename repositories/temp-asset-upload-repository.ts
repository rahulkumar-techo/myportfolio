import type { TempAssetUpload } from "@/lib/types"
import { TempAssetUploadModel } from "@/model/portfolio.model"
import { getPortfolioOwner } from "@/repositories/portfolio-repository"

function toPlainUpload(item: any) {
  const plain = typeof item?.toObject === "function" ? item.toObject() : item

  if (!plain || typeof plain !== "object") {
    return plain
  }

  const rest = { ...(plain as Record<string, unknown>) }
  delete rest._id
  delete rest.__v
  delete rest.ownerId
  return rest as unknown as TempAssetUpload
}

async function getOwnerId(userId?: string) {
  const owner = await getPortfolioOwner(userId)
  return owner._id
}

export async function listTempAssetUploads(userId?: string): Promise<TempAssetUpload[]> {
  const ownerId = await getOwnerId(userId)
  const uploads = await TempAssetUploadModel.find({ ownerId }).sort({ createdAt: -1 }).lean()
  return uploads.map((upload: unknown) => toPlainUpload(upload))
}

export async function addTempAssetUpload(userId: string | undefined, upload: TempAssetUpload) {
  const ownerId = await getOwnerId(userId)
  const created = await TempAssetUploadModel.create({
    ...upload,
    ownerId
  })

  return toPlainUpload(created)
}

export async function removeTempAssetUploadsByPublicIds(userId: string | undefined, publicIds: string[]) {
  if (publicIds.length === 0) {
    return
  }

  const ownerId = await getOwnerId(userId)
  await TempAssetUploadModel.deleteMany({
    ownerId,
    publicId: { $in: publicIds }
  })
}

export async function cleanupTempAssetUploads(userId: string | undefined, olderThanMs: number) {
  const ownerId = await getOwnerId(userId)
  const threshold = new Date(Date.now() - olderThanMs)
  const expired = await TempAssetUploadModel.find({
    ownerId,
    createdAt: { $lt: threshold }
  }).lean()

  if (expired.length === 0) {
    return []
  }

  await TempAssetUploadModel.deleteMany({
    ownerId,
    id: { $in: expired.map((upload: any) => upload.id) }
  })

  return expired.map((upload: unknown) => toPlainUpload(upload))
}
