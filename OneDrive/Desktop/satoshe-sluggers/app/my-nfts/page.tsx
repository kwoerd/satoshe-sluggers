"use client"

import { useState, useEffect } from "react"
import Navigation from "@/components/navigation"
import Footer from "@/components/footer"
import NFTCard from "@/components/nft-card"
import { useActiveAccount } from "thirdweb/react"
import { Button } from "@/components/ui/button"
import { Heart, ExternalLink } from "lucide-react"

export default function MyNFTsPage() {
  const account = useActiveAccount()
  const [userNFTs, setUserNFTs] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [isProcessingBuy, setIsProcessingBuy] = useState<Record<string, boolean>>({})
  const [activeTab, setActiveTab] = useState<"owned" | "favorites">("owned")

  useEffect(() => {
    if (account) {
      // In production, this would fetch the user's NFTs from the contract
      // For now, we'll show a placeholder
      setIsLoading(false)
    }
  }, [account])

  const handleBuy = async (tokenId: string) => {
    setIsProcessingBuy(prev => ({ ...prev, [tokenId]: true }))
    
    // Simulate processing time
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    setIsProcessingBuy(prev => ({ ...prev, [tokenId]: false }))
  }

  if (!account) {
    return (
      <main className="min-h-screen bg-background text-foreground flex flex-col pt-24 sm:pt-28">
        <Navigation activePage="my-nfts" />
        <div className="flex-grow container mx-auto px-4 py-12 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-brand-pink mb-6">
              MY NFTS
            </h1>
            <p className="text-xl text-neutral-400 mb-8">
              Please connect your wallet to view your Satoshe Sluggers collection.
            </p>
          </div>
        </div>
        <Footer />
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-background text-foreground flex flex-col">
      <Navigation activePage="my-nfts" />

      <div className="flex-1 pt-24 sm:pt-28">
        <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16">
        {/* Header Section */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-6xl font-bold text-brand-pink mb-4">
            MY NFTS
          </h1>
          <p className="text-xl text-neutral-400 max-w-2xl mx-auto">
            Your personal collection of Satoshe Sluggers NFTs.
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex justify-center mb-8">
          <div className="bg-neutral-800 rounded-lg p-1 flex">
            <button
              onClick={() => setActiveTab("owned")}
              className={`px-6 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === "owned"
                  ? "bg-brand-pink text-white"
                  : "text-neutral-400 hover:text-off-white"
              }`}
            >
              Owned
            </button>
            <button
              onClick={() => setActiveTab("favorites")}
              className={`px-6 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === "favorites"
                  ? "bg-brand-pink text-white"
                  : "text-neutral-400 hover:text-off-white"
              }`}
            >
              Favorites
            </button>
          </div>
        </div>

        {/* Content Area */}
        {isLoading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-pink mx-auto mb-4"></div>
            <p className="text-neutral-400">Loading your NFTs...</p>
          </div>
        ) : activeTab === "owned" ? (
          userNFTs.length === 0 ? (
            <div className="text-center py-12">
              <div className="mb-6">
                <div className="w-24 h-24 mx-auto mb-4 bg-neutral-800 rounded-full flex items-center justify-center">
                  <Heart className="w-8 h-8 text-neutral-500" />
                </div>
                <h2 className="text-2xl font-bold text-off-white mb-4">No NFTs Found</h2>
                <p className="text-neutral-500 mb-8 max-w-md mx-auto">
                  You don&apos;t own any Satoshe Sluggers yet. Visit the marketplace to buy your first one!
                </p>
              </div>
              <Button
                onClick={() => window.location.href = "/nfts"}
                className="bg-brand-pink hover:bg-brand-pink-hover text-white font-bold px-8 py-3"
              >
                Browse Marketplace
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {userNFTs.map((nft: any) => (
                <NFTCard
                  key={nft.tokenId}
                  image={nft.image}
                  name={nft.name}
                  rank={nft.rank}
                  rarity={nft.rarity}
                  rarityPercent={nft.rarityPercent}
                  price={nft.price}
                  tokenId={nft.tokenId}
                  listingId={nft.listingId}
                  isForSale={nft.isForSale}
                  isProcessingBuy={isProcessingBuy[nft.tokenId] || false}
                  onBuy={() => handleBuy(nft.tokenId)}
                />
              ))}
            </div>
          )
        ) : (
          // Favorites tab content
          <div className="text-center py-12">
            <div className="mb-6">
              <div className="w-24 h-24 mx-auto mb-4 bg-neutral-800 rounded-full flex items-center justify-center">
                <Heart className="w-8 h-8 text-brand-pink" />
              </div>
              <h2 className="text-2xl font-bold text-off-white mb-4">No Favorites Yet</h2>
              <p className="text-neutral-500 mb-8 max-w-md mx-auto">
                Start favoriting NFTs you love to see them here!
              </p>
            </div>
            <Button
              onClick={() => window.location.href = "/nfts"}
              className="bg-brand-pink hover:bg-brand-pink-hover text-white font-bold px-8 py-3"
            >
              Browse Collection
            </Button>
          </div>
        )}
        </div>
      </div>

      <Footer />
    </main>
  )
}
