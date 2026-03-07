import useSWR from "swr"
import api from "@/lib/axios"
import type { Project } from "@/lib/types"
import { normalizeProject } from "@/lib/project-utils"

const fetcher = (url: string) => api.get(url).then((res) => res.data)

export function useProject(id: string, initialProject?: Project) {
  const { data, error, isLoading } = useSWR(
    id ? `/projects/${id}` : null,
    fetcher,
    initialProject
      ? {
          fallbackData: {
            success: true,
            data: initialProject
          }
        }
      : undefined
  )

  return {
    project: data?.data ? normalizeProject(data.data) : initialProject,
    isLoading,
    error
  }
}
