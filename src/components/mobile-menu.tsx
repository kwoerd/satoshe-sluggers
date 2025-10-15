"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Menu } from "lucide-react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet"
import ConnectWalletButton from "@/components/connect-wallet-button"

interface MobileMenuProps {
  isWalletConnected?: boolean
}

export function MobileMenu({ isWalletConnected = false }: MobileMenuProps) {
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
        >
          <Menu className="h-8 w-8" style={{ color: "#fffbeb" }} />
          <span className="sr-only">Toggle menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent
        side="top"
        className="w-[90%] max-w-md mx-auto h-[85vh] max-h-[600px] border-t pt-6 pb-12 px-6 sm:px-8 transition-all duration-300 ease-in-out animate-in slide-in-from-top overflow-y-auto"
      >
        <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
        <div className="flex flex-col gap-4 py-4 items-center">
          <div className="mb-4">
            <ConnectWalletButton />
          </div>
          <nav className="flex flex-col space-y-4 items-center w-full max-w-md mx-auto">
            <Link
              href="/"
              className="text-xl sm:text-2xl font-medium text-muted-foreground hover:text-[#ff0099] py-2 w-full text-center transition-colors duration-200"
              onClick={() => setOpen(false)}
            >
              HOME
            </Link>
            <Link
              href="/about"
              className="text-xl sm:text-2xl font-medium text-muted-foreground hover:text-[#ff0099] py-2 w-full text-center transition-colors duration-200"
              onClick={() => setOpen(false)}
            >
              ABOUT
            </Link>
            <Link
              href="/nfts"
              className="text-xl sm:text-2xl font-medium text-muted-foreground hover:text-[#ff0099] py-2 w-full text-center transition-colors duration-200"
              onClick={() => setOpen(false)}
            >
              NFTS
            </Link>
            <Link
              href="/provenance"
              className="text-xl sm:text-2xl font-medium text-muted-foreground hover:text-[#ff0099] py-2 w-full text-center transition-colors duration-200"
              onClick={() => setOpen(false)}
            >
              PROVENANCE
            </Link>
            <Link
              href="/contact"
              className="text-xl sm:text-2xl font-medium text-muted-foreground hover:text-[#ff0099] py-2 w-full text-center transition-colors duration-200"
              onClick={() => setOpen(false)}
            >
              CONTACT
            </Link>
          </nav>
        </div>
      </SheetContent>
    </Sheet>
  )
}
