'use client'

import { useEffect, useState } from 'react'
import PixelGridLoader from './pixel-grid-loader'

export default function PageLoadAnimation() {
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Start with a minimum animation time, then check for images
    const minAnimationTime = 1500 // 1.5 seconds minimum
    
    const checkImagesLoaded = () => {
      const criticalImages = [
        '/brands/satoshe-sluggers/satoshe-sluggers-off-white-op.svg',
        '/nfts/1.webp',
        '/nfts/5.webp',
        '/nfts/9.webp',
        '/nfts/11.webp',
        '/nfts/120.webp',
        '/nfts/634.webp'
      ]

      const imagePromises = criticalImages.map(src => {
        return new Promise((resolve) => {
          const img = new Image()
          img.onload = () => resolve(true)
          img.onerror = () => resolve(true) // Resolve even on error to prevent hanging
          img.src = src
        })
      })

      Promise.all(imagePromises).then(() => {
        // Complete the animation after minimum time + images are loaded
        setTimeout(() => {
          setIsLoading(false)
        }, minAnimationTime)
      })
    }

    // Start checking images immediately
    checkImagesLoaded()
  }, [])

  return (
    <PixelGridLoader 
      isVisible={isLoading} 
      onComplete={() => setIsLoading(false)}
    />
  )
}
