// components/termly-script.tsx
"use client"

import { useEffect, useState } from "react"
import dynamic from "next/dynamic"

// Only load Termly on client side after hydration
const TermlyComponent = dynamic(() => import('./termly-component'), {
  ssr: false,
  loading: () => null
})

export default function TermlyScript() {
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  if (!isClient) {
    return null
  }

  return <TermlyComponent />
}
