"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Heart } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Badge } from "./ui/badge";
import { useFavorites } from "../../hooks/useFavorites";
import { useActiveAccount, useSendTransaction } from "thirdweb/react";
import { bidInAuction, buyoutAuction } from "thirdweb/extensions/marketplace";
import { toWei } from "thirdweb";
import { marketplace } from "../lib/contracts";
import { getAuctionCountdown, getAuctionEndColor } from "../utils/auction-timer";
import { NFTCardData } from "../lib/types";

interface NFTCardProps {
  nft: NFTCardData;
}

export function NFTCard({ nft }: NFTCardProps) {
  const account = useActiveAccount();
  const { mutate: sendTransaction } = useSendTransaction();
  const { isFavorited, toggleFavorite } = useFavorites();
  
  const [bidAmount, setBidAmount] = useState("");
  const [isProcessingBid, setIsProcessingBid] = useState(false);
  const [isProcessingBuyNow, setIsProcessingBuyNow] = useState(false);

  // Handle favorite toggle
  const handleFavoriteToggle = () => {
    toggleFavorite({
      tokenId: nft.tokenId,
      name: nft.name,
      image: nft.image,
      rarity: nft.rarity,
      rank: nft.rank,
      rarityPercent: nft.rarityPercent,
    });
  };

  // Handle bid
  const handleBid = async () => {
    if (!account || !nft.auction || !bidAmount) return;

    try {
      setIsProcessingBid(true);
      
      await bidInAuction({
        contract: marketplace,
        auctionId: nft.auction.auctionId,
        bidAmount: toWei(bidAmount).toString(),
      });
      
      // Reset bid amount
      setBidAmount("");
    } catch (error) {
      console.error("Error placing bid:", error);
    } finally {
      setIsProcessingBid(false);
    }
  };

  // Handle buy now
  const handleBuyNow = async () => {
    if (!account || !nft.auction) return;

    try {
      setIsProcessingBuyNow(true);
      
      await buyoutAuction({
        contract: marketplace,
        auctionId: nft.auction.auctionId,
      });
    } catch (error) {
      console.error("Error buying NFT:", error);
    } finally {
      setIsProcessingBuyNow(false);
    }
  };

  const timeRemaining = nft.auction ? getAuctionCountdown(nft.auction.endTimestamp) : 'N/A';
  const timeColor = nft.auction ? getAuctionEndColor(nft.auction.endTimestamp) : 'text-neutral-400';

  return (
    <div className="group relative bg-card rounded-lg border overflow-hidden hover:shadow-lg transition-shadow">
      {/* Image */}
      <div className="relative aspect-square overflow-hidden">
        <Link href={`/nft/${nft.tokenId}`}>
          <Image
            src={nft.image}
            alt={nft.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </Link>
        
        {/* Favorite Button */}
        <button
          onClick={handleFavoriteToggle}
          className="absolute top-2 right-2 p-2 rounded-full bg-black/50 hover:bg-black/70 transition-colors"
        >
          <Heart 
            className={`w-5 h-5 ${
              isFavorited(nft.tokenId) ? 'fill-red-500 text-red-500' : 'text-white'
            }`} 
          />
        </button>

        {/* Status Badge */}
        <div className="absolute top-2 left-2">
          <Badge 
            variant={nft.isLive ? "default" : nft.isSold ? "secondary" : "outline"}
          >
            {nft.isLive ? "Live" : nft.isSold ? "SOLD" : "Ended"}
          </Badge>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 space-y-3">
        {/* Title and Rarity */}
        <div>
          <h3 className="font-semibold text-lg truncate">{nft.name}</h3>
          <p className="text-sm text-muted-foreground">
            Rank #{nft.rank} • {nft.rarity}
          </p>
        </div>

        {/* Auction Info */}
        {nft.isLive && nft.auction && (
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Min Bid:</span>
              <span className="font-medium">{nft.minBid}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Buy Now:</span>
              <span className="font-medium">{nft.buyNow}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Time Left:</span>
              <span className={`font-medium ${timeColor}`}>{timeRemaining}</span>
            </div>
          </div>
        )}

        {/* Actions */}
        {nft.isLive && nft.auction && (
          <div className="space-y-2">
            {/* Bid Input */}
            <div className="flex gap-2">
              <Input
                type="number"
                placeholder="Bid amount"
                value={bidAmount}
                onChange={(e) => setBidAmount(e.target.value)}
                className="flex-1"
                step="0.0001"
                min="0"
              />
              <Button 
                onClick={handleBid}
                disabled={!bidAmount || isProcessingBid || !account}
                size="sm"
              >
                {isProcessingBid ? "..." : "Bid"}
              </Button>
            </div>
            
            {/* Buy Now Button */}
            <Button 
              onClick={handleBuyNow}
              disabled={isProcessingBuyNow || !account}
              className="w-full"
              size="sm"
            >
              {isProcessingBuyNow ? "Processing..." : `Buy Now - ${nft.buyNow}`}
            </Button>
          </div>
        )}

        {/* Sold/Ended State */}
        {!nft.isLive && (
          <div className="text-center text-muted-foreground">
            <p className="text-sm">
              {nft.isSold ? "This NFT has been sold" : "Auction has ended"}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
