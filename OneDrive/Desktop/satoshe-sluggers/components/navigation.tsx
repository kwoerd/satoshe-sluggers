// components/navigation.tsx
"use client"

import Link from "next/link"
import Image from "next/image"
import { MobileMenu } from "@/components/mobile-menu"
import { ConnectButton } from "thirdweb/react"
import { useActiveAccount } from "thirdweb/react"
import { client } from "@/lib/thirdweb"

interface NavigationProps {
  activePage?: "home" | "about" | "nfts" | "provenance" | "contact"
}

export default function Navigation({ activePage = "home" }: NavigationProps) {
  const account = useActiveAccount()

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
      <nav className="hidden lg:flex items-center gap-6 lg:gap-7 xl:gap-8 2xl:gap-10 absolute left-1/2 transform -translate-x-1/2 whitespace-nowrap">
        <Link
          href="/"
          className={`text-base font-medium relative group ${
            activePage === "home" ? "text-[#ff0099]" : "text-neutral-400 hover:text-[#FFFBEB]"
          }`}
          aria-label="Navigate to home page"
        >
          HOME
          <span className={`absolute bottom-0 left-0 h-0.5 transition-all duration-300 ease-out ${
            activePage === "home" ? "w-full bg-[#ff0099]" : "w-0 group-hover:w-full bg-neutral-100"
          }`}></span>
        </Link>
        <Link
          href="/about"
          className={`text-base font-medium relative group ${
            activePage === "about" ? "text-[#ff0099]" : "text-neutral-400 hover:text-[#FFFBEB]"
          }`}
          aria-label="Navigate to about page"
        >
          ABOUT
          <span className={`absolute bottom-0 left-0 h-0.5 transition-all duration-300 ease-out ${
            activePage === "about" ? "w-full bg-[#ff0099]" : "w-0 group-hover:w-full bg-neutral-100"
          }`}></span>
        </Link>
        <Link
          href="/nfts"
          className={`text-base font-medium relative group ${
            activePage === "nfts" ? "text-[#ff0099]" : "text-neutral-400 hover:text-[#FFFBEB]"
          }`}
          aria-label="Navigate to NFTs collection page"
        >
          NFTS
          <span className={`absolute bottom-0 left-0 h-0.5 transition-all duration-300 ease-out ${
            activePage === "nfts" ? "w-full bg-[#ff0099]" : "w-0 group-hover:w-full bg-neutral-100"
          }`}></span>
        </Link>
        <Link
          href="/provenance"
          className={`text-base font-medium relative group ${
            activePage === "provenance" ? "text-[#ff0099]" : "text-neutral-400 hover:text-[#FFFBEB]"
          }`}
          aria-label="Navigate to provenance page"
        >
          PROVENANCE
          <span className={`absolute bottom-0 left-0 h-0.5 transition-all duration-300 ease-out ${
            activePage === "provenance" ? "w-full bg-[#ff0099]" : "w-0 group-hover:w-full bg-neutral-100"
          }`}></span>
        </Link>
        <Link
          href="/contact"
          className={`text-base font-medium relative group ${
            activePage === "contact" ? "text-[#ff0099]" : "text-neutral-400 hover:text-[#FFFBEB]"
          }`}
          aria-label="Navigate to contact page"
        >
          CONTACT
          <span className={`absolute bottom-0 left-0 h-0.5 transition-all duration-300 ease-out ${
            activePage === "contact" ? "w-full bg-[#ff0099]" : "w-0 group-hover:w-full bg-neutral-100"
          }`}></span>
        </Link>
      </nav>
      <div className="flex items-center gap-6">
        {account && (
          <Link
            href="/my-nfts"
            className="hidden lg:flex items-center justify-center group"
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
                <div className="hidden lg:block">
                  <ConnectButton client={client} />
                </div>
        <MobileMenu isWalletConnected={!!account} />
      </div>
    </header>
  )
}

