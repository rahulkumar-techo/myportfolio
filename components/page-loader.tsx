'use client'

import { useEffect, useState } from 'react'

type PageLoaderProps = {
  minDurationMs?: number
}

export default function PageLoader({ minDurationMs = 600 }: PageLoaderProps) {
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    let cancelled = false
    const start = performance.now()

    const minDelay = new Promise((resolve) => setTimeout(resolve, minDurationMs))
    const readyState = new Promise<void>((resolve) => {
      if (document.readyState === 'complete') {
        resolve()
        return
      }

      const onLoad = () => resolve()
      window.addEventListener('load', onLoad, { once: true })
    })
    const fontsReady = (document as any).fonts?.ready ?? Promise.resolve()

    Promise.all([minDelay, readyState, fontsReady]).then(() => {
      if (cancelled) {
        return
      }

      const elapsed = performance.now() - start
      const delay = Math.max(0, minDurationMs - elapsed)
      if (delay > 0) {
        setTimeout(() => {
          if (!cancelled) {
            setVisible(false)
          }
        }, delay)
        return
      }

      setVisible(false)
    })

    return () => {
      cancelled = true
    }
  }, [minDurationMs])

  if (!visible) {
    return null
  }

  return (
    <div
      role="status"
      aria-live="polite"
      aria-busy="true"
      className="fixed inset-0 z-[70] flex items-center justify-center bg-background/90 backdrop-blur-sm"
    >
      <div className="flex flex-col items-center gap-4">
        <div className="relative h-10 w-10">
          <div className="absolute inset-0 rounded-full border-2 border-primary/20" />
          <div className="absolute inset-0 rounded-full border-2 border-primary border-t-transparent animate-spin" />
        </div>
        <div className="flex flex-col items-center gap-2">
          <span className="text-sm font-mono text-muted-foreground">Loading experience</span>
          <div className="h-1 w-40 overflow-hidden rounded-full bg-secondary">
            <div
              className="h-full w-1/2 rounded-full bg-primary"
              style={{ animation: 'loadingbar 1.2s ease-in-out infinite' }}
            />
          </div>
        </div>
      </div>
      <style jsx>{`
        @keyframes loadingbar {
          0% { transform: translateX(-60%); }
          50% { transform: translateX(20%); }
          100% { transform: translateX(120%); }
        }
      `}</style>
    </div>
  )
}
