// components/nav-link.tsx
"use client"

import Link from "next/link"
import { ReactNode } from "react"

interface NavLinkProps {
  href: string
  children: ReactNode
  isActive?: boolean
  onClick?: () => void
  className?: string
  ariaLabel?: string
  variant?: "desktop" | "mobile"
}

export function NavLink({ 
  href, 
  children, 
  isActive = false, 
  onClick,
  className = "",
  ariaLabel,
  variant = "desktop"
}: NavLinkProps) {
  const baseClasses = "text-base font-medium relative group transition-all duration-300"
  
  const variantClasses = {
    desktop: "text-base",
    mobile: "text-base sm:text-lg font-medium py-2 w-full text-center"
  }
  
  const colorClasses = isActive 
    ? "text-[#ff0099]" 
    : "text-neutral-400 hover:text-[#FFFBEB]"
  
  const underlineClasses = variant === "desktop" 
    ? "absolute bottom-0 left-0 h-0.5 transition-all duration-300 ease-out"
    : "absolute bottom-1 left-1/2 -translate-x-1/2 h-0.5 transition-all duration-300 ease-out"
  
  const getUnderlineWidth = () => {
    if (variant === "desktop") {
      return isActive ? "w-full bg-[#ff0099]" : "w-0 group-hover:w-full bg-[#FFFBEB]"
    } else {
      // Mobile variant - different widths for different text lengths
      const text = children?.toString() || ""
      if (text === "HOME" || text === "ABOUT" || text === "NFTS") {
        return isActive ? "w-16 bg-[#ff0099]" : "w-0 group-hover:w-16 bg-[#FFFBEB]"
      } else if (text === "PROVENANCE") {
        return isActive ? "w-28 bg-[#ff0099]" : "w-0 group-hover:w-28 bg-[#FFFBEB]"
      } else if (text === "CONTACT" || text === "MY NFTS") {
        return isActive ? "w-20 bg-[#ff0099]" : "w-0 group-hover:w-20 bg-[#FFFBEB]"
      } else {
        return isActive ? "w-28 bg-[#ff0099]" : "w-0 group-hover:w-28 bg-[#FFFBEB]"
      }
    }
  }
  
  return (
    <Link
      href={href}
      className={`${baseClasses} ${variantClasses[variant]} ${colorClasses} ${className}`}
      onClick={onClick}
      aria-label={ariaLabel}
    >
      {children}
      <span className={`${underlineClasses} ${getUnderlineWidth()}`}></span>
    </Link>
  )
}
