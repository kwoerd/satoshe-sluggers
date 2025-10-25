// app/my-nfts/page.tsx
"use client"

import { useState, useEffect, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Footer from "@/components/footer"
import Navigation from "@/components/navigation"
import Image from "next/image"
import Link from "next/link"
import { useActiveAccount } from "thirdweb/react"
import { useFavorites } from "@/hooks/useFavorites"
import { Heart, Package } from "lucide-react"

// Types for NFT data
interface NFT {
  id: string;
  tokenId: string;
  name: string;
  image: string;
  rarity?: string;
  isLocallyUnfavorited?: boolean; // Optional flag for visual state
  [key: string]: unknown;
}

function MyNFTsContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const tabParam = searchParams.get("tab")

  const [activeTab, setActiveTab] = useState("favorites")
  const [isLoading, setIsLoading] = useState(true)
  const [ownedNFTs, setOwnedNFTs] = useState<NFT[]>([])
  const [locallyUnfavorited, setLocallyUnfavorited] = useState<Set<string>>(new Set())

  const account = useActiveAccount()
  const { favorites, removeFromFavorites } = useFavorites()

  useEffect(() => {
    if (tabParam && (tabParam === "owned" || tabParam === "favorites")) {
      setActiveTab(tabParam)
    }
  }, [tabParam])

  // Clean up locally unfavorited NFTs when switching tabs or navigating away
  useEffect(() => {
    if (activeTab !== "favorites") {
      // Actually remove from favorites when switching away from favorites tab
      locallyUnfavorited.forEach(tokenId => {
        removeFromFavorites(tokenId)
      })
      setLocallyUnfavorited(new Set())
    }
  }, [activeTab, locallyUnfavorited])

  // Clean up on unmount
  useEffect(() => {
    return () => {
      // Actually remove from favorites when component unmounts
      locallyUnfavorited.forEach(tokenId => {
        removeFromFavorites(tokenId)
      })
    }
  }, [locallyUnfavorited])

  useEffect(() => {
    const loadUserData = async () => {
      if (!account?.address) {
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      try {
        // TODO: Implement actual wallet NFT fetching
        // For now, show empty array - no demo/placeholder NFTs
        setOwnedNFTs([]);
      } catch {
        setOwnedNFTs([]);
      } finally {
        setIsLoading(false);
      }
    };
    loadUserData();
  }, [account?.address])

  const handleUnfavorite = (tokenId: string) => {
    // Add to locally unfavorited set (visual feedback only)
    setLocallyUnfavorited(prev => new Set(prev).add(tokenId))
  }

  const handleRefavorite = (tokenId: string) => {
    // Remove from locally unfavorited set (re-favorite)
    setLocallyUnfavorited(prev => {
      const newSet = new Set(prev)
      newSet.delete(tokenId)
      return newSet
    })
  }



  // Get active NFTs based on tab
  const getActiveNFTs = () => {
    if (activeTab === "owned") {
      return ownedNFTs.map((nft: NFT) => ({
        id: nft.tokenId || nft.id,
        tokenId: nft.tokenId || nft.id,
        name: nft.name || `Satoshe Slugger #${(parseInt(nft.tokenId || nft.id) + 1)}`,
        image: nft.image || "/placeholder-nft.webp",
        price: "0",
        highestBid: "",
        rarity: (nft.rarity as string) || "Common",
        isListed: false,
      }))
    } else if (activeTab === "favorites") {
      return favorites.map((fav) => ({
        id: (parseInt(fav.tokenId) + 1).toString(), // Use card number for navigation
        tokenId: fav.tokenId,
        name: fav.name,
        image: fav.image,
        price: "0",
        highestBid: "",
        rarity: fav.rarity || "Common",
        isListed: false,
        isLocallyUnfavorited: locallyUnfavorited.has(fav.tokenId), // Add flag for visual state
      }))
    } else {
      return []
    }
  }

  const activeNFTs = getActiveNFTs()

  if (isLoading) {
    return (
      <main className="min-h-screen bg-background text-[#FFFBEB] flex flex-col">
        <Navigation />
        <div className="flex-grow flex justify-center items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
        <Footer />
      </main>
    )
  }

  return (
    <main id="main-content" className="min-h-screen bg-background text-[#FFFBEB] flex flex-col pt-24 sm:pt-28">
      <Navigation activePage="my-nfts" />

      <div className="max-w-7xl mx-auto px-6 sm:px-8 md:px-12 lg:px-16 xl:px-20 2xl:px-24 py-8 flex-grow">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold mb-1">My NFTs</h1>
            <p className="text-neutral-400 text-sm">Manage your Satoshe Sluggers collection</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-6">
          <div className="flex border-b border-neutral-700">
            <button
              className={`py-2 px-4 flex items-center gap-2 ${activeTab === "favorites" ? "border-b-2 border-[#ff0099] text-offwhite font-medium" : "text-neutral-400 hover:text-offwhite"}`}
              onClick={() => setActiveTab("favorites")}
            >
              <Heart className={`w-4 h-4 ${activeTab === "favorites" ? "fill-[#ff0099] text-[#ff0099]" : ""}`} />
              Favorites ({favorites.length})
            </button>
            <button
              className={`py-2 px-4 flex items-center gap-2 ${activeTab === "owned" ? "border-b-2 border-[#ff0099] text-offwhite font-medium" : "text-neutral-400 hover:text-offwhite"}`}
              onClick={() => setActiveTab("owned")}
            >
              <Package className={`w-4 h-4 ${activeTab === "owned" ? "text-[#ff0099]" : ""}`} />
              Owned ({ownedNFTs?.length || 0})
            </button>
          </div>
        </div>

        {/* NFT Grid */}
        {activeNFTs.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-neutral-400 mb-4">
              {activeTab === "favorites"
                ? "No favorite NFTs yet."
                : "No NFTs found in this category."
              }
            </p>
            {(activeTab === "owned" || activeTab === "favorites") && (
              <Button onClick={() => router.push("/nfts")} className="bg-blue-500 hover:bg-blue-600 text-offwhite px-3 py-1.5 text-xs font-medium rounded" style={{ padding: '6px 12px', fontSize: '12px', borderRadius: '2px' }}>
                Browse NFTs
              </Button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {activeNFTs.map((nft) => (
              <div key={nft.id} className="rounded-md overflow-hidden">
                <div className="relative w-full" style={{ aspectRatio: "0.9/1" }}>
                  <Badge
                    className={`absolute top-3 right-3 z-10 text-xs ${
                      nft.rarity === "uncommon"
                        ? "bg-blue-500"
                        : nft.rarity === "rare"
                          ? "bg-purple-600"
                          : "bg-neutral-500"
                    }`}
                  >
                    {nft.rarity}
                  </Badge>
                  
                  
                  <Link 
                    href={`/nft/${nft.id}`}
                    className="w-full h-full flex items-center justify-center cursor-pointer hover:opacity-90 transition-opacity"
                  >
                    <Image
                      src={nft.image || "/placeholder-nft.webp"}
                      alt={nft.name}
                      width={250}
                      height={278}
                      className="max-w-full max-h-full object-contain"
                      loading="lazy"
                    />
                  </Link>
                </div>

                <div className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-medium text-base">{nft.name}</h3>
                    {activeTab === "favorites" && (
                      <button
                        onClick={() => (nft as NFT).isLocallyUnfavorited ? handleRefavorite(nft.tokenId) : handleUnfavorite(nft.tokenId)}
                        className="w-6 h-6 flex items-center justify-center hover:bg-neutral-800 rounded transition-colors group cursor-pointer"
                        aria-label={(nft as NFT).isLocallyUnfavorited ? "Re-favorite this NFT" : "Remove from favorites"}
                      >
                        <Heart className={`w-4 h-4 group-hover:scale-110 transition-transform ${
                          (nft as NFT).isLocallyUnfavorited 
                            ? "text-neutral-400 hover:text-red-500" // Outlined when locally unfavorited
                            : "fill-[#ff0099] text-[#ff0099]" // Filled when favorited
                        }`} />
                      </button>
                    )}
                  </div>
                  

                  {activeTab === "owned" && (
                    <Button
                      onClick={() => router.push(`/nft/${nft.id}`)}
                      className="w-full bg-transparent border border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-[#FFFBEB] text-xs font-medium py-1.5 rounded-sm"
                      style={{ padding: '6px 12px', fontSize: '12px', borderRadius: '2px' }}
                    >
                      View Details
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>


      <Footer />
    </main>
  )
}

export default function MyNFTsPage() {
  return (
    <Suspense fallback={
      <main className="flex min-h-screen flex-col bg-gradient-to-b from-background to-neutral-950">
        <Navigation />
        <div className="flex-grow flex items-center justify-center">
          <div className="animate-pulse text-neutral-400">Loading...</div>
        </div>
        <Footer />
      </main>
    }>
      <MyNFTsContent />
    </Suspense>
  )
}

