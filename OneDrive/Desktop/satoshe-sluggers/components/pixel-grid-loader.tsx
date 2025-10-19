'use client'

import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'

interface PixelGridLoaderProps {
  isVisible: boolean
  onComplete?: () => void
}

export default function PixelGridLoader({ isVisible, onComplete }: PixelGridLoaderProps) {
  const gridRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!isVisible || !gridRef.current) return

    const gridItems = gridRef.current.querySelectorAll('.load_grid-item')
    if (gridItems.length === 0) return

    // Create the pixel grid animation - simple fade out
    gsap.fromTo(
      gridItems,
      {
        opacity: 1,
      },
      {
        opacity: 0,
        duration: 0.8,
        stagger: {
          amount: 1.2,
          from: "random"
        },
        ease: "power2.out",
        onComplete: () => {
          onComplete?.()
        }
      }
    )
  }, [isVisible, onComplete])

  if (!isVisible) return null

  return (
    <div 
      ref={gridRef}
      className="load_grid fixed inset-0 z-50 pointer-events-none"
      style={{
        display: 'block',
        backgroundColor: '#171717',
        width: '100%',
        height: '100%'
      }}
    >
      {/* Generate pixels with no gaps, covering the entire screen */}
      {Array.from({ length: 48 }, (_, i) => {
        // Calculate row and column
        const row = Math.floor(i / 8)
        const col = i % 8
        
        // Calculate position and size for seamless coverage
        const pixelSize = 100 / 8 // 12.5% each
        const left = col * pixelSize
        const top = row * pixelSize
        
        return (
          <div
            key={i}
            className="load_grid-item"
            style={{
              position: 'absolute',
              backgroundColor: '#171717',
              width: `${pixelSize}%`,
              height: `${pixelSize}%`,
              left: `${left}%`,
              top: `${top}%`,
              display: 'block'
            }}
          />
        )
      })}
    </div>
  )
}
