'use client'

import { useEffect, useState } from 'react'
import PixelGridLoader from './pixel-grid-loader'

export default function PageLoadAnimation() {
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    console.log('PageLoadAnimation: Starting animation')
    
    // Set a minimum animation time regardless of image loading
    const minAnimationTime = 2000 // 2 seconds minimum
    
    const timer = setTimeout(() => {
      console.log('PageLoadAnimation: Animation complete')
      setIsLoading(false)
    }, minAnimationTime)
    
    return () => clearTimeout(timer)
  }, [])

  return (
    <PixelGridLoader 
      isVisible={isLoading} 
      onComplete={() => setIsLoading(false)}
    />
  )
}
