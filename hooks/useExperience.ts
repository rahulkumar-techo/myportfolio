/**
 * Experience hook
 * Handles CRUD operations for experiences
 */

import useSWR from "swr"
import api from "@/lib/axios"

const fetcher = (url: string) => api.get(url).then(res => res.data)

export function useExperience() {
  const { data, error, isLoading, mutate } = useSWR("/experience", fetcher)

  const createExperience = async (payload: any) => {
    await api.post("/experience", payload)
    mutate()
  }

  const updateExperience = async (id: string, payload: any) => {
    await api.put(`/experience/${id}`, payload)
    mutate()
  }

  const deleteExperience = async (id: string) => {
    await api.delete(`/experience/${id}`)
    mutate()
  }

  return {
    experiences: data?.data || [],
    isLoading,
    error,
    createExperience,
    updateExperience,
    deleteExperience
  }
}