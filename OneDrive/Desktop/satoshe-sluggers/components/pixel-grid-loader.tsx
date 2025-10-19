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

    // Create the pixel grid animation - more dramatic
    gsap.fromTo(
      gridItems,
      {
        opacity: 1,
        scale: 1,
        rotation: 0,
      },
      {
        opacity: 0,
        scale: 0.3,
        rotation: 180,
        duration: 1.2,
        stagger: {
          amount: 1.0,
          from: "random"
        },
        ease: "power3.out",
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
        display: 'grid',
        gridTemplateColumns: 'repeat(8, 1fr)',
        gridTemplateRows: 'repeat(6, 1fr)',
        gap: '2px',
        backgroundColor: '#171717',
        padding: '2px'
      }}
    >
      {/* Generate 48 grid items (8x6) with strategic placement over NFT areas */}
      {Array.from({ length: 48 }, (_, i) => {
        // Calculate row and column
        const row = Math.floor(i / 8)
        const col = i % 8
        
        // Create larger squares over NFT image areas
        // Left side NFT area (columns 0-3, rows 1-4)
        const isLeftNFT = col <= 3 && row >= 1 && row <= 4
        // Right side NFT area (columns 4-7, rows 1-4) 
        const isRightNFT = col >= 4 && row >= 1 && row <= 4
        // Center logo area (columns 2-5, rows 0-1)
        const isCenterLogo = col >= 2 && col <= 5 && row <= 1
        
        // Make squares larger in NFT areas, smaller elsewhere
        const size = isLeftNFT || isRightNFT ? '100%' : isCenterLogo ? '80%' : '60%'
        const delay = isLeftNFT || isRightNFT ? 0.3 : isCenterLogo ? 0.1 : 0
        
        return (
          <div
            key={i}
            className="load_grid-item"
            style={{
              backgroundColor: isLeftNFT || isRightNFT ? '#2a2a2a' : '#171717',
              width: size,
              height: size,
              justifySelf: 'center',
              alignSelf: 'center',
              transitionDelay: `${delay}s`,
              border: '1px solid #333',
              borderRadius: '2px'
            }}
          />
        )
      })}
    </div>
  )
}
