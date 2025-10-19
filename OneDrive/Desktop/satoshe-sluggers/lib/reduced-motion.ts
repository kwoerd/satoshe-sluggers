// lib/reduced-motion.ts
"use client"

import { useState, useEffect } from 'react'

// Check if user prefers reduced motion
export function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined') return false
  
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

// Hook to get reduced motion preference
export function useReducedMotion(): boolean {
  const [reducedMotion, setReducedMotion] = useState(false)

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    setReducedMotion(mediaQuery.matches)

    const handleChange = (event: MediaQueryListEvent) => {
      setReducedMotion(event.matches)
    }

    mediaQuery.addEventListener('change', handleChange)
    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [])

  return reducedMotion
}

// Utility to conditionally apply motion classes
export function getMotionClasses(baseClasses: string, motionClasses: string): string {
  if (prefersReducedMotion()) {
    return baseClasses
  }
  return `${baseClasses} ${motionClasses}`
}

// Utility to conditionally apply transition duration
export function getTransitionDuration(defaultDuration: string, reducedDuration: string = '0ms'): string {
  if (prefersReducedMotion()) {
    return reducedDuration
  }
  return defaultDuration
}
