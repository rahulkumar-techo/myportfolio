import useSWR from "swr"
import api from "@/lib/axios"
import type { PublicProfileSummary } from "@/lib/types"

const fetcher = (url: string) => api.get(url).then((response) => response.data)

export function usePublicProfile() {
  const { data, error, isLoading } = useSWR("/public/profile", fetcher)

  return {
    profile: (data?.data as PublicProfileSummary | undefined) ?? null,
    isLoading,
    error
  }
}
