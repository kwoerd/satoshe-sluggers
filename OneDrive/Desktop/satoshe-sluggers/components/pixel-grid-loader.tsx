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
    console.log('PixelGridLoader: isVisible =', isVisible)
    if (!isVisible || !gridRef.current) return

    const gridItems = gridRef.current.querySelectorAll('.load_grid-item')
    console.log('PixelGridLoader: Found', gridItems.length, 'grid items')
    if (gridItems.length === 0) return

    // Create the pixel grid animation - fade out from center
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
          from: "center"
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
      className="load_grid absolute inset-0 pointer-events-none"
      style={{
        display: 'block',
        width: '100%',
        height: '100%',
        zIndex: 9999
      }}
    >
      {/* Generate pixels with no gaps, covering the entire screen */}
      {Array.from({ length: 80 }, (_, i) => {
        // Calculate row and column - 10 columns x 8 rows = 80 pixels
        const row = Math.floor(i / 10)
        const col = i % 10
        
        // Calculate position and size for seamless coverage
        const pixelSize = 100 / 10 // 10% each
        const pixelHeight = 100 / 8 // 12.5% each
        const left = col * pixelSize
        const top = row * pixelHeight
        
        return (
          <div
            key={i}
            className="load_grid-item"
            style={{
              position: 'absolute',
              backgroundColor: '#171717',
              width: `${pixelSize}%`,
              height: `${pixelHeight}%`,
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
