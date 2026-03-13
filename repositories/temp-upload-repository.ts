import { getPortfolioOwner } from "@/repositories/portfolio-repository"
import type { TempProjectUpload } from "@/lib/types"

export async function listTempProjectUploads(userId?: string): Promise<TempProjectUpload[]> {
  const owner = await getPortfolioOwner(userId)
  return owner.tempProjectUploads ?? []
}

export async function addTempProjectUpload(
  userId: string | undefined,
  upload: TempProjectUpload
) {
  const owner = await getPortfolioOwner(userId)
  if (!Array.isArray(owner.tempProjectUploads)) {
    owner.tempProjectUploads = []
  }
  owner.tempProjectUploads.push(upload)
  await owner.save()
  return upload
}

export async function removeTempProjectUploadsByPublicIds(
  userId: string | undefined,
  publicIds: string[]
) {
  if (publicIds.length === 0) {
    return
  }

  const owner = await getPortfolioOwner(userId)
  owner.tempProjectUploads = (owner.tempProjectUploads ?? []).filter(
    (upload: TempProjectUpload) => !publicIds.includes(upload.publicId)
  )
  await owner.save()
}

export async function cleanupTempProjectUploads(
  userId: string | undefined,
  olderThanMs: number
) {
  const owner = await getPortfolioOwner(userId)
  const now = Date.now()
  const uploads = owner.tempProjectUploads ?? []

  const expired = uploads.filter((upload: TempProjectUpload) => {
    const createdAt = new Date(upload.createdAt).getTime()
    return now - createdAt > olderThanMs
  })

  if (expired.length === 0) {
    return []
  }

  owner.tempProjectUploads = uploads.filter(
    (upload: TempProjectUpload) => !expired.some((item: TempProjectUpload) => item.id === upload.id)
  )
  await owner.save()

  return expired
}
