'use client'

import { createContext, useContext, ReactNode } from 'react'
import { usePageTransition } from '@/hooks/usePageTransition'
import PixelGridLoader from './pixel-grid-loader'

interface PageTransitionContextType {
  isTransitioning: boolean
  startTransition: () => void
  completeTransition: () => void
}

const PageTransitionContext = createContext<PageTransitionContextType | undefined>(undefined)

export function usePageTransitionContext() {
  const context = useContext(PageTransitionContext)
  if (context === undefined) {
    throw new Error('usePageTransitionContext must be used within a PageTransitionProvider')
  }
  return context
}

interface PageTransitionProviderProps {
  children: ReactNode
}

export default function PageTransitionProvider({ children }: PageTransitionProviderProps) {
  const { isTransitioning, startTransition, completeTransition } = usePageTransition()

  return (
    <PageTransitionContext.Provider value={{ isTransitioning, startTransition, completeTransition }}>
      {children}
      <PixelGridLoader 
        isVisible={isTransitioning} 
        onComplete={completeTransition}
      />
    </PageTransitionContext.Provider>
  )
}
