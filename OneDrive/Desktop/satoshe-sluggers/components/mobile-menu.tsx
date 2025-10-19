// components/mobile-menu.tsx
"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import SimpleConnectButton from "@/components/simple-connect-button"
import { createPortal } from "react-dom"

interface MobileMenuProps {
  isWalletConnected?: boolean
}

export function MobileMenu({ isWalletConnected = false }: MobileMenuProps) {
  const [open, setOpen] = useState(false)
  const [isClosing, setIsClosing] = useState(false)
  const [walletConnected, setWalletConnected] = useState(isWalletConnected)
  const [mounted, setMounted] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    setMounted(true)
  }, [])

  // Sync with prop changes
  useEffect(() => {
    setWalletConnected(isWalletConnected)
  }, [isWalletConnected])

  // Also listen for wallet connection events
  useEffect(() => {
    const handleWalletConnection = (event: Event) => {
      const customEvent = event as CustomEvent;
      setWalletConnected(customEvent.detail.connected)
    }

    window.addEventListener("walletConnectionChanged", handleWalletConnection)

    return () => {
      window.removeEventListener("walletConnectionChanged", handleWalletConnection)
    }
  }, [])

  // Determine active page from pathname
  const getActivePage = () => {
    if (pathname === "/") return "home"
    if (pathname === "/about") return "about"
    if (pathname === "/nfts") return "nfts"
    if (pathname === "/provenance") return "provenance"
    if (pathname === "/contact") return "contact"
    if (pathname === "/my-nfts") return "my-nfts"
    return ""
  }

  const activePage = getActivePage()

  const handleClose = () => {
    setIsClosing(true)
    setTimeout(() => {
      setOpen(false)
      setIsClosing(false)
    }, 700) // Match the animation duration
  }

  const mobileMenuContent = open && mounted && (
    <div 
      className={`fixed inset-0 z-[60] bg-black/50 transition-opacity duration-300 ${
        isClosing ? 'opacity-0' : 'opacity-100'
      }`}
      onClick={handleClose}
    >
          <div 
            className={`w-80 max-w-[90vw] fixed left-1/2 -translate-x-1/2 rounded-lg pt-4 pb-8 px-8 bg-neutral-950 transition-all duration-700 ease-out ${
              isClosing 
                ? '-translate-y-full opacity-0' 
                : 'translate-y-0 opacity-100'
            }`}
        style={{
          top: '76px', // Position below navbar (navbar height is ~76px)
          maxHeight: 'calc(100vh - 100px)', // Leave some margin
        }}
        onClick={(e) => e.stopPropagation()}
      >
            {/* Close button */}
            <div className="flex justify-end mb-4">
              <Button
                variant="ghost"
                size="icon"
                className="h-10 w-10 p-0 hover:bg-neutral-800 rounded-full"
                onClick={handleClose}
              >
                <X className="h-6 w-6 text-[#ff0099]" />
                <span className="sr-only">Close menu</span>
              </Button>
            </div>

        <div className="flex flex-col gap-2 py-2 items-center">
                  <div className="mb-4 flex items-center justify-center w-full">
                    <SimpleConnectButton />
                  </div>
          <nav className="flex flex-col space-y-3 items-center w-full">
            <Link
              href="/"
              className={`text-base sm:text-lg font-medium py-2 w-full text-center relative group transition-all duration-300 ${
                activePage === "home" ? "text-[#ff0099]" : "text-neutral-400 hover:text-[#FFFBEB]"
              }`}
              onClick={handleClose}
            >
              HOME
              <span className={`absolute bottom-1 left-1/2 -translate-x-1/2 h-0.5 transition-all duration-300 ease-out ${
                activePage === "home" ? "w-16 bg-[#ff0099]" : "w-0 group-hover:w-16 bg-neutral-100"
              }`}></span>
            </Link>
            <Link
              href="/about"
              className={`text-base sm:text-lg font-medium py-2 w-full text-center relative group transition-all duration-300 ${
                activePage === "about" ? "text-[#ff0099]" : "text-neutral-400 hover:text-[#FFFBEB]"
              }`}
              onClick={handleClose}
            >
              ABOUT
              <span className={`absolute bottom-1 left-1/2 -translate-x-1/2 h-0.5 transition-all duration-300 ease-out ${
                activePage === "about" ? "w-16 bg-[#ff0099]" : "w-0 group-hover:w-16 bg-neutral-100"
              }`}></span>
            </Link>
            <Link
              href="/nfts"
              className={`text-base sm:text-lg font-medium py-2 w-full text-center relative group transition-all duration-300 ${
                activePage === "nfts" ? "text-[#ff0099]" : "text-neutral-400 hover:text-[#FFFBEB]"
              }`}
              onClick={handleClose}
            >
              NFTS
              <span className={`absolute bottom-1 left-1/2 -translate-x-1/2 h-0.5 transition-all duration-300 ease-out ${
                activePage === "nfts" ? "w-16 bg-[#ff0099]" : "w-0 group-hover:w-16 bg-neutral-100"
              }`}></span>
            </Link>
            <Link
              href="/provenance"
              className={`text-base sm:text-lg font-medium py-2 w-full text-center relative group transition-all duration-300 ${
                activePage === "provenance" ? "text-[#ff0099]" : "text-neutral-400 hover:text-[#FFFBEB]"
              }`}
              onClick={handleClose}
            >
              PROVENANCE
              <span className={`absolute bottom-1 left-1/2 -translate-x-1/2 h-0.5 transition-all duration-300 ease-out ${
                activePage === "provenance" ? "w-28 bg-[#ff0099]" : "w-0 group-hover:w-28 bg-neutral-100"
              }`}></span>
            </Link>
            <Link
              href="/contact"
              className={`text-base sm:text-lg font-medium py-2 w-full text-center relative group transition-all duration-300 ${
                activePage === "contact" ? "text-[#ff0099]" : "text-neutral-400 hover:text-[#FFFBEB]"
              }`}
              onClick={handleClose}
            >
              CONTACT
              <span className={`absolute bottom-1 left-1/2 -translate-x-1/2 h-0.5 transition-all duration-300 ease-out ${
                activePage === "contact" ? "w-20 bg-[#ff0099]" : "w-0 group-hover:w-20 bg-neutral-100"
              }`}></span>
            </Link>
          </nav>
        </div>
          </div>
        </div>
  )

  return (
    <div className="lg:hidden flex items-center gap-4">
      {walletConnected && (
        <Link
          href="/my-nfts"
          className="flex items-center justify-center group"
          aria-label="My NFTs"
        >
          <Image
            src="/icons/profile-icons/pink-profile-icon-48.png"
            alt="My NFTs"
            width={24}
            height={24}
            className="w-6 h-6 group-hover:scale-110 transition-transform duration-200"
          />
        </Link>
      )}
      <Button
        variant="ghost"
        size="icon"
        className="p-2 hover:bg-accent rounded-full transition-colors border border-neutral-700"
        onClick={() => setOpen(!open)}
      >
        <Menu className="h-9 w-9" />
        <span className="sr-only">Toggle menu</span>
      </Button>
      
      {mounted && mobileMenuContent && createPortal(mobileMenuContent, document.body)}
    </div>
  )
}
