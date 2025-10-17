import Link from "next/link"
import Image from "next/image"
import { Heart } from "lucide-react"
import { Separator } from "@/components/ui/separator"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

const legalLinks = [
  { label: "TERMS", href: "https://retinaldelights.io/terms" },
  { label: "PRIVACY", href: "https://retinaldelights.io/privacy" },
  { label: "COOKIES", href: "https://retinaldelights.io/cookies" },
  { label: "LICENSE AGREEMENT", href: "https://retinaldelights.io/nft-license-agreement" },
  { label: "NFT LISTING", href: "https://retinaldelights.io/nft-listing-policy" },
  { label: "ACCEPTABLE USE", href: "https://retinaldelights.io/acceptable-use-policy" },
  { label: "DISCLAIMER", href: "https://retinaldelights.io/disclaimer" },
]

// components/footer.tsx
export default function Footer() {
  const handleCookieSettings = () => {
    // Open Termly consent preferences
    const termlyLink = document.querySelector('.termly-display-preferences') as HTMLAnchorElement;
    if (termlyLink) {
      termlyLink.click();
    } else {
      // Fallback: try to trigger Termly programmatically
      const termlyButton = document.querySelector('[data-termly="preferences"]') as HTMLElement;
      if (termlyButton) {
        termlyButton.click();
      }
    }
  }

  return (
    <footer className="border-t border-neutral-700 bg-background relative">
      <div className="container mx-auto py-4 px-4 text-center">
        <div className="flex flex-col items-center justify-center">
          <div className="flex items-center justify-center mt-6 mb-8">
            <a href="https://retinaldelights.io" target="_blank" rel="noopener noreferrer">
              <Image
                src="/brands/retinal-delights/retinal-delights-nav-brand-white.svg"
                alt="Retinal Delights"
                width={260}
                height={60}
                className="h-10 sm:h-12 md:h-14 w-auto"
              />
            </a>
          </div>

          <div className="flex flex-wrap justify-center gap-x-3 gap-y-1 text-[9px] sm:text-[10px] md:text-[11px] text-neutral-400 max-w-3xl mb-2">
            {legalLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-[#FFFBEB] transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </div>

        </div>

        <Separator className="my-2 max-w-3xl mx-auto opacity-20 border-[#ff0099]" />

        <div className="flex flex-col items-center text-[10px] sm:text-xs text-neutral-400">
          <div className="mb-1">
            Created with <Heart className="inline-block h-3 w-3 mx-1 text-[#ff0099] fill-[#ff0099]" /> in Los Angeles by{" "}
            <a
              href="https://kristenwoerdeman.com"
              className="text-[#ff0099] hover:text-[#ff0099]/80 transition-colors font-medium"
              target="_blank"
              rel="noopener noreferrer"
            >
              Kristen
            </a>.
          </div>

          <div>
            2025 ©{" "}
            <a
              href="https://retinaldelights.io"
              className="text-[#ff0099] hover:text-[#ff0099]/80 transition-colors font-medium"
              target="_blank"
              rel="noopener noreferrer"
            >
              Retinal Delights, Inc.
            </a>{" "}
            All Rights Reserved.
          </div>
        </div>
      </div>

      {/* Hidden Termly Preference Center Link */}
      <a href="#" className="termly-display-preferences" style={{ display: 'none' }}>
        Consent Preferences
      </a>

      {/* Cookie Settings Button - Bottom Left Corner */}
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              onClick={handleCookieSettings}
              className="absolute bottom-4 left-4 w-10 h-10 flex items-center justify-center hover:bg-neutral-700/50 rounded-full transition-all duration-300"
              aria-label="Cookie settings"
            >
              <Image
                src="/icons/cookies/cookies-icon-48px.png"
                alt="Cookie settings"
                width={40}
                height={40}
                className="w-10 h-10"
              />
            </button>
          </TooltipTrigger>
          <TooltipContent side="top" className="bg-neutral-800 text-[#FFFBEB] border-neutral-600">
            <p>Cookie Settings</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

    </footer>
  )
}

