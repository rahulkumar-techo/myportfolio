import useSWR from "swr"
import api from "@/lib/axios"
import { prepareImageForUpload } from "@/lib/image-upload"
import type { AssetItem } from "@/lib/types"

const fetcher = (url: string) => api.get(url).then((res) => res.data)

export function useAssets() {
  const { data, error, isLoading, mutate } = useSWR("/assets", fetcher)

  const uploadAsset = async (payload: { label: string; category: AssetItem["category"]; file: File }) => {
    const isImage = payload.file.type.startsWith("image/")
    const preparedFile = isImage ? await prepareImageForUpload(payload.file, "asset-image") : payload.file
    const formData = new FormData()
    formData.append("label", payload.label)
    formData.append("category", payload.category)
    formData.append("file", preparedFile)
    if (isImage) {
      formData.append("kind", "asset-image")
    }

    const response = await fetch("/api/assets", {
      method: "POST",
      body: formData
    })

    const result = await response.json()

    if (!response.ok) {
      throw new Error(result?.error ?? "Unable to upload asset.")
    }

    await mutate()

    return result.data as AssetItem
  }

  const deleteAsset = async (assetId: string) => {
    await api.delete(`/assets/${assetId}`)
    await mutate()
  }

  const updateAsset = async (assetId: string, payload: { label: string; category: AssetItem["category"]; featured?: boolean; file?: File | null }) => {
    const formData = new FormData()
    formData.append("label", payload.label)
    formData.append("category", payload.category)
    formData.append("featured", String(Boolean(payload.featured)))

    if (payload.file) {
      const isImage = payload.file.type.startsWith("image/")
      const preparedFile = isImage ? await prepareImageForUpload(payload.file, "asset-image") : payload.file
      formData.append("file", preparedFile)
      if (isImage) {
        formData.append("kind", "asset-image")
      }
    }

    const response = await fetch(`/api/assets/${assetId}`, {
      method: "PUT",
      body: formData
    })

    const result = await response.json()

    if (!response.ok) {
      throw new Error(result?.error ?? "Unable to update asset.")
    }

    await mutate()

    return result.data as AssetItem
  }

  return {
    assets: (data?.data as AssetItem[] | undefined) ?? [],
    isLoading,
    error,
    uploadAsset,
    deleteAsset,
    updateAsset
  }
}
