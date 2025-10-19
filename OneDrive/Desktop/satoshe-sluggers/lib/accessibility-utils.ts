// lib/accessibility-utils.ts
"use client"

// Screen reader announcements
export function announceToScreenReader(message: string, priority: 'polite' | 'assertive' = 'polite') {
  const liveRegion = document.getElementById('live-region')
  if (liveRegion) {
    liveRegion.setAttribute('aria-live', priority)
    liveRegion.textContent = message
    
    // Clear after a short delay to allow for new announcements
    setTimeout(() => {
      if (liveRegion.textContent === message) {
        liveRegion.textContent = ''
      }
    }, 1000)
  }
}

// Focus management utilities
export function trapFocus(element: HTMLElement) {
  const focusableElements = element.querySelectorAll(
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
  ) as NodeListOf<HTMLElement>
  
  const firstElement = focusableElements[0]
  const lastElement = focusableElements[focusableElements.length - 1]
  
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
  
  // Return cleanup function
  return () => {
    element.removeEventListener('keydown', handleTabKey)
  }
}

// Keyboard navigation helpers
export function getKeyboardNavigationProps(
  onEnter?: () => void,
  onEscape?: () => void,
  onArrowUp?: () => void,
  onArrowDown?: () => void,
  onArrowLeft?: () => void,
  onArrowRight?: () => void
) {
  return {
    onKeyDown: (e: React.KeyboardEvent) => {
      switch (e.key) {
        case 'Enter':
        case ' ':
          onEnter?.()
          break
        case 'Escape':
          onEscape?.()
          break
        case 'ArrowUp':
          onArrowUp?.()
          break
        case 'ArrowDown':
          onArrowDown?.()
          break
        case 'ArrowLeft':
          onArrowLeft?.()
          break
        case 'ArrowRight':
          onArrowRight?.()
          break
      }
    }
  }
}

// ARIA label generators
export function generateNFTAltText(name: string, cardNumber: number, rank: string | number, rarity: string, tier: string | number) {
  return `${name} - NFT #${cardNumber}, Rank ${rank}, ${rarity} rarity, Tier ${tier}`
}

export function generateButtonAriaLabel(action: string, itemName: string, additionalInfo?: string) {
  return `${action} ${itemName}${additionalInfo ? ` - ${additionalInfo}` : ''}`
}

// Focus restoration
let previousFocusElement: HTMLElement | null = null

export function saveFocus() {
  previousFocusElement = document.activeElement as HTMLElement
}

export function restoreFocus() {
  if (previousFocusElement) {
    previousFocusElement.focus()
    previousFocusElement = null
  }
}
