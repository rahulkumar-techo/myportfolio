/**
 * Skills hook
 */

import useSWR from "swr"
import api from "@/lib/axios"

const fetcher = (url: string) => api.get(url).then(res => res.data)

export function useSkills() {
  const { data, error, isLoading, mutate } = useSWR("/skills", fetcher)

  const createSkill = async (payload: any) => {
    await api.post("/skills", payload)
    mutate()
  }

  const updateSkill = async (id: string, payload: any) => {
    await api.put(`/skills/${id}`, payload)
    mutate()
  }

  const deleteSkill = async (id: string) => {
    await api.delete(`/skills/${id}`)
    mutate()
  }

  return {
    skills: data?.data || [],
    isLoading,
    error,
    createSkill,
    updateSkill,
    deleteSkill
  }
}