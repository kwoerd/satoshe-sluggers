'use client'

import { useEffect, useState } from 'react'
import PixelGridLoader from './pixel-grid-loader'

export default function PageLoadAnimation() {
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Start animation immediately, complete after a reasonable time
    const animationDuration = 2000 // 2 seconds total
    
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
        // Complete the animation after images are loaded or minimum time
        setTimeout(() => {
          setIsLoading(false)
        }, animationDuration)
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
