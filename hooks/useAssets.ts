import useSWR from "swr"
import api from "@/lib/axios"
import type { AssetItem } from "@/lib/types"

const fetcher = (url: string) => api.get(url).then((res) => res.data)

export function useAssets() {
  const { data, error, isLoading, mutate } = useSWR("/assets", fetcher)

  const uploadAsset = async (payload: { label: string; category: AssetItem["category"]; file: File }) => {
    const formData = new FormData()
    formData.append("label", payload.label)
    formData.append("category", payload.category)
    formData.append("file", payload.file)

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

  return {
    assets: (data?.data as AssetItem[] | undefined) ?? [],
    isLoading,
    error,
    uploadAsset,
    deleteAsset
  }
}
