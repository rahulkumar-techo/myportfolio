/**
 * Projects hook
 */

import useSWR from "swr"
import api from "@/lib/axios"
import { normalizeProjects } from "@/lib/project-utils"

const fetcher = (url: string) => api.get(url).then(res => res.data)

export function useProjects() {
  const { data, error, isLoading, mutate } = useSWR("/projects", fetcher)

  const createProject = async (payload: any) => {
    await api.post("/projects", payload)
    mutate()
  }

  const updateProject = async (id: string, payload: any) => {
    await api.put(`/projects/${id}`, payload)
    mutate()
  }

  const deleteProject = async (id: string) => {
    await api.delete(`/projects/${id}`)
    mutate()
  }

  return {
    projects: normalizeProjects(data?.data),
    isLoading,
    error,
    createProject,
    updateProject,
    deleteProject
  }
}
