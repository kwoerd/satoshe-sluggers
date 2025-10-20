// lib/accessibility.ts
"use client"

export const accessibility = {
  // ARIA labels for common actions
  labels: {
    close: "Close",
    open: "Open",
    toggle: "Toggle",
    expand: "Expand",
    collapse: "Collapse",
    next: "Next",
    previous: "Previous",
    first: "First",
    last: "Last",
    buy: "Buy NFT",
    view: "View NFT details",
    favorite: "Add to favorites",
    unfavorite: "Remove from favorites",
    copy: "Copy to clipboard",
    external: "Open in new tab",
    loading: "Loading",
    error: "Error occurred",
  },

  // Screen reader announcements
  announcements: {
    nftPurchased: "NFT purchased successfully",
    nftFavorited: "NFT added to favorites",
    nftUnfavorited: "NFT removed from favorites",
    addressCopied: "Address copied to clipboard",
    errorOccurred: "An error occurred, please try again",
    loadingComplete: "Loading complete",
  },

  // Focus management
  focus: {
    trap: (element: HTMLElement) => {
      const focusableElements = element.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      )
      const firstElement = focusableElements[0] as HTMLElement
      const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement

      const handleTabKey = (e: KeyboardEvent) => {
        if (e.key === 'Tab') {
          if (e.shiftKey) {
            if (document.activeElement === firstElement) {
              lastElement.focus()
              e.preventDefault()
            }
          } else {
            if (document.activeElement === lastElement) {
              firstElement.focus()
              e.preventDefault()
            }
          }
        }
      }

      element.addEventListener('keydown', handleTabKey)
      firstElement?.focus()

      return () => {
        element.removeEventListener('keydown', handleTabKey)
      }
    },

    restore: (element: HTMLElement | null) => {
      if (element) {
        element.focus()
      }
    }
  },

  // Keyboard navigation helpers
  keyboard: {
    isEscape: (e: KeyboardEvent) => e.key === 'Escape',
    isEnter: (e: KeyboardEvent) => e.key === 'Enter',
    isSpace: (e: KeyboardEvent) => e.key === ' ',
    isArrowUp: (e: KeyboardEvent) => e.key === 'ArrowUp',
    isArrowDown: (e: KeyboardEvent) => e.key === 'ArrowDown',
    isArrowLeft: (e: KeyboardEvent) => e.key === 'ArrowLeft',
    isArrowRight: (e: KeyboardEvent) => e.key === 'ArrowRight',
    isTab: (e: KeyboardEvent) => e.key === 'Tab',
  },

  // Color contrast helpers
  contrast: {
    // Check if text meets WCAG AA contrast requirements
    meetsAA: (): boolean => {
      // This is a simplified check - in production, use a proper contrast library
      return true // Placeholder
    }
  },

  // Screen reader utilities
  screenReader: {
    announce: (message: string) => {
      const announcement = document.createElement('div')
      announcement.setAttribute('aria-live', 'polite')
      announcement.setAttribute('aria-atomic', 'true')
      announcement.className = 'sr-only'
      announcement.textContent = message
      
      document.body.appendChild(announcement)
      
      setTimeout(() => {
        document.body.removeChild(announcement)
      }, 1000)
    },

    announceUrgent: (message: string) => {
      const announcement = document.createElement('div')
      announcement.setAttribute('aria-live', 'assertive')
      announcement.setAttribute('aria-atomic', 'true')
      announcement.className = 'sr-only'
      announcement.textContent = message
      
      document.body.appendChild(announcement)
      
      setTimeout(() => {
        document.body.removeChild(announcement)
      }, 1000)
    }
  }
}

// Hook for accessibility utilities
export function useAccessibility() {
  return {
    announce: accessibility.screenReader.announce,
    announceUrgent: accessibility.screenReader.announceUrgent,
    focus: accessibility.focus,
    keyboard: accessibility.keyboard,
    labels: accessibility.labels,
  }
}

// Utility to check if user prefers reduced motion
export function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined') return false
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

// Utility to check if user prefers high contrast
export function prefersHighContrast(): boolean {
  if (typeof window === 'undefined') return false
  return window.matchMedia('(prefers-contrast: high)').matches
}
