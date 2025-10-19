'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { gsap } from 'gsap'

export function usePageTransition() {
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [pendingRoute, setPendingRoute] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    const handleLinkClick = (e: Event) => {
      const target = e.target as HTMLElement
      const link = target.closest('a')
      
      if (!link) return
      
      const href = link.getAttribute('href')
      if (!href) return
      
      // Check if it's an internal link
      const isInternal = href.startsWith('/') && !href.startsWith('//')
      const isNotHash = !href.includes('#')
      const isNotBlank = link.getAttribute('target') !== '_blank'
      
      if (isInternal && isNotHash && isNotBlank) {
        e.preventDefault()
        setPendingRoute(href)
        setIsTransitioning(true)
      }
    }

    // Add click listeners to all links
    document.addEventListener('click', handleLinkClick)
    
    return () => {
      document.removeEventListener('click', handleLinkClick)
    }
  }, [])

  const startTransition = () => {
    setIsTransitioning(true)
  }

  const completeTransition = () => {
    if (pendingRoute) {
      router.push(pendingRoute)
      setPendingRoute(null)
    }
    setIsTransitioning(false)
  }

  return {
    isTransitioning,
    startTransition,
    completeTransition
  }
}
