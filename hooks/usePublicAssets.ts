import useSWR from "swr"
import api from "@/lib/axios"
import type { AssetItem } from "@/lib/types"

const fetcher = (url: string) => api.get(url).then((res) => res.data)

export function usePublicAssets() {
  const { data, error, isLoading } = useSWR("/assets", fetcher)

  return {
    assets: (data?.data as AssetItem[] | undefined) ?? [],
    isLoading,
    error
  }
}
