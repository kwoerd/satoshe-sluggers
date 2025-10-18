// components/nft-card.tsx
"use client"

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Heart } from "lucide-react";
import { useFavorites } from "@/hooks/useFavorites";
import { track } from '@vercel/analytics';
// Removed BuyDirectListingButton imports - using regular buttons to avoid RPC calls

interface NFTCardProps {
  image: string;
  name: string;
  rank: string | number;
  rarity: string;
  rarityPercent: string | number;
  priceEth: number; // Static price from metadata
  tokenId: string;
  listingId: number | string; // Required for BuyDirectListingButton
  isForSale: boolean;
  onPurchase?: () => void;
  viewMode?: 'grid-large' | 'grid-medium' | 'grid-small' | 'compact';
}

export default function NFTCard({
  image,
  name,
  rank,
  rarity,
  rarityPercent,
  priceEth,
  tokenId,
  listingId,
  isForSale,
  onPurchase,
  viewMode = 'grid-medium',
}: NFTCardProps) {
  const [imgLoaded, setImgLoaded] = useState(false);
  const [imgError, setImgError] = useState(false);
  const [imgLoading, setImgLoading] = useState(true);
  const placeholder = "/nfts/placeholder-nft.webp";
  const showPlaceholder = !imgLoaded || imgError;

  // Favorites functionality
  const { isFavorited, toggleFavorite, isConnected } = useFavorites();
  const isFav = isFavorited(tokenId);

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isConnected) {
      alert('Please connect your wallet to favorite NFTs');
      return;
    }

    const wasFavorited = isFav;
    toggleFavorite({
      tokenId,
      name,
      image,
      rarity,
      rank,
      rarityPercent,
    });

    // Minimal analytics
    track(wasFavorited ? 'NFT Unfavorited' : 'NFT Favorited', {
      tokenId,
      rarity,
    });
  };


  // Small grid - just images, tightly packed
  if (viewMode === 'grid-small') {
    return (
      <div className="overflow-visible w-full rounded-lg flex flex-col h-full bg-neutral-900 group relative">
        <div className="absolute -bottom-1 left-0 right-0 h-1 bg-black/20 blur-sm"></div>
        
        {/* NFT Image Only */}
        <Link href={`/nft/${tokenId}`} className="block w-full">
          <div className="relative bg-neutral-900 w-full overflow-visible" style={{ aspectRatio: "0.9/1" }}>
            <Image
              src={showPlaceholder ? placeholder : image}
              alt={name}
              fill
              loading="lazy"
              className={`object-contain p-2 hover:scale-[1.02] hover:rotate-[5deg] hover:-translate-y-1 transition-all duration-300 ease-out relative z-20 ${showPlaceholder ? 'animate-pulse' : ''}`}
              onLoad={() => {
                setImgLoaded(true);
                setImgLoading(false);
              }}
              onError={() => {
                setImgError(true);
                setImgLoading(false);
              }}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
            {imgLoading && !showPlaceholder && (
              <div className="absolute inset-0 bg-neutral-900/80 flex items-center justify-center">
                <div className="animate-pulse text-neutral-400 text-sm">Loading...</div>
              </div>
            )}
          </div>
        </Link>
      </div>
    );
  }

  // Large grid - full details (original design)
  if (viewMode === 'grid-large') {
    return (
      <div className="overflow-visible w-full rounded-lg flex flex-col h-full bg-neutral-900 group relative">
        <div className="absolute -bottom-1 left-0 right-0 h-1 bg-black/20 blur-sm"></div>
        
        {/* NFT Image */}
        <Link href={`/nft/${tokenId}`} className="block w-full">
          <div className="relative bg-neutral-900 w-full overflow-visible" style={{ aspectRatio: "0.9/1" }}>
            <Image
              src={showPlaceholder ? placeholder : image}
              alt={name}
              fill
              loading="lazy"
              className={`object-contain p-2 hover:scale-[1.02] hover:rotate-[5deg] hover:-translate-y-1 transition-all duration-300 ease-out relative z-20 ${showPlaceholder ? 'animate-pulse' : ''}`}
              onLoad={() => {
                setImgLoaded(true);
                setImgLoading(false);
              }}
              onError={() => {
                setImgError(true);
                setImgLoading(false);
              }}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
            {imgLoading && !showPlaceholder && (
              <div className="absolute inset-0 bg-neutral-900/80 flex items-center justify-center">
                <div className="animate-pulse text-neutral-400 text-sm">Loading...</div>
              </div>
            )}
          </div>
        </Link>

        {/* Details Section - Full details for large grid */}
        <div className="space-y-1.5 pl-4 pr-2 pb-4">
          {/* Title and Favorite */}
          <div className="flex items-start justify-between gap-2">
            <Link href={`/nft/${tokenId}`} className="flex-1 min-w-0">
              <h3 className="font-medium text-sm leading-tight text-[#FFFBEB]">
                {name}
              </h3>
            </Link>
            <Button
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0 hover:bg-transparent flex-shrink-0"
              onClick={handleFavoriteClick}
            >
              <Heart className={`w-4 h-4 ${isFav ? "fill-[#ff0099] text-[#ff0099]" : "text-neutral-400 hover:text-[#ff0099] hover:outline hover:outline-1 hover:outline-[#ff0099]"}`} />
            </Button>
          </div>

          {/* Stats */}
          <div className="text-xs text-neutral-300 space-y-0">
            <div className="flex justify-between">
              <span>Rank:</span>
              <span className="text-neutral-300">{rank} of 7777</span>
            </div>
            <div className="flex justify-between">
              <span>Rarity:</span>
              <span className="text-neutral-300">{rarityPercent}%</span>
            </div>
            <div className="flex justify-between">
              <span>Tier:</span>
              <span className="text-neutral-300">{rarity.replace(" (Ultra-Legendary)", "")}</span>
            </div>
          </div>

          {/* Buy Section */}
          <div className="mt-0.5">
            {isForSale ? (
              <div className="space-y-0.5">
                <div className="text-xs text-blue-500">Buy Now</div>
                <div className="flex items-end justify-between">
                  <div className="text-base text-blue-500 font-semibold">
                    {priceEth} ETH
                  </div>
                          <Link
                            href={`/nft/${tokenId}`}
                            className="px-3 py-1.5 bg-blue-500 text-white font-normal rounded-sm hover:bg-blue-600 transition-all text-xs disabled:opacity-50 disabled:cursor-not-allowed w-auto min-w-0 h-auto min-h-0"
                            style={{
                              padding: '6px 12px',
                              fontSize: '12px',
                              height: 'auto',
                              minHeight: 'unset',
                              width: 'auto',
                              minWidth: 'unset',
                              borderRadius: '2px',
                              backgroundColor: '#3b82f6',
                              color: 'white'
                            }}
                          >
                            BUY
                          </Link>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    );
  }

  // Medium grid - current compact design
  return (
    <div className="overflow-visible w-full max-w-xs mx-auto rounded-lg flex flex-col h-full bg-neutral-900 group relative">
      <div className="absolute -bottom-1 left-0 right-0 h-1 bg-black/20 blur-sm"></div>
      
      {/* NFT Image */}
      <Link href={`/nft/${tokenId}`} className="block w-full">
        <div className="relative bg-neutral-900 w-full overflow-visible" style={{ aspectRatio: "0.8/1" }}>
          <Image
            src={showPlaceholder ? placeholder : image}
            alt={name}
            fill
            loading="lazy"
            className={`object-contain p-3 hover:scale-[1.02] hover:rotate-[5deg] hover:-translate-y-1 transition-all duration-300 ease-out relative z-20 ${showPlaceholder ? 'animate-pulse' : ''}`}
            onLoad={() => {
              setImgLoaded(true);
              setImgLoading(false);
            }}
            onError={() => {
              setImgError(true);
              setImgLoading(false);
            }}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          {imgLoading && !showPlaceholder && (
            <div className="absolute inset-0 bg-neutral-900/80 flex items-center justify-center">
              <div className="animate-pulse text-neutral-400 text-sm">Loading...</div>
            </div>
          )}
          
        </div>
      </Link>

      {/* NFT Details Section - Medium grid design */}
      <div className="pl-5 pr-3 pt-2 pb-3 flex-1 flex flex-col">
        {/* Title and Favorite */}
        <div className="flex items-center justify-between gap-2 mb-2">
          <Link href={`/nft/${tokenId}`} className="block flex-1 min-w-0">
            <h3 className="font-normal text-xs leading-tight text-[#FFFBEB] line-clamp-2">
              {name}
            </h3>
          </Link>
          <Button
            variant="ghost"
            size="sm"
            className="h-6 w-6 p-0 hover:bg-transparent flex-shrink-0"
            onClick={handleFavoriteClick}
          >
            <Heart className={`w-4 h-4 ${isFav ? "fill-[#ff0099] text-[#ff0099]" : "text-[#FFFBEB] hover:text-[#ff0099] hover:outline hover:outline-1 hover:outline-[#ff0099]"}`} />
          </Button>
        </div>

        {/* Buy Section - Minimal */}
        {isForSale ? (
          <div className="space-y-0.5">
            <div className="text-xs text-blue-500">Buy Now</div>
            <div className="flex items-end justify-between">
              <div className="text-base text-blue-500 font-semibold">
                {priceEth} ETH
              </div>
                      <Link
                        href={`/nft/${tokenId}`}
                        className="px-3 py-1.5 bg-blue-500 text-white font-normal rounded-sm hover:bg-blue-600 transition-all text-xs disabled:opacity-50 disabled:cursor-not-allowed w-auto min-w-0 h-auto min-h-0"
                        style={{
                          padding: '6px 12px',
                          fontSize: '12px',
                          height: 'auto',
                          minHeight: 'unset',
                          width: 'auto',
                          minWidth: 'unset',
                          borderRadius: '2px',
                          backgroundColor: '#3b82f6',
                          color: 'white'
                        }}
                      >
                        BUY
                      </Link>
            </div>
          </div>
        ) : null}
      </div>

    </div>
  );
}

