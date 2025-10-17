// components/nft-card.tsx

// components/nft-card.tsx
"use client"

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Heart } from "lucide-react";
import { useFavorites } from "@/hooks/useFavorites";
import { track } from '@vercel/analytics';
import { BuyDirectListingButton } from "thirdweb/react";
import { client } from "@/lib/thirdweb";
import { base } from "thirdweb/chains";

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
        <div className="space-y-2 px-2 pb-4">
          {/* Title and Favorite */}
          <div className="flex items-start justify-between gap-2">
            <Link href={`/nft/${tokenId}`} className="flex-1 min-w-0">
              <h3 className="font-medium text-xs leading-tight text-[#FFFBEB] truncate">
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

          {/* Buy Section */}
          <div className="mt-3">
            {isForSale && listingId ? (
              <div className="flex items-center justify-between">
                <div className="text-xs text-blue-500 font-medium">
                  {priceEth} ETH
                </div>
                <BuyDirectListingButton
                  contractAddress="0x187A56dDfCcc96AA9f4FaAA8C0fE57388820A817"
                  client={client}
                  chain={base}
                  listingId={BigInt(listingId)}
                  quantity={1n}
                  onTransactionSent={() => {
                    track('NFT Purchase Attempted', { tokenId });
                  }}
                  onTransactionConfirmed={() => {
                    track('NFT Purchase Success', { tokenId });
                    if (onPurchase) onPurchase();
                  }}
                  onError={(error) => {
                    console.error('Purchase failed:', error);
                    track('NFT Purchase Failed', { tokenId });
                  }}
                  className="px-3 py-1.5 bg-[#ff0099] text-[#FFFBEB] font-normal rounded-sm hover:bg-[#ff0099]/90 transition-all duration-200 text-xs disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  BUY
                </BuyDirectListingButton>
              </div>
            ) : priceEth > 0 ? (
              <div className="flex items-center justify-between">
                <div className="text-xs text-neutral-400 font-medium">
                  SOLD
                </div>
                <div className="px-3 py-1.5 bg-neutral-700 text-neutral-500 text-xs font-normal rounded-sm">
                  SOLD
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
          
          {/* Heart Icon - Upper Right Corner */}
          <div className="absolute top-3 right-3 z-30">
            <Button
              variant="ghost"
              size="sm"
              className="h-7 w-7 p-0 hover:bg-transparent bg-black/20 rounded-full"
              onClick={handleFavoriteClick}
            >
              <Heart className={`w-4 h-4 ${isFav ? "fill-[#ff0099] text-[#ff0099]" : "text-[#FFFBEB] hover:text-[#ff0099] hover:outline hover:outline-1 hover:outline-[#ff0099]"}`} />
            </Button>
          </div>
        </div>
      </Link>

      {/* NFT Title Section - Medium grid design */}
      <div className="px-4 pt-4 pb-4 flex-1 flex flex-col">
        <Link href={`/nft/${tokenId}`} className="block flex-1">
          <h3 className="font-medium text-sm leading-tight text-[#FFFBEB] mb-4 line-clamp-2">
            {name}
          </h3>
        </Link>
        
        {/* Buy Button for Medium Grid */}
        {isForSale && listingId ? (
          <div className="w-full mt-auto">
            <BuyDirectListingButton
              contractAddress="0x187A56dDfCcc96AA9f4FaAA8C0fE57388820A817"
              client={client}
              chain={base}
              listingId={BigInt(listingId)}
              quantity={1n}
              onTransactionSent={() => {
                track('NFT Purchase Attempted', { tokenId });
              }}
              onTransactionConfirmed={() => {
                track('NFT Purchase Success', { tokenId });
                if (onPurchase) onPurchase();
              }}
              onError={(error) => {
                console.error('Purchase failed:', error);
                track('NFT Purchase Failed', { tokenId });
              }}
              className="px-4 py-2 bg-[#ff0099] text-[#FFFBEB] font-normal rounded-sm hover:bg-[#ff0099]/90 transition-all duration-200 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              BUY
            </BuyDirectListingButton>
          </div>
        ) : priceEth > 0 ? (
          <div className="px-4 py-2 bg-neutral-700 text-neutral-500 text-sm font-normal rounded-sm flex items-center justify-center mt-auto">
            <span>SOLD</span>
          </div>
        ) : null}
      </div>

    </div>
  );
}

