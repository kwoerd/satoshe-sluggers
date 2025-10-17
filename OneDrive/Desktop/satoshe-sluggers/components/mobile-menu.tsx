// components/mobile-menu.tsx
"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import SimpleConnectButton from "@/components/simple-connect-button"

interface MobileMenuProps {
  isWalletConnected?: boolean
}

export function MobileMenu({ isWalletConnected = false }: MobileMenuProps) {
  const [open, setOpen] = useState(false)
  const [isClosing, setIsClosing] = useState(false)
  const [walletConnected, setWalletConnected] = useState(isWalletConnected)
  const pathname = usePathname()

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
    }, 300) // Match the animation duration
  }

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
      
      {open && (
        <div 
          className={`fixed inset-0 z-50 bg-black/50 transition-opacity duration-300 ${
            isClosing ? 'animate-out fade-out' : 'animate-in fade-in'
          }`}
          onClick={handleClose}
        >
          <div 
            className={`w-[90%] max-w-md mx-auto mt-[76px] border border-neutral-700 rounded-b-lg pt-2 pb-12 px-6 sm:px-8 bg-neutral-950 overflow-y-auto transition-all duration-300 ease-out ${
              isClosing 
                ? 'animate-out slide-out-to-top-2 ease-in' 
                : 'animate-in slide-in-from-top-2 ease-out'
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <div className="flex justify-end mb-2">
              <Button
                variant="ghost"
                size="icon"
                className="h-10 w-10 p-0 hover:bg-transparent"
                onClick={handleClose}
              >
                <X className="h-8 w-8 text-[#ff0099]" />
                <span className="sr-only">Close menu</span>
              </Button>
            </div>

        <div className="flex flex-col gap-2 py-2 items-center">
                  <div className="mb-6 flex items-center gap-3">
                    <SimpleConnectButton />
                  </div>
          <nav className="flex flex-col space-y-1 items-center w-full animate-in fade-in slide-in-from-top-2 duration-500 delay-100">
            <Link
              href="/"
              className={`text-base sm:text-lg font-medium py-1 w-full text-center relative group transition-all duration-300 animate-in fade-in slide-in-from-top-1 delay-200 ${
                activePage === "home" ? "text-[#ff0099]" : "text-neutral-400 hover:text-[#FFFBEB]"
              }`}
              onClick={handleClose}
            >
              HOME
              <span className={`absolute bottom-0 left-1/2 -translate-x-1/2 h-0.5 transition-all duration-300 ease-out ${
                activePage === "home" ? "w-16 bg-[#ff0099]" : "w-0 group-hover:w-16 bg-neutral-100"
              }`}></span>
            </Link>
            <Link
              href="/about"
              className={`text-base sm:text-lg font-medium py-1 w-full text-center relative group transition-all duration-300 animate-in fade-in slide-in-from-top-1 delay-300 ${
                activePage === "about" ? "text-[#ff0099]" : "text-neutral-400 hover:text-[#FFFBEB]"
              }`}
              onClick={handleClose}
            >
              ABOUT
              <span className={`absolute bottom-0 left-1/2 -translate-x-1/2 h-0.5 transition-all duration-300 ease-out ${
                activePage === "about" ? "w-16 bg-[#ff0099]" : "w-0 group-hover:w-16 bg-neutral-100"
              }`}></span>
            </Link>
            <Link
              href="/nfts"
              className={`text-base sm:text-lg font-medium py-1 w-full text-center relative group transition-all duration-300 animate-in fade-in slide-in-from-top-1 delay-400 ${
                activePage === "nfts" ? "text-[#ff0099]" : "text-neutral-400 hover:text-[#FFFBEB]"
              }`}
              onClick={handleClose}
            >
              NFTS
              <span className={`absolute bottom-0 left-1/2 -translate-x-1/2 h-0.5 transition-all duration-300 ease-out ${
                activePage === "nfts" ? "w-16 bg-[#ff0099]" : "w-0 group-hover:w-16 bg-neutral-100"
              }`}></span>
            </Link>
            <Link
              href="/provenance"
              className={`text-base sm:text-lg font-medium py-1 w-full text-center relative group transition-all duration-300 animate-in fade-in slide-in-from-top-1 delay-500 ${
                activePage === "provenance" ? "text-[#ff0099]" : "text-neutral-400 hover:text-[#FFFBEB]"
              }`}
              onClick={handleClose}
            >
              PROVENANCE
              <span className={`absolute bottom-0 left-1/2 -translate-x-1/2 h-0.5 transition-all duration-300 ease-out ${
                activePage === "provenance" ? "w-28 bg-[#ff0099]" : "w-0 group-hover:w-28 bg-neutral-100"
              }`}></span>
            </Link>
            <Link
              href="/contact"
              className={`text-base sm:text-lg font-medium py-1 w-full text-center relative group transition-all duration-300 animate-in fade-in slide-in-from-top-1 delay-600 ${
                activePage === "contact" ? "text-[#ff0099]" : "text-neutral-400 hover:text-[#FFFBEB]"
              }`}
              onClick={handleClose}
            >
              CONTACT
              <span className={`absolute bottom-0 left-1/2 -translate-x-1/2 h-0.5 transition-all duration-300 ease-out ${
                activePage === "contact" ? "w-20 bg-[#ff0099]" : "w-0 group-hover:w-20 bg-neutral-100"
              }`}></span>
            </Link>
          </nav>
        </div>
          </div>
        </div>
      )}
    </div>
  )
}
