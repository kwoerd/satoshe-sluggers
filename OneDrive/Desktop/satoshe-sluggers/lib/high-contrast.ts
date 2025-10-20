// lib/high-contrast.ts
"use client"

import { useState, useEffect } from 'react'

// Check if user prefers high contrast
export function prefersHighContrast(): boolean {
  if (typeof window === 'undefined') return false
  
  return window.matchMedia('(prefers-contrast: high)').matches
}

// Hook to get high contrast preference
export function useHighContrast(): boolean {
  const [highContrast, setHighContrast] = useState(false)

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-contrast: high)')
    setHighContrast(mediaQuery.matches)

    const handleChange = (event: MediaQueryListEvent) => {
      setHighContrast(event.matches)
    }

    mediaQuery.addEventListener('change', handleChange)
    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [])

  return highContrast
}

// Utility to get high contrast classes
export function getHighContrastClasses(baseClasses: string, highContrastClasses: string): string {
  if (prefersHighContrast()) {
    return `${baseClasses} ${highContrastClasses}`
  }
  return baseClasses
}

// High contrast color utilities
export const highContrastColors = {
  primary: 'text-white border-white',
  secondary: 'text-gray-300 border-gray-300',
  accent: 'text-yellow-400 border-yellow-400',
  background: 'bg-black',
  surface: 'bg-gray-900',
  border: 'border-white',
  focus: 'ring-4 ring-yellow-400 ring-offset-2 ring-offset-black'
}
