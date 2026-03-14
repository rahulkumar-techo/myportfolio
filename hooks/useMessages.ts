/**
 * Messages hook
 */

import useSWR from "swr"
import api from "@/lib/axios"

const fetcher = (url: string) => api.get(url).then(res => res.data)

export type MessageFilter = "active" | "archived" | "all"

export function useMessages(
  filter: MessageFilter = "active",
  options?: { enabled?: boolean }
) {
  const shouldFetch = options?.enabled !== false
  const { data, error, isLoading, mutate } = useSWR(
    shouldFetch ? `/messages?status=${filter}` : null,
    fetcher
  )

  const updateMessage = async (id: string, payload: any) => {
    await api.put(`/messages/${id}`, payload)
    mutate()
  }

  const deleteMessage = async (id: string) => {
    await api.delete(`/messages/${id}`)
    mutate()
  }

  return {
    messages: data?.data || [],
    meta: data?.meta as { total?: number; unread?: number; archived?: number } | undefined,
    isLoading,
    error,
    updateMessage,
    deleteMessage
  }
}
