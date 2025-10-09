"use client"

import { useState, useEffect } from "react"
import Image from "next/image"

function CookieConsent() {
  const [showBanner, setShowBanner] = useState(false)
  const [consentGiven, setConsentGiven] = useState(false)

  useEffect(() => {
    // Check if user has already given consent
    const hasConsent = localStorage.getItem('cookie-consent')
    if (hasConsent) {
      setConsentGiven(true)
    }
  }, [])

  const handleCookieClick = () => {
    if (consentGiven) {
      // If consent already given, show preferences
      setShowBanner(true)
    } else {
      // If no consent yet, show banner
      setShowBanner(true)
    }
  }

  const handleAccept = () => {
    localStorage.setItem('cookie-consent', 'accepted')
    setConsentGiven(true)
    setShowBanner(false)
    // Load Termly script
    loadTermlyScript()
  }

  const handleDecline = () => {
    localStorage.setItem('cookie-consent', 'declined')
    setConsentGiven(true)
    setShowBanner(false)
  }

  const handlePreferences = () => {
    // Open Termly preferences
    if (typeof window !== 'undefined' && (window as any).termly) {
      (window as any).termly.displayPreferences()
    }
  }

  const loadTermlyScript = () => {
    if (typeof window !== 'undefined' && !document.querySelector('script[src*="termly.io"]')) {
      const script = document.createElement('script')
      script.src = 'https://app.termly.io/resource-blocker/ba09ca99-2e6c-4e83-adca-6b3e27ffe054?autoBlock=on'
      script.async = true
      script.defer = true
      document.head.appendChild(script)
    }
  }

  if (consentGiven && !showBanner) {
    // Show only the cookie icon for preferences
    return (
      <div className="fixed bottom-6 left-6 z-[9999]">
        <button
          onClick={handleCookieClick}
          className="p-2 bg-card border border-border rounded-full hover:bg-accent transition-colors shadow-lg"
          title="Cookie Preferences"
        >
          <Image
            src="/icons/cookies-icon-40px-circular.png"
            alt="Cookie Preferences"
            width={24}
            height={24}
            className="w-6 h-6"
          />
        </button>
      </div>
    )
  }

  if (showBanner) {
    return (
      <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50">
        <div className="bg-card border border-border rounded-lg p-6 max-w-md mx-4 shadow-xl">
          <h3 className="text-lg font-semibold text-foreground mb-4">Cookie Consent</h3>
          <p className="text-muted-foreground mb-6">
            We use cookies to enhance your experience and analyze our traffic. 
            By clicking "Accept", you consent to our use of cookies.
          </p>
          
          <div className="flex flex-col gap-3">
            <div className="flex gap-3">
              <button
                onClick={handleAccept}
                className="flex-1 px-4 py-2 bg-accent text-accent-foreground rounded-sm hover:bg-accent/90 transition-colors"
              >
                Accept All
              </button>
              <button
                onClick={handleDecline}
                className="flex-1 px-4 py-2 border border-border text-foreground rounded-sm hover:bg-accent transition-colors"
              >
                Decline
              </button>
            </div>
            
            {consentGiven && (
              <button
                onClick={handlePreferences}
                className="w-full px-4 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors underline"
              >
                Manage Cookie Preferences
              </button>
            )}
          </div>
        </div>
      </div>
    )
  }

  // Show cookie icon for first-time visitors
  return (
    <div className="fixed bottom-6 left-6 z-[9999]">
      <button
        onClick={handleCookieClick}
        className="p-2 bg-card border border-border rounded-full hover:bg-accent transition-colors shadow-lg animate-pulse"
        title="Cookie Consent"
      >
        <Image
          src="/icons/cookies-icon-40px-circular.png"
          alt="Cookie Consent"
          width={24}
          height={24}
          className="w-6 h-6"
        />
      </button>
    </div>
  )
}

export default CookieConsent
