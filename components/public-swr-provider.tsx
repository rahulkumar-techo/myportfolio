'use client'

import type { ReactNode } from "react"
import { SWRConfig } from "swr"

type PublicSWRProviderProps = {
  children: ReactNode
  fallback: Record<string, unknown>
}

export default function PublicSWRProvider({ children, fallback }: PublicSWRProviderProps) {
  return (
    <SWRConfig
      value={{
        fallback,
        revalidateOnFocus: true,
        revalidateOnReconnect: true,
        revalidateOnMount: true,
        revalidateIfStale: true,
        dedupingInterval: 60_000
      }}
    >
      {children}
    </SWRConfig>
  )
}
