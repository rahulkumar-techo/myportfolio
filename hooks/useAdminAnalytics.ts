import useSWR from "swr"
import api from "@/lib/axios"
import type { AdminAnalytics } from "@/lib/types"

const fetcher = (url: string) => api.get(url).then((res) => res.data)

export function useAdminAnalytics() {
  const { data, error, isLoading, mutate } = useSWR("/admin/analytics", fetcher)

  const setUserBlocked = async (userId: string, blocked: boolean) => {
    await api.patch(`/admin/users/${userId}`, { blocked })
    await mutate()
  }

  const deleteUser = async (userId: string) => {
    await api.delete(`/admin/users/${userId}`)
    await mutate()
  }

  return {
    analytics: (data?.data as AdminAnalytics | undefined) ?? null,
    isLoading,
    error,
    setUserBlocked,
    deleteUser
  }
}
