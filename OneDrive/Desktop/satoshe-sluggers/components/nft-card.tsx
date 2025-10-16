"use client"

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Heart } from "lucide-react";
import { useFavorites } from "@/hooks/useFavorites";
import { track } from '@vercel/analytics';

interface NFTCardProps {
  image: string;
  name: string;
  rank: string | number;
  rarity: string;
  rarityPercent: string | number;
  price: string;
  tokenId: string;
  isForSale: boolean;
  onPurchase?: () => void;
  isProcessing?: boolean;
  viewMode?: 'grid-large' | 'grid-medium' | 'grid-small' | 'compact';
}

export default function NFTCard({
  image,
  name,
  rank,
  rarity,
  rarityPercent,
  price,
  tokenId,
  isForSale,
  onPurchase,
  isProcessing = false,
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

  const handlePurchase = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!isConnected) {
      alert('Please connect your wallet to purchase NFTs');
      return;
    }

    if (isProcessing) return;

    // Call the parent's purchase handler if provided
    if (onPurchase) {
      track('NFT Purchase Attempted', { tokenId });
      onPurchase();
    }
  };

  // Small grid - just images, tightly packed
  if (viewMode === 'grid-small') {
    return (
      <div className="overflow-visible w-full max-w-sm mx-auto rounded-lg flex flex-col h-full bg-neutral-900 group relative">
        <div className="absolute -bottom-1 left-0 right-0 h-1 bg-black/20 blur-sm"></div>
        
        {/* NFT Image Only */}
        <Link href={`/nft/${tokenId}`} className="block w-full">
          <div className="relative bg-neutral-900 w-full overflow-visible" style={{ aspectRatio: "0.9/1" }}>
            <img
              src={showPlaceholder ? placeholder : image}
              alt={name}
              width="100%"
              height="100%"
              loading="lazy"
              decoding="async"
              className={`object-contain p-2 hover:scale-[1.02] hover:rotate-[5deg] hover:-translate-y-1 transition-all duration-300 ease-out relative z-20 ${showPlaceholder ? 'animate-pulse' : ''}`}
              onLoad={() => {
                setImgLoaded(true);
                setImgLoading(false);
              }}
              onError={() => {
                setImgError(true);
                setImgLoading(false);
              }}
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
      <div className="overflow-visible w-full max-w-sm mx-auto rounded-lg flex flex-col h-full bg-neutral-900 group relative">
        <div className="absolute -bottom-1 left-0 right-0 h-1 bg-black/20 blur-sm"></div>
        
        {/* NFT Image */}
        <Link href={`/nft/${tokenId}`} className="block w-full">
          <div className="relative bg-neutral-900 w-full overflow-visible" style={{ aspectRatio: "0.9/1" }}>
            <img
              src={showPlaceholder ? placeholder : image}
              alt={name}
              width="100%"
              height="100%"
              loading="lazy"
              decoding="async"
              className={`object-contain p-2 hover:scale-[1.02] hover:rotate-[5deg] hover:-translate-y-1 transition-all duration-300 ease-out relative z-20 ${showPlaceholder ? 'animate-pulse' : ''}`}
              onLoad={() => {
                setImgLoaded(true);
                setImgLoading(false);
              }}
              onError={() => {
                setImgError(true);
                setImgLoading(false);
              }}
            />
            {imgLoading && !showPlaceholder && (
              <div className="absolute inset-0 bg-neutral-900/80 flex items-center justify-center">
                <div className="animate-pulse text-neutral-400 text-sm">Loading...</div>
              </div>
            )}
          </div>
        </Link>

        {/* Details Section - Full details for large grid */}
        <div className="space-y-2 px-2 pb-4">
          {/* Title and Favorite */}
          <div className="flex items-start justify-between gap-2">
            <Link href={`/nft/${tokenId}`} className="flex-1 min-w-0">
              <h3 className="font-medium text-lg leading-tight text-neutral-100 line-clamp-1">
                {name}
              </h3>
            </Link>
            <Button
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0 hover:bg-transparent flex-shrink-0"
              onClick={handleFavoriteClick}
            >
              <Heart className={`w-4 h-4 ${isFav ? "fill-[#ff0099] text-[#ff0099]" : "text-neutral-400 hover:text-neutral-300"}`} />
            </Button>
          </div>

          {/* Stats */}
          <div className="text-xs text-neutral-300 space-y-1">
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

          {/* Buy Section OR Status */}
          <div className="mt-4">
            {isForSale ? (
              <div className="flex items-center gap-2">
                <div className="flex-1 h-9 bg-transparent border border-blue-500 rounded-sm px-3 flex items-center justify-between cursor-default">
                  <span className="text-sm font-normal text-blue-500">{price}</span>
                  <span className="text-xs text-neutral-400 font-normal">ETH</span>
                </div>
                <Button
                  onClick={handlePurchase}
                  disabled={isProcessing}
                  className="h-9 px-6 bg-transparent border border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white transition-all duration-200 font-medium text-sm rounded-sm disabled:opacity-50"
                >
                  {isProcessing ? "..." : "BUY"}
                </Button>
              </div>
            ) : price !== "--" ? (
              <div className="w-full h-9 bg-neutral-700/50 border border-neutral-600 rounded-sm flex items-center justify-center">
                <span className="text-sm font-medium text-blue-500">SOLD</span>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    );
  }

  // Medium grid - current compact design
  return (
    <div className="overflow-visible w-full max-w-sm mx-auto rounded-lg flex flex-col h-full bg-neutral-900 group relative">
      <div className="absolute -bottom-1 left-0 right-0 h-1 bg-black/20 blur-sm"></div>
      
      {/* NFT Image */}
      <Link href={`/nft/${tokenId}`} className="block w-full">
        <div className="relative bg-neutral-900 w-full overflow-visible" style={{ aspectRatio: "0.9/1" }}>
          <img
            src={showPlaceholder ? placeholder : image}
            alt={name}
            width="100%"
            height="100%"
            loading="lazy"
            decoding="async"
            className={`object-contain p-2 hover:scale-[1.02] hover:rotate-[5deg] hover:-translate-y-1 transition-all duration-300 ease-out relative z-20 ${showPlaceholder ? 'animate-pulse' : ''}`}
            onLoad={() => {
              setImgLoaded(true);
              setImgLoading(false);
            }}
            onError={() => {
              setImgError(true);
              setImgLoading(false);
            }}
          />
          {imgLoading && !showPlaceholder && (
            <div className="absolute inset-0 bg-neutral-900/80 flex items-center justify-center">
              <div className="animate-pulse text-neutral-400 text-sm">Loading...</div>
            </div>
          )}
        </div>
      </Link>

      {/* NFT Title and Rarity Section - Medium grid design */}
      <div className="px-2 pt-2">
        <div className="flex items-center justify-between">
          <Link href={`/nft/${tokenId}`} className="block">
            <h3 className="font-medium text-sm leading-tight text-neutral-100">
              #{tokenId}
            </h3>
          </Link>
          
          <div className="flex items-center gap-1">
            {/* Heart Icon */}
            <Button
              variant="ghost"
              size="sm"
              className="h-5 w-5 p-0 hover:bg-transparent"
              onClick={handleFavoriteClick}
            >
              <Heart className={`w-3 h-3 ${isFav ? "fill-[#ff0099] text-[#ff0099]" : "text-neutral-400 hover:text-neutral-300"}`} />
            </Button>
            
            {/* Rarity Square */}
            <div className="bg-transparent border border-teal-400 rounded-sm px-1.5 py-0.5 flex items-center justify-center">
              <span className="text-xs text-teal-400 font-mono">{rank}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Buy Section - Medium grid design */}
      <div className="px-2 pt-2 pb-4">
        {isForSale ? (
          <div className="flex items-center gap-2">
            <div className="flex-1 h-8 bg-transparent border border-blue-500 rounded-sm px-3 flex items-center justify-between cursor-default">
              <span className="text-sm font-normal text-blue-500">{price}</span>
              <span className="text-xs text-neutral-400 font-normal">ETH</span>
            </div>
            <Button
              onClick={handlePurchase}
              disabled={isProcessing}
              className="h-8 px-4 bg-transparent border border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white transition-all duration-200 font-medium text-sm rounded-sm disabled:opacity-50"
            >
              {isProcessing ? "..." : "BUY"}
            </Button>
          </div>
        ) : price !== "--" ? (
          <div className="w-full h-8 bg-neutral-700/50 border border-neutral-600 rounded-sm flex items-center justify-center">
            <span className="text-sm font-medium text-blue-500">SOLD</span>
          </div>
        ) : null}
      </div>
    </div>
  );
}

