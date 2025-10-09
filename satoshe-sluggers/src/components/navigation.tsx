"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import MobileMenu from "@/components/mobile-menu"
import ConnectWalletButton from "@/components/connect-wallet-button"
import { useActiveAccount } from "thirdweb/react"

interface NavigationProps {
  activePage?: "home" | "about" | "nfts" | "provenance" | "my-nfts" | "contact"
}

export default function Navigation({ activePage = "home" }: NavigationProps) {
  const account = useActiveAccount()

  return (
    <header className="border-b border-neutral-700 px-4 sm:px-6 lg:px-8 py-3 sm:py-4 flex items-center justify-between bg-background fixed top-0 left-0 right-0 z-50">
      <div className="flex items-center">
        <Link href="/" className="flex items-center">
          <Image
            src="/retinal_delights-horizontal-brand-offwhite.svg"
            alt="Retinal Delights"
            width={200}
            height={50}
            className="w-auto h-10 sm:h-12 md:h-14 max-h-14"
            priority
            sizes="(max-width: 640px) 200px, (max-width: 768px) 240px, 280px"
          />
        </Link>
      </div>
      <nav className="hidden lg:flex items-center gap-4 lg:gap-5 xl:gap-6 absolute left-1/2 transform -translate-x-1/2 max-w-4xl">
        <Link
          href="/"
          className={`text-sm font-medium relative group ${
            activePage === "home" ? "text-[#ff0099]" : "text-neutral-400 hover:text-[#fffbeb]"
          }`}
        >
          HOME
          <span className={`absolute bottom-0 left-0 h-0.5 transition-all duration-300 ease-out ${
            activePage === "home" ? "w-full" : "w-0 group-hover:w-full"
          }`} style={{ backgroundColor: activePage === "home" ? "#ff0099" : "#fffbeb" }}></span>
        </Link>
        <Link
          href="/about"
          className={`text-sm font-medium relative group ${
            activePage === "about" ? "text-[#ff0099]" : "text-neutral-400 hover:text-[#fffbeb]"
          }`}
        >
          ABOUT
          <span className={`absolute bottom-0 left-0 h-0.5 transition-all duration-300 ease-out ${
            activePage === "about" ? "w-full" : "w-0 group-hover:w-full"
          }`} style={{ backgroundColor: activePage === "about" ? "#ff0099" : "#fffbeb" }}></span>
        </Link>
        <Link
          href="/nfts"
          className={`text-sm font-medium relative group ${
            activePage === "nfts" ? "text-[#ff0099]" : "text-neutral-400 hover:text-[#fffbeb]"
          }`}
        >
          NFTS
          <span className={`absolute bottom-0 left-0 h-0.5 transition-all duration-300 ease-out ${
            activePage === "nfts" ? "w-full" : "w-0 group-hover:w-full"
          }`} style={{ backgroundColor: activePage === "nfts" ? "#ff0099" : "#fffbeb" }}></span>
        </Link>
        <Link
          href="/provenance"
          className={`text-sm font-medium relative group ${
            activePage === "provenance" ? "text-[#ff0099]" : "text-neutral-400 hover:text-[#fffbeb]"
          }`}
        >
          PROVENANCE
          <span className={`absolute bottom-0 left-0 h-0.5 transition-all duration-300 ease-out ${
            activePage === "provenance" ? "w-full" : "w-0 group-hover:w-full"
          }`} style={{ backgroundColor: activePage === "provenance" ? "#ff0099" : "#fffbeb" }}></span>
        </Link>
        <Link
          href="/contact"
          className={`text-sm font-medium relative group ${
            activePage === "contact" ? "text-[#ff0099]" : "text-neutral-400 hover:text-[#fffbeb]"
          }`}
        >
          CONTACT
          <span className={`absolute bottom-0 left-0 h-0.5 transition-all duration-300 ease-out ${
            activePage === "contact" ? "w-full" : "w-0 group-hover:w-full"
          }`} style={{ backgroundColor: activePage === "contact" ? "#ff0099" : "#fffbeb" }}></span>
        </Link>
        {account && (
          <Link
            href="/my-nfts"
            className={`text-sm font-medium relative group ${
              activePage === "my-nfts" ? "text-[#ff0099]" : "text-neutral-400 hover:text-[#fffbeb]"
            }`}
          >
            MY NFTS
            <span className={`absolute bottom-0 left-0 h-0.5 transition-all duration-300 ease-out ${
              activePage === "my-nfts" ? "w-full" : "w-0 group-hover:w-full"
            }`} style={{ backgroundColor: activePage === "my-nfts" ? "#ff0099" : "#fffbeb" }}></span>
          </Link>
        )}
      </nav>
      <div className="flex items-center gap-3">
        <div className="hidden lg:block">
          <ConnectWalletButton />
        </div>
        <MobileMenu isWalletConnected={!!account} activePage={activePage} />
      </div>
    </header>
  )
}
