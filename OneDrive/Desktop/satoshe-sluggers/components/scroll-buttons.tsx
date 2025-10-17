// components/scroll-buttons.tsx
"use client"

import { useState, useEffect } from "react"
import { ArrowUp, ArrowDown } from "lucide-react"
import Image from "next/image"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

export default function ScrollButtons() {
  const [isAtTop, setIsAtTop] = useState(true)

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop
      
      // Check if at top - if less than 100px from top, consider it "at top"
      setIsAtTop(scrollTop < 100)
    }

    window.addEventListener("scroll", handleScroll)
    handleScroll() // Check initial state

    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const scrollToTopOrBottom = () => {
    const target = isAtTop ? document.documentElement.scrollHeight : 0
    const start = window.pageYOffset
    const distance = target - start
    const duration = 3500 // 3.5 seconds for slower, more gentle scroll
    let startTime: number | null = null

    const easeInOutCubic = (t: number): number => {
      return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2
    }

    const animation = (currentTime: number) => {
      if (startTime === null) startTime = currentTime
      const timeElapsed = currentTime - startTime
      const progress = Math.min(timeElapsed / duration, 1)
      const easing = easeInOutCubic(progress)
      
      window.scrollTo(0, start + distance * easing)
      
      if (progress < 1) {
        requestAnimationFrame(animation)
      }
    }

    requestAnimationFrame(animation)
  }

  const handleCookieSettings = () => {
    // TODO: Open cookie settings modal
  }

  return (
    <TooltipProvider>
      {/* Scroll Up/Down Button - Bottom Right - Always Visible */}
      <Tooltip>
        <TooltipTrigger asChild>
          <button
            onClick={scrollToTopOrBottom}
            className="fixed bottom-6 right-8 sm:right-12 lg:right-16 xl:right-20 z-50 w-10 h-10 rounded-full bg-[#ff0099] hover:bg-[#ff0099]/90 text-white shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center group"
            aria-label={isAtTop ? "Scroll to bottom" : "Scroll to top"}
          >
            {isAtTop ? (
              <ArrowDown className="w-5 h-5 stroke-[2.5]" />
            ) : (
              <ArrowUp className="w-5 h-5 stroke-[2.5]" />
            )}
          </button>
        </TooltipTrigger>
        <TooltipContent side="top" className="bg-neutral-800 text-neutral-100 border-neutral-600">
          <p>{isAtTop ? "Scroll to bottom" : "Scroll to top"}</p>
        </TooltipContent>
      </Tooltip>

      {/* Cookie Settings Button - Bottom Left */}
      <Tooltip>
        <TooltipTrigger asChild>
          <button
            onClick={handleCookieSettings}
            className="fixed bottom-6 left-8 sm:left-12 lg:left-16 xl:left-20 z-50 w-12 h-12 flex items-center justify-center hover:bg-neutral-700/50 rounded-full transition-all duration-300"
            aria-label="Cookie settings"
          >
            <Image
              src="/icons/cookies/cookies-icon-48px.png"
              alt="Cookie settings"
              width={48}
              height={48}
              className="w-12 h-12"
            />
          </button>
        </TooltipTrigger>
        <TooltipContent side="top" className="bg-neutral-800 text-neutral-100 border-neutral-600">
          <p>Cookie Settings</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}

