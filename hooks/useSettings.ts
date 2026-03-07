import useSWR, { useSWRConfig } from "swr"
import api from "@/lib/axios"
import type { SiteSettings } from "@/lib/types"

const fetcher = (url: string) => api.get(url).then((response) => response.data)

const PUBLIC_SETTINGS_KEY = "/settings"
const ADMIN_SETTINGS_KEY = "/admin/settings"

export function usePublicSettings() {
  const { data, error, isLoading, mutate } = useSWR(PUBLIC_SETTINGS_KEY, fetcher)

  return {
    settings: data?.data as SiteSettings | undefined,
    isLoading,
    error,
    mutatePublicSettings: mutate
  }
}

export function useAdminSettings() {
  const { cache, mutate: globalMutate } = useSWRConfig()
  const { data, error, isLoading, mutate } = useSWR(ADMIN_SETTINGS_KEY, fetcher)

  const setSettingsLocally = async (payload: Partial<SiteSettings>) => {
    await mutate(
      (current: any) => ({
        ...(current || { success: true }),
        data: {
          ...(current?.data || {}),
          ...payload
        }
      }),
      { revalidate: false }
    )

    const currentPublic = cache.get(PUBLIC_SETTINGS_KEY) as any

    await globalMutate(
      PUBLIC_SETTINGS_KEY,
      {
        ...(currentPublic || { success: true }),
        data: {
          ...(currentPublic?.data || {}),
          ...payload
        }
      },
      { revalidate: false }
    )
  }

  const updateSettings = async (payload: Partial<SiteSettings>) => {
    const response = await api.put(ADMIN_SETTINGS_KEY, payload)
    const nextValue = {
      ...(data || { success: true }),
      data: response.data.data
    }

    await mutate(nextValue, { revalidate: false })
    await globalMutate(
      PUBLIC_SETTINGS_KEY,
      {
        ...(cache.get(PUBLIC_SETTINGS_KEY) as any || { success: true }),
        data: response.data.data
      },
      { revalidate: false }
    )
  }

  return {
    settings: data?.data as SiteSettings | undefined,
    isLoading,
    error,
    setSettingsLocally,
    updateSettings
  }
}
