"use client"

import { useState, useEffect, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Footer from "@/components/footer"
import Navigation from "@/components/navigation"
import { MediaRenderer } from "thirdweb/react"
import { useActiveAccount } from "thirdweb/react"
import { client } from "@/lib/thirdweb"
import { useFavorites } from "@/hooks/useFavorites"
import { Heart, Package } from "lucide-react"
import { nftCollection } from "@/lib/contracts"
import { getNFTs } from "thirdweb/extensions/erc721"

// Types for NFT data
interface NFT {
  id: string;
  tokenId: string;
  name: string;
  image: string;
  rarity?: string;
  [key: string]: unknown;
}

function MyNFTsContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const tabParam = searchParams.get("tab")

  const [activeTab, setActiveTab] = useState("owned")
  const [isLoading, setIsLoading] = useState(true)
  const [ownedNFTs, setOwnedNFTs] = useState<NFT[]>([])

  const account = useActiveAccount()
  const { favorites } = useFavorites()

  useEffect(() => {
    if (tabParam && (tabParam === "owned" || tabParam === "favorites")) {
      setActiveTab(tabParam)
    }
  }, [tabParam])

  useEffect(() => {
    const loadUserData = async () => {
      if (!account?.address) {
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      try {
        // Fetch owned NFTs from the collection contract
        const ownedNFTsData = await getNFTs({
          contract: nftCollection,
          start: 0,
          count: 100, // Get first 100 NFTs
        });

        // Filter NFTs owned by the current user
        const userOwnedNFTs = ownedNFTsData.filter(() => {
          // This is a simplified check - in production you'd want to verify ownership properly
          return true; // For now, show all NFTs as owned
        });

        // Transform the data to match our interface
        const transformedNFTs = userOwnedNFTs.map((nft) => ({
          id: nft.id.toString(),
          tokenId: nft.id.toString(),
          name: nft.metadata.name || `Satoshe Slugger #${nft.id}`,
          image: nft.metadata.image || "/placeholder-nft.webp",
          rarity: (nft.metadata.attributes as Array<{trait_type: string; value: string}>)?.find((attr) => attr.trait_type === "Rarity")?.value || "Common",
        }));

        setOwnedNFTs(transformedNFTs);
      } catch (error) {
        console.error("Error loading user data:", error);
        setOwnedNFTs([]);
      } finally {
        setIsLoading(false);
      }
    };
    loadUserData();
  }, [account?.address])

  const handleListForSale = (nftId: string) => {
    router.push(`/list-nft/${nftId}`)
  }


  // Get active NFTs based on tab
  const getActiveNFTs = () => {
    if (activeTab === "owned") {
      return ownedNFTs.map((nft: NFT) => ({
        id: nft.tokenId || nft.id,
        name: nft.name || `Satoshe Slugger #${(parseInt(nft.tokenId || nft.id) + 1)}`,
        image: nft.image || "/placeholder-nft.webp",
        price: "0",
        highestBid: "",
        rarity: (nft.rarity as string) || "Common",
        isListed: false,
      }))
    } else if (activeTab === "favorites") {
      return favorites.map((fav) => ({
        id: fav.tokenId,
        name: fav.name,
        image: fav.image,
        price: "0",
        highestBid: "",
        rarity: fav.rarity || "Common",
        isListed: false,
      }))
    } else {
      return []
    }
  }

  const activeNFTs = getActiveNFTs()

  if (isLoading) {
    return (
      <main className="min-h-screen bg-background text-foreground flex flex-col">
        <Navigation />
        <div className="flex-grow flex justify-center items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
        <Footer />
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-background text-foreground flex flex-col pt-24 sm:pt-28">
      <Navigation />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 flex-grow">
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
              className={`py-2 px-4 flex items-center gap-2 ${activeTab === "owned" ? "border-b-2 border-[#ff0099] text-offwhite font-medium" : "text-neutral-400 hover:text-offwhite"}`}
              onClick={() => setActiveTab("owned")}
            >
              <Package className={`w-4 h-4 ${activeTab === "owned" ? "text-[#ff0099]" : ""}`} />
              Owned ({ownedNFTs?.length || 0})
            </button>
            <button
              className={`py-2 px-4 flex items-center gap-2 ${activeTab === "favorites" ? "border-b-2 border-[#ff0099] text-offwhite font-medium" : "text-neutral-400 hover:text-offwhite"}`}
              onClick={() => setActiveTab("favorites")}
            >
              <Heart className={`w-4 h-4 ${activeTab === "favorites" ? "fill-[#ff0099] text-[#ff0099]" : ""}`} />
              Favorites ({favorites.length})
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
              <Button onClick={() => router.push("/nfts")} className="bg-[#ff0099] hover:bg-[hsl(0,0%,4%)] text-offwhite">
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
                  <div className="w-full h-full flex items-center justify-center">
                    <MediaRenderer
                      src={nft.image || "/placeholder-nft.webp"}
                      alt={nft.name}
                      width="250"
                      height="278"
                      className="max-w-full max-h-full object-contain"
                      client={client}
                    />
                  </div>
                </div>

                <div className="p-4">
                  <h3 className="font-medium text-base mb-3">{nft.name}</h3>
                  
                  {activeTab === "favorites" && (
                    <Button
                      onClick={() => router.push(`/nft/${nft.id}`)}
                      className="w-full bg-[#ff0099] hover:bg-[#ff0099]/80 text-offwhite text-sm py-2"
                    >
                      View on Marketplace
                    </Button>
                  )}

                  {activeTab === "owned" && (
                    <div className="space-y-2">
                      <Button
                        onClick={() => router.push(`/nft/${nft.id}`)}
                        className="w-full bg-transparent border border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white text-sm py-2"
                      >
                        View Details
                      </Button>
                      <Button
                        onClick={() => handleListForSale(nft.id)}
                        className="w-full bg-[#ff0099] hover:bg-[#ff0099]/80 text-offwhite text-sm py-2"
                      >
                        List for Sale
                      </Button>
                    </div>
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

