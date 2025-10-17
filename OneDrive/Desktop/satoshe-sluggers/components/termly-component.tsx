// components/termly-component.tsx
"use client"

import { useEffect, useRef } from "react"

export default function TermlyComponent() {
  const hasLoaded = useRef(false)

  useEffect(() => {
    // Only load once and only after hydration
    if (hasLoaded.current) return

    const loadTermly = () => {
      // Check if Termly is already loaded
      if (document.querySelector('#termly-code-snippet-support')) {
        return
      }

      // Check if we're in the browser
      if (typeof window === 'undefined') return

      const script = document.createElement('script')
      script.src = 'https://app.termly.io/resource-blocker/ba09ca99-2e6c-4e83-adca-6b3e27ffe054?autoBlock=on'
      script.async = true
      script.id = 'termly-script'
      script.onload = () => {
        hasLoaded.current = true
      }
      document.head.appendChild(script)
    }

    // Use requestAnimationFrame to ensure DOM is ready
    const timer = requestAnimationFrame(() => {
      loadTermly()
    })

    return () => {
      cancelAnimationFrame(timer)
    }
  }, [])

  return null
}
