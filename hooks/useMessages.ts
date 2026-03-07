/**
 * Messages hook
 */

import useSWR from "swr"
import api from "@/lib/axios"

const fetcher = (url: string) => api.get(url).then(res => res.data)

export function useMessages() {
  const { data, error, isLoading, mutate } = useSWR("/messages", fetcher)

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
    isLoading,
    error,
    updateMessage,
    deleteMessage
  }
}