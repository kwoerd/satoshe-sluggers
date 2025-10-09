"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet"
import ConnectWalletButton from "@/components/connect-wallet-button"

interface MobileMenuProps {
  isWalletConnected?: boolean
  activePage?: "home" | "about" | "nfts" | "provenance" | "my-nfts" | "contact"
}

export default function MobileMenu({ isWalletConnected = false, activePage = "home" }: MobileMenuProps) {
  const [open, setOpen] = useState(false)
  const [walletConnected, setWalletConnected] = useState(isWalletConnected)

  // Sync with prop changes
  useEffect(() => {
    setWalletConnected(isWalletConnected)
  }, [isWalletConnected])

  // Also listen for wallet connection events
  useEffect(() => {
    const handleWalletConnection = (event: CustomEvent) => {
      setWalletConnected(event.detail.connected)
    }

    window.addEventListener("walletConnectionChanged" as any, handleWalletConnection)

    return () => {
      window.removeEventListener("walletConnectionChanged" as any, handleWalletConnection)
    }
  }, [])

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="lg:hidden p-2 hover:bg-accent rounded-full transition-colors border border-border"
          id="mobile-menu-trigger"
        >
          <Menu className="h-8 w-8" style={{ color: "#fffbeb" }} />
          <span className="sr-only">Toggle menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent
        side="top"
        className="w-[90%] max-w-md mx-auto h-[85vh] max-h-[600px] border-t pt-6 pb-12 px-6 sm:px-8 transition-all duration-300 ease-in-out animate-in slide-in-from-top overflow-y-auto relative"
        id="mobile-menu-sheet"
      >
        <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
        <div className="flex flex-col gap-4 py-4 items-center">
          <div className="mb-4">
            <ConnectWalletButton />
          </div>
          <nav className="flex flex-col space-y-4 items-center w-full max-w-md mx-auto">
            <Link
              href="/"
              className={`text-xl sm:text-2xl font-medium relative group py-2 w-full text-center transition-all duration-300 ease-out ${
                activePage === "home" ? "text-[#ff0099]" : "text-muted-foreground hover:text-[#ff0099]"
              }`}
              onClick={() => setOpen(false)}
            >
              HOME
              <span className={`absolute bottom-0 left-1/2 transform -translate-x-1/2 h-0.5 transition-all duration-300 ease-out ${
                activePage === "home" ? "w-full" : "w-0 group-hover:w-full"
              }`} style={{ backgroundColor: activePage === "home" ? "#ff0099" : "#ff0099" }}></span>
            </Link>
            <Link
              href="/about"
              className={`text-xl sm:text-2xl font-medium relative group py-2 w-full text-center transition-all duration-300 ease-out ${
                activePage === "about" ? "text-[#ff0099]" : "text-muted-foreground hover:text-[#ff0099]"
              }`}
              onClick={() => setOpen(false)}
            >
              ABOUT
              <span className={`absolute bottom-0 left-1/2 transform -translate-x-1/2 h-0.5 transition-all duration-300 ease-out ${
                activePage === "about" ? "w-full" : "w-0 group-hover:w-full"
              }`} style={{ backgroundColor: activePage === "about" ? "#ff0099" : "#ff0099" }}></span>
            </Link>
            <Link
              href="/nfts"
              className={`text-xl sm:text-2xl font-medium relative group py-2 w-full text-center transition-all duration-300 ease-out ${
                activePage === "nfts" ? "text-[#ff0099]" : "text-muted-foreground hover:text-[#ff0099]"
              }`}
              onClick={() => setOpen(false)}
            >
              NFTS
              <span className={`absolute bottom-0 left-1/2 transform -translate-x-1/2 h-0.5 transition-all duration-300 ease-out ${
                activePage === "nfts" ? "w-full" : "w-0 group-hover:w-full"
              }`} style={{ backgroundColor: activePage === "nfts" ? "#ff0099" : "#ff0099" }}></span>
            </Link>
            <Link
              href="/provenance"
              className={`text-xl sm:text-2xl font-medium relative group py-2 w-full text-center transition-all duration-300 ease-out ${
                activePage === "provenance" ? "text-[#ff0099]" : "text-muted-foreground hover:text-[#ff0099]"
              }`}
              onClick={() => setOpen(false)}
            >
              PROVENANCE
              <span className={`absolute bottom-0 left-1/2 transform -translate-x-1/2 h-0.5 transition-all duration-300 ease-out ${
                activePage === "provenance" ? "w-full" : "w-0 group-hover:w-full"
              }`} style={{ backgroundColor: activePage === "provenance" ? "#ff0099" : "#ff0099" }}></span>
            </Link>
            <Link
              href="/contact"
              className={`text-xl sm:text-2xl font-medium relative group py-2 w-full text-center transition-all duration-300 ease-out ${
                activePage === "contact" ? "text-[#ff0099]" : "text-muted-foreground hover:text-[#ff0099]"
              }`}
              onClick={() => setOpen(false)}
            >
              CONTACT
              <span className={`absolute bottom-0 left-1/2 transform -translate-x-1/2 h-0.5 transition-all duration-300 ease-out ${
                activePage === "contact" ? "w-full" : "w-0 group-hover:w-full"
              }`} style={{ backgroundColor: activePage === "contact" ? "#ff0099" : "#ff0099" }}></span>
            </Link>
            {walletConnected && (
              <Link
                href="/my-nfts"
                className={`text-xl sm:text-2xl font-medium relative group py-2 w-full text-center transition-all duration-300 ease-out ${
                  activePage === "my-nfts" ? "text-[#ff0099]" : "text-muted-foreground hover:text-[#ff0099]"
                }`}
                onClick={() => setOpen(false)}
              >
                MY NFTS
                <span className={`absolute bottom-0 left-1/2 transform -translate-x-1/2 h-0.5 transition-all duration-300 ease-out ${
                  activePage === "my-nfts" ? "w-full" : "w-0 group-hover:w-full"
                }`} style={{ backgroundColor: activePage === "my-nfts" ? "#ff0099" : "#ff0099" }}></span>
              </Link>
            )}
          </nav>
        </div>
      </SheetContent>
    </Sheet>
  )
}
