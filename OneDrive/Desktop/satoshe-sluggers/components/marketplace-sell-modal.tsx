// components/marketplace-sell-modal.tsx
"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ExternalLink, X } from "lucide-react"
import { track } from '@vercel/analytics'

interface MarketplaceSellModalProps {
  isOpen: boolean
  onClose: () => void
  nft: {
    id: string
    name: string
    tokenId: string
  }
}

const MARKETPLACES = [
  {
    name: "OpenSea",
    description: "The world's largest NFT marketplace",
    url: (tokenId: string) => `https://opensea.io/assets/base/${process.env.NEXT_PUBLIC_NFT_CONTRACT_ADDRESS}/${tokenId}/sell`,
    icon: "🌊",
    color: "bg-blue-500 hover:bg-blue-600",
    borderColor: "border-blue-500"
  },
  {
    name: "Rarible",
    description: "Community-driven NFT marketplace",
    url: (tokenId: string) => `https://rarible.com/token/base/${process.env.NEXT_PUBLIC_NFT_CONTRACT_ADDRESS}:${tokenId}`,
    icon: "🎨",
    color: "bg-purple-500 hover:bg-purple-600",
    borderColor: "border-purple-500"
  },
  {
    name: "Coinbase NFT",
    description: "Coinbase's official NFT marketplace",
    url: (tokenId: string) => `https://nft.coinbase.com/collection/base/${process.env.NEXT_PUBLIC_NFT_CONTRACT_ADDRESS}/${tokenId}`,
    icon: "🔷",
    color: "bg-blue-600 hover:bg-blue-700",
    borderColor: "border-blue-600"
  }
]

export default function MarketplaceSellModal({ isOpen, onClose, nft }: MarketplaceSellModalProps) {
  const [isClosing, setIsClosing] = useState(false)

  const handleClose = () => {
    setIsClosing(true)
    setTimeout(() => {
      setIsClosing(false)
      onClose()
    }, 200)
  }

  const handleMarketplaceClick = (marketplace: typeof MARKETPLACES[0]) => {
    track('Marketplace Sell Clicked', { 
      marketplace: marketplace.name, 
      tokenId: nft.tokenId 
    })
    
    // Open marketplace in new tab
    window.open(marketplace.url(nft.tokenId), '_blank', 'noopener,noreferrer')
    
    // Close modal after a short delay
    setTimeout(() => {
      handleClose()
    }, 500)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div 
        className={`bg-neutral-800 border border-neutral-700 rounded-lg max-w-md w-full transform transition-all duration-200 ${
          isClosing ? 'scale-95 opacity-0' : 'scale-100 opacity-100'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-neutral-700">
          <div>
            <h2 className="text-xl font-semibold text-[#FFFBEB]">Sell Your NFT</h2>
            <p className="text-sm text-neutral-400 mt-1">
              Choose a marketplace to list {nft.name}
            </p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClose}
            className="h-8 w-8 p-0 hover:bg-neutral-700"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="mb-4">
            <p className="text-sm text-neutral-300 mb-2">
              All recommended marketplaces honor creator royalties built into the smart contract.
            </p>
            <p className="text-xs text-neutral-500">
              You&apos;ll be redirected to the marketplace to complete your listing.
            </p>
          </div>

          {/* Marketplace Options */}
          <div className="space-y-3">
            {MARKETPLACES.map((marketplace) => (
              <button
                key={marketplace.name}
                onClick={() => handleMarketplaceClick(marketplace)}
                className={`w-full p-4 rounded-lg border-2 ${marketplace.borderColor} bg-neutral-700/50 hover:bg-neutral-700 transition-all duration-200 group`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{marketplace.icon}</span>
                    <div className="text-left">
                      <h3 className="font-medium text-[#FFFBEB] group-hover:text-white">
                        {marketplace.name}
                      </h3>
                      <p className="text-xs text-neutral-400">
                        {marketplace.description}
                      </p>
                    </div>
                  </div>
                  <ExternalLink className="w-4 h-4 text-neutral-400 group-hover:text-white transition-colors" />
                </div>
              </button>
            ))}
          </div>

          {/* Footer */}
          <div className="mt-6 pt-4 border-t border-neutral-700">
            <p className="text-xs text-neutral-500 text-center">
              Royalties are automatically enforced by the smart contract
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
