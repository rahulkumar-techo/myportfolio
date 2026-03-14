import useSWR from "swr"
import api from "@/lib/axios"

const fetcher = (url: string) => api.get(url).then((response) => response.data)

export function useAdminProfile() {
  const { data, error, isLoading, mutate } = useSWR("/profile", fetcher)

  return {
    profile: data?.data?.profile as { name?: string; email?: string; image?: string } | undefined,
    isLoading,
    error,
    mutateProfile: mutate
  }
}
