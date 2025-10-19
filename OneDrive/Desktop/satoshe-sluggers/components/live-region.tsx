// components/live-region.tsx
"use client"

import { useEffect, useRef } from "react"

interface LiveRegionProps {
  message: string
  priority?: "polite" | "assertive"
  className?: string
}

export function LiveRegion({ message, priority = "polite", className = "" }: LiveRegionProps) {
  const regionRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (message && regionRef.current) {
      regionRef.current.textContent = message
    }
  }, [message])

  return (
    <div
      ref={regionRef}
      aria-live={priority}
      aria-atomic="true"
      className={`sr-only ${className}`}
      role="status"
    />
  )
}

// Hook for announcing messages
export function useLiveRegion() {
  const announce = (message: string) => {
    const region = document.getElementById('live-region')
    if (region) {
      region.textContent = message
    }
  }

  return { announce }
}
