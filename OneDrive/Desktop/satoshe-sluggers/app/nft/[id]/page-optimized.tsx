"use client";

import { useState, useEffect, useMemo } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BuyDirectListingButton } from "thirdweb/react";
import { marketplace } from "@/lib/contracts";
import { getNFTByTokenId } from "@/lib/data-service";
import { useFavorites } from "@/hooks/useFavorites";
import { track } from '@vercel/analytics';
import { triggerPurchaseConfetti } from "@/lib/confetti";
import { ArrowLeft, ArrowRight, Heart } from "lucide-react";

// Color mapping for attributes
const COLORS = {
  red: { 500: "text-red-500", 400: "text-red-400" },
  blue: { 500: "text-blue-500", 400: "text-blue-400" },
  green: { 500: "text-green-500", 400: "text-green-400" },
  purple: { 500: "text-purple-500", 400: "text-purple-400" },
  yellow: { 500: "text-yellow-500", 400: "text-yellow-400" },
  orange: { 500: "text-orange-500", 400: "text-orange-400" },
  pink: { 500: "text-pink-500", 400: "text-pink-400" },
  cyan: { 500: "text-cyan-500", 400: "text-cyan-400" },
  neutral: { 500: "text-neutral-500", 400: "text-neutral-400" },
};

function getColorForAttribute(attributeName: string) {
  const colorMap: Record<string, keyof typeof COLORS> = {
    "Background": "blue",
    "Skin Tone": "yellow", 
    "Shirt": "red",
    "Hair": "purple",
    "Eyewear": "cyan",
    "Headwear": "orange",
  };
  
  return COLORS[colorMap[attributeName] || "neutral"][400];
}

export default function NFTDetailPage() {
  const params = useParams<{ id: string }>();
  const tokenId = params.id;
  const [nftData, setNftData] = useState<{
    name: string;
    description: string;
    token_id: number;
    rarity_tier: string;
    rarity_percent: number;
    rank: number;
    attributes: Array<{ trait_type: string; value: string; occurrence: number; rarity: number }>;
    merged_data: {
      media_url: string;
      price_eth: number;
      listing_id: number;
    };
    series: string;
    artist: string;
    platform: string;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const { isFavorited, toggleFavorite } = useFavorites();

  // Load NFT data using optimized service
  useEffect(() => {
    const loadNFTData = async () => {
      try {
        setIsLoading(true);
        const data = await getNFTByTokenId(tokenId);
        if (data) {
          setNftData(data);
        }
      } catch (error) {
        console.error('Error loading NFT data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadNFTData();
  }, [tokenId]);

  // Process attributes
  const attributes = useMemo(() => {
    if (!nftData?.attributes) return [];
    
    return nftData.attributes.map((attr: { trait_type: string; value: string; occurrence: number; rarity: number }, index: number) => {
      const displayPercentages = [10.84, 16.29, 14.58, 2.65, 81.75, 6.51];
      const color = getColorForAttribute(attr.trait_type);
      
      return {
        ...attr,
        color,
        displayPercentage: displayPercentages[index] || attr.rarity || 0
      };
    });
  }, [nftData]);



  // Navigation helpers
  const currentTokenId = parseInt(tokenId);
  const prevTokenId = currentTokenId > 0 ? currentTokenId - 1 : 7776;
  const nextTokenId = currentTokenId < 7776 ? currentTokenId + 1 : 0;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-neutral-950 text-white">
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-neutral-800 rounded w-1/4 mb-6"></div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="aspect-square bg-neutral-800 rounded"></div>
              <div className="space-y-4">
                <div className="h-8 bg-neutral-800 rounded w-3/4"></div>
                <div className="h-4 bg-neutral-800 rounded w-1/2"></div>
                <div className="h-32 bg-neutral-800 rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!nftData) {
    return (
      <div className="min-h-screen bg-neutral-950 text-white">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">NFT Not Found</h1>
            <p className="text-neutral-400 mb-6">The NFT you&apos;re looking for doesn&apos;t exist.</p>
            <Link href="/nfts">
              <Button>Back to Collection</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const isForSale = nftData.merged_data?.price_eth > 0;
  const listingPrice = nftData.merged_data?.price_eth?.toFixed(6) || "0";

  return (
    <div className="min-h-screen bg-neutral-950 text-white">
      <div className="container mx-auto px-4 py-8">
        {/* Navigation */}
        <div className="flex items-center gap-4 mb-8">
          <Link href="/nfts">
            <Button variant="outline" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Collection
            </Button>
          </Link>
          <div className="flex items-center gap-2">
            <Link href={`/nft/${prevTokenId}`}>
              <Button variant="outline" size="sm">
                <ArrowLeft className="w-4 h-4" />
              </Button>
            </Link>
            <Link href={`/nft/${nextTokenId}`}>
              <Button variant="outline" size="sm">
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Image */}
          <div className="relative">
            <div className="aspect-square relative bg-neutral-900 rounded-lg overflow-hidden border border-neutral-700">
              <Image
                src={nftData.merged_data?.media_url || "/placeholder-nft.webp"}
                alt={nftData.name}
                fill
                className="object-contain"
                priority
              />
            </div>
          </div>

          {/* Details */}
          <div className="space-y-6">
            {/* Title and Favorite */}
            <div className="flex items-start justify-between">
              <div>
                <h1 className="text-3xl font-bold mb-2">{nftData.name}</h1>
                <p className="text-neutral-400 text-lg">{nftData.description}</p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => toggleFavorite({
                  tokenId: nftData.token_id.toString(),
                  name: nftData.name,
                  image: nftData.merged_data?.media_url || "/placeholder-nft.webp",
                  rarity: nftData.rarity_tier,
                  rank: nftData.rank,
                  rarityPercent: nftData.rarity_percent,
                })}
                className="h-10 w-10 p-0 hover:bg-transparent"
              >
                <Heart className={`h-6 w-6 ${isFavorited(nftData.token_id.toString()) ? "fill-[#ff0099] text-[#ff0099]" : "text-neutral-400 hover:text-neutral-300"}`} />
              </Button>
            </div>

            {/* Rarity Info */}
            <div className="grid grid-cols-3 gap-4">
              <Card className="p-4 bg-neutral-800 border-neutral-700">
                <div className="text-center">
                  <p className="text-sm text-neutral-400 mb-1">Rank</p>
                  <p className="text-xl font-bold text-blue-500">{nftData.rank}</p>
                </div>
              </Card>
              <Card className="p-4 bg-neutral-800 border-neutral-700">
                <div className="text-center">
                  <p className="text-sm text-neutral-400 mb-1">Rarity</p>
                  <p className="text-xl font-bold text-purple-500">{nftData.rarity_percent}%</p>
                </div>
              </Card>
              <Card className="p-4 bg-neutral-800 border-neutral-700">
                <div className="text-center">
                  <p className="text-sm text-neutral-400 mb-1">Tier</p>
                  <p className="text-xl font-bold text-orange-500">{nftData.rarity_tier}</p>
                </div>
              </Card>
            </div>

            {/* Purchase Section */}
            {isForSale ? (
              <Card className="p-6 bg-neutral-800 border-neutral-700">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                    <span className="text-neutral-300 font-medium">Buy a Slugger</span>
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-bold text-blue-500">{listingPrice}</div>
                    <div className="text-sm text-neutral-400">ETH</div>
                  </div>
                </div>
                <BuyDirectListingButton
                  contractAddress={marketplace.address}
                  chain={marketplace.chain}
                  client={marketplace.client}
                  listingId={BigInt(nftData.merged_data.listing_id)}
                  quantity={BigInt(1)}
                  onTransactionSent={() => {
                    track('NFT Purchase Attempted', { tokenId: nftData.token_id });
                  }}
                  onTransactionConfirmed={() => {
                    track('NFT Purchase Success', { tokenId: nftData.token_id });
                    triggerPurchaseConfetti();
                    // Update UI to reflect purchase - mark as sold
                    setNftData(prev => prev ? {
                      ...prev,
                      merged_data: {
                        ...prev.merged_data,
                        price_eth: 0
                      }
                    } : null);
                  }}
                  onError={(error) => {
                    console.error('Purchase failed:', error);
                    track('NFT Purchase Failed', { tokenId: nftData.token_id });
                    alert(`Purchase failed: ${error.message}`);
                  }}
                  className="w-full h-12 bg-blue-500 text-white hover:bg-blue-600 transition-all duration-200 font-semibold text-lg rounded-sm disabled:opacity-50"
                >
                  BUY
                </BuyDirectListingButton>
              </Card>
            ) : (
              <Card className="p-6 bg-neutral-800 border-neutral-700">
                <div className="text-center">
                  <p className="text-neutral-400 mb-2">This NFT is not currently for sale</p>
                  <p className="text-sm text-neutral-500">Check back later or browse other NFTs</p>
                </div>
              </Card>
            )}

            {/* Contract Details */}
            <Card className="p-4 bg-neutral-800 border-neutral-700">
              <h3 className="font-semibold mb-3">Contract Details</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-neutral-400">Token ID:</span>
                  <span className="text-white">{nftData.token_id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-400">Series:</span>
                  <span className="text-white">{nftData.series}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-400">Artist:</span>
                  <span className="text-white">{nftData.artist}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-400">Platform:</span>
                  <span className="text-white">{nftData.platform}</span>
                </div>
              </div>
            </Card>
          </div>
        </div>

        {/* Attributes */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold mb-6">Attributes</h2>
          <div className="bg-neutral-800 p-6 rounded-lg border border-neutral-700">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {attributes.map((attr, index) => (
                <div key={index} className="bg-neutral-900 p-4 rounded border border-neutral-700">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className={`text-sm font-medium uppercase tracking-wide ${attr.color}`}>
                      {attr.trait_type}
                    </h3>
                    <Badge variant="secondary" className="text-xs">
                      {attr.displayPercentage}%
                    </Badge>
                  </div>
                  <p className="font-medium text-base text-white">{attr.value}</p>
                  <p className="text-xs text-neutral-500 mt-1">
                    {attr.occurrence} occurrences
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
