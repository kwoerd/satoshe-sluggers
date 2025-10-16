"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger, SheetTitle, SheetDescription, SheetClose } from "@/components/ui/sheet"
import CustomAuthButton from "@/components/custom-auth-button"

interface MobileMenuProps {
  isWalletConnected?: boolean
}

export function MobileMenu({ isWalletConnected = false }: MobileMenuProps) {
  const [open, setOpen] = useState(false)
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

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="lg:hidden p-2 hover:bg-accent rounded-full transition-colors border border-neutral-700"
        >
          <Menu className="h-9 w-9" />
          <span className="sr-only">Toggle menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent
        side="top"
        className="w-[90%] max-w-md mx-auto mt-[76px] border border-neutral-700 rounded-b-lg pt-2 pb-12 px-6 sm:px-8 bg-neutral-950/80 backdrop-blur-md overflow-y-auto data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:slide-out-to-top data-[state=open]:slide-in-from-top data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 duration-500 ease-out relative"
      >
        <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
        <SheetDescription className="sr-only">Mobile navigation menu with wallet connection and page links</SheetDescription>

        {/* Close button */}
        <div className="flex justify-end mb-2">
          <SheetClose asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 p-0 hover:bg-transparent"
            >
              <X className="h-7 w-7 text-[#ff0099]" />
              <span className="sr-only">Close menu</span>
            </Button>
          </SheetClose>
        </div>

        <div className="flex flex-col gap-2 py-2 items-center">
                  <div className="mb-6 flex items-center gap-3">
                    <CustomAuthButton />
                  </div>
          <nav className="flex flex-col space-y-1 items-center w-full">
            <Link
              href="/"
              className={`text-base sm:text-lg font-medium py-1 w-full text-center relative group transition-colors duration-200 ${
                activePage === "home" ? "text-[#ff0099]" : "text-neutral-400 hover:text-neutral-100"
              }`}
              onClick={() => setOpen(false)}
            >
              HOME
              <span className={`absolute -bottom-0.5 left-1/2 -translate-x-1/2 h-0.5 transition-all duration-300 ease-out ${
                activePage === "home" ? "w-16 bg-[#ff0099]" : "w-0 group-hover:w-16 bg-neutral-100"
              }`}></span>
            </Link>
            <Link
              href="/about"
              className={`text-base sm:text-lg font-medium py-1 w-full text-center relative group transition-colors duration-200 ${
                activePage === "about" ? "text-[#ff0099]" : "text-neutral-400 hover:text-neutral-100"
              }`}
              onClick={() => setOpen(false)}
            >
              ABOUT
              <span className={`absolute -bottom-0.5 left-1/2 -translate-x-1/2 h-0.5 transition-all duration-300 ease-out ${
                activePage === "about" ? "w-16 bg-[#ff0099]" : "w-0 group-hover:w-16 bg-neutral-100"
              }`}></span>
            </Link>
            <Link
              href="/nfts"
              className={`text-base sm:text-lg font-medium py-1 w-full text-center relative group transition-colors duration-200 ${
                activePage === "nfts" ? "text-[#ff0099]" : "text-neutral-400 hover:text-neutral-100"
              }`}
              onClick={() => setOpen(false)}
            >
              NFTS
              <span className={`absolute -bottom-0.5 left-1/2 -translate-x-1/2 h-0.5 transition-all duration-300 ease-out ${
                activePage === "nfts" ? "w-16 bg-[#ff0099]" : "w-0 group-hover:w-16 bg-neutral-100"
              }`}></span>
            </Link>
            <Link
              href="/provenance"
              className={`text-base sm:text-lg font-medium py-1 w-full text-center relative group transition-colors duration-200 ${
                activePage === "provenance" ? "text-[#ff0099]" : "text-neutral-400 hover:text-neutral-100"
              }`}
              onClick={() => setOpen(false)}
            >
              PROVENANCE
              <span className={`absolute -bottom-0.5 left-1/2 -translate-x-1/2 h-0.5 transition-all duration-300 ease-out ${
                activePage === "provenance" ? "w-28 bg-[#ff0099]" : "w-0 group-hover:w-28 bg-neutral-100"
              }`}></span>
            </Link>
            <Link
              href="/contact"
              className={`text-base sm:text-lg font-medium py-1 w-full text-center relative group transition-colors duration-200 ${
                activePage === "contact" ? "text-[#ff0099]" : "text-neutral-400 hover:text-neutral-100"
              }`}
              onClick={() => setOpen(false)}
            >
              CONTACT
              <span className={`absolute -bottom-0.5 left-1/2 -translate-x-1/2 h-0.5 transition-all duration-300 ease-out ${
                activePage === "contact" ? "w-20 bg-[#ff0099]" : "w-0 group-hover:w-20 bg-neutral-100"
              }`}></span>
            </Link>
            {walletConnected && (
              <Link
                href="/my-nfts"
                className={`text-base sm:text-lg font-medium py-1 w-full text-center relative group transition-colors duration-200 ${
                  activePage === "my-nfts" ? "text-[#ff0099]" : "text-neutral-400 hover:text-neutral-100"
                }`}
                onClick={() => setOpen(false)}
              >
                MY NFTS
                <span className={`absolute -bottom-0.5 left-1/2 -translate-x-1/2 h-0.5 transition-all duration-300 ease-out ${
                  activePage === "my-nfts" ? "w-20 bg-[#ff0099]" : "w-0 group-hover:w-20 bg-neutral-100"
                }`}></span>
              </Link>
            )}
          </nav>
        </div>
      </SheetContent>
    </Sheet>
  )
}
