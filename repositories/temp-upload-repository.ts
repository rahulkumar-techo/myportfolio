import type { TempProjectUpload } from "@/lib/types"
import { TempProjectUploadModel } from "@/model/portfolio.model"
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
  return rest as unknown as TempProjectUpload
}

async function getOwnerId(userId?: string) {
  const owner = await getPortfolioOwner(userId)
  return owner._id
}

export async function listTempProjectUploads(userId?: string): Promise<TempProjectUpload[]> {
  const ownerId = await getOwnerId(userId)
  const uploads = await TempProjectUploadModel.find({ ownerId }).sort({ createdAt: -1 }).lean()
  return uploads.map((upload: unknown) => toPlainUpload(upload))
}

export async function addTempProjectUpload(
  userId: string | undefined,
  upload: TempProjectUpload
) {
  const ownerId = await getOwnerId(userId)
  const created = await TempProjectUploadModel.create({
    ...upload,
    ownerId
  })

  return toPlainUpload(created)
}

export async function removeTempProjectUploadsByPublicIds(
  userId: string | undefined,
  publicIds: string[]
) {
  if (publicIds.length === 0) {
    return
  }

  const ownerId = await getOwnerId(userId)
  await TempProjectUploadModel.deleteMany({
    ownerId,
    publicId: { $in: publicIds }
  })
}

export async function cleanupTempProjectUploads(
  userId: string | undefined,
  olderThanMs: number
) {
  const ownerId = await getOwnerId(userId)
  const threshold = new Date(Date.now() - olderThanMs)
  const expired = await TempProjectUploadModel.find({
    ownerId,
    createdAt: { $lt: threshold }
  }).lean()

  if (expired.length === 0) {
    return []
  }

  await TempProjectUploadModel.deleteMany({
    ownerId,
    id: { $in: expired.map((upload: any) => upload.id) }
  })

  return expired.map((upload: unknown) => toPlainUpload(upload))
}
