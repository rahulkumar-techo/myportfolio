'use client'

import { useEffect } from "react"
import { useTheme } from "next-themes"
import { usePublicSettings } from "@/hooks/useSettings"

export default function ThemeSettingsSync() {
  const { setTheme } = useTheme()
  const { settings } = usePublicSettings()

  useEffect(() => {
    if (settings?.theme) {
      setTheme(settings.theme)
    }
  }, [settings?.theme, setTheme])

  return null
}
