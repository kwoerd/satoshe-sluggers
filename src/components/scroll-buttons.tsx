"use client"

import { useState, useEffect } from "react"
import { ArrowUp, ArrowDown } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function ScrollButtons() {
  const [isAtTop, setIsAtTop] = useState(true)
  const [isInitialized, setIsInitialized] = useState(false)

  useEffect(() => {
    let timeoutId: NodeJS.Timeout

    const handleScroll = () => {
      // Clear any existing timeout
      clearTimeout(timeoutId)
      
      // Debounce the scroll handler to prevent rapid state changes
      timeoutId = setTimeout(() => {
        const scrollY = window.scrollY
        
        // Determine if we're at the top (with a small buffer)
        const atTop = scrollY < 100
        setIsAtTop(atTop)
      }, 50) // 50ms debounce
    }

    // Initial check with a slight delay to ensure DOM is ready
    const initialCheck = () => {
      setTimeout(() => {
        handleScroll()
        setIsInitialized(true)
      }, 100)
    }
    initialCheck()

    // Add scroll event listener with passive option for better performance
    window.addEventListener("scroll", handleScroll, { passive: true })
    window.addEventListener("resize", handleScroll, { passive: true })

    // Clean up
    return () => {
      clearTimeout(timeoutId)
      window.removeEventListener("scroll", handleScroll)
      window.removeEventListener("resize", handleScroll)
    }
  }, [])

  // Custom smooth scroll function with slower, more controlled animation
  const smoothScrollTo = (targetY: number, duration: number = 2000) => {
    const startY = window.scrollY
    const distance = targetY - startY
    const startTime = performance.now()

    const easeInOutCubic = (t: number): number => {
      return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2
    }

    const animateScroll = (currentTime: number) => {
      const elapsed = currentTime - startTime
      const progress = Math.min(elapsed / duration, 1)
      const easedProgress = easeInOutCubic(progress)
      
      window.scrollTo(0, startY + distance * easedProgress)
      
      if (progress < 1) {
        requestAnimationFrame(animateScroll)
      }
    }

    requestAnimationFrame(animateScroll)
  }

  const handleScrollClick = () => {
    if (isAtTop) {
      // If at top, scroll to bottom
      const currentScrollY = window.scrollY
      const documentHeight = document.documentElement.scrollHeight
      const windowHeight = window.innerHeight
      const remainingDistance = documentHeight - currentScrollY - windowHeight
      const duration = Math.max(1000, remainingDistance * 0.5) // Proportional duration, minimum 1 second
      smoothScrollTo(documentHeight, duration)
    } else {
      // If not at top, scroll to top
      const currentScrollY = window.scrollY
      const duration = Math.max(1000, currentScrollY * 0.5) // Proportional duration, minimum 1 second
      smoothScrollTo(0, duration)
    }
  }

  // Don't render anything until initialized to prevent flashing
  if (!isInitialized) {
    return null
  }

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <Button
        onClick={handleScrollClick}
        size="icon"
        className="rounded-full bg-brand-pink hover:bg-brand-pink-hover shadow-lg transition-all duration-300 hover:scale-105"
        aria-label={isAtTop ? "Scroll to bottom" : "Scroll to top"}
      >
        {isAtTop ? (
          <ArrowDown className="h-7 w-7" style={{ color: "#fffbeb" }} strokeWidth={2.5} />
        ) : (
          <ArrowUp className="h-7 w-7" style={{ color: "#fffbeb" }} strokeWidth={2.5} />
        )}
      </Button>
    </div>
  )
}
