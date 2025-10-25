// components/navigation.tsx
"use client"

import Link from "next/link"
import Image from "next/image"
import { MobileMenu } from "@/components/mobile-menu"
import SimpleConnectButton from "@/components/simple-connect-button"
import { NavLink } from "@/components/nav-link"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { useActiveAccount } from "thirdweb/react"
import { useFavorites } from "@/hooks/useFavorites"

interface NavigationProps {
  activePage?: "home" | "about" | "nfts" | "provenance" | "contact" | "my-nfts"
}

export default function Navigation({ activePage = "home" }: NavigationProps) {
  const account = useActiveAccount()
  const { favorites } = useFavorites()
  
  // Check if user has any activity (favorites or owned NFTs)
  const hasUserActivity = favorites.length > 0
  const isWalletConnected = !!account?.address

  return (
    <header id="navigation" className="border-b border-neutral-700 px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16 py-3 sm:py-4 flex items-center justify-between bg-neutral-950/80 backdrop-blur-md fixed top-0 left-0 right-0 z-50">
      <div className="flex items-center">
        <a href="https://retinaldelights.io" target="_blank" rel="noopener noreferrer" className="flex items-center">
          <Image
            src="/brands/retinal-delights/retinal-delights-nav-brand-white.svg"
            alt="Retinal Delights"
            width={200}
            height={50}
            className="w-auto h-10 sm:h-12"
          />
        </a>
      </div>
      <nav className="hidden lg:flex items-center gap-4 lg:gap-5 xl:gap-6 2xl:gap-8 absolute left-1/2 transform -translate-x-1/2 whitespace-nowrap">
        <NavLink href="/" isActive={activePage === "home"} ariaLabel="Navigate to home page">
          HOME
        </NavLink>
        <NavLink href="/about" isActive={activePage === "about"} ariaLabel="Navigate to about page">
          ABOUT
        </NavLink>
        <NavLink href="/nfts" isActive={activePage === "nfts"} ariaLabel="Navigate to NFTs collection page">
          NFTS
        </NavLink>
        <NavLink href="/provenance" isActive={activePage === "provenance"} ariaLabel="Navigate to provenance page">
          PROVENANCE
        </NavLink>
        <NavLink href="/contact" isActive={activePage === "contact"} ariaLabel="Navigate to contact page">
          CONTACT
        </NavLink>
        {isWalletConnected && hasUserActivity && (
          <NavLink href="/my-nfts" isActive={activePage === "my-nfts"} ariaLabel="Navigate to My NFTs page">
            MY NFTS
          </NavLink>
        )}
      </nav>
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Profile icon - clickable when wallet connected and has activity */}
        {isWalletConnected && hasUserActivity && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Link
                  href="/my-nfts"
                  className="hidden lg:flex items-center justify-center group hover:scale-110 transition-transform duration-200"
                  aria-label="Go to My NFTs page"
                >
                  <Image
                    src="/icons/profile-icons/pink-profile-icon-48.png"
                    alt="My NFTs"
                    width={24}
                    height={24}
                    className="w-6 h-6"
                  />
                </Link>
              </TooltipTrigger>
              <TooltipContent>
                <p>My NFTs</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
        {/* Static profile icon when wallet connected but no activity */}
        {isWalletConnected && !hasUserActivity && (
          <div className="hidden lg:flex items-center justify-center">
            <Image
              src="/icons/profile-icons/pink-profile-icon-48.png"
              alt="Wallet Connected"
              width={24}
              height={24}
              className="w-6 h-6"
            />
          </div>
        )}
                <div className="hidden lg:block">
                  <SimpleConnectButton />
                </div>
        <MobileMenu isWalletConnected={isWalletConnected} hasUserActivity={hasUserActivity} />
      </div>
    </header>
  )
}

