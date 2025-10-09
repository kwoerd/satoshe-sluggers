"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AttributeRarityChart from "@/components/attribute-rarity-chart";
import Footer from "@/components/footer";
import Navigation from "@/components/navigation";
import { useActiveAccount, useSendTransaction } from "thirdweb/react";
import { readContract } from "thirdweb";
import { bidInAuction, buyoutAuction } from "thirdweb/extensions/marketplace";
import { toWei } from "thirdweb";
import { marketplace } from "@/lib/contracts";
import { useFavorites } from "@/hooks/useFavorites";
import { getAuctionCountdown, getAuctionEndColor } from "@/utils/auction-timer";

export default function NFTPage() {
  const params = useParams();
  const tokenId = params.id as string;
  
  const account = useActiveAccount();
  const { mutate: sendTransaction } = useSendTransaction();
  const { isFavorited, toggleFavorite } = useFavorites();
  
  // State
  const [metadata, setMetadata] = useState<any>(null);
  const [imageUrl, setImageUrl] = useState<string>('');
  const [auction, setAuction] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [bidAmount, setBidAmount] = useState('');
  const [isProcessingBid, setIsProcessingBid] = useState(false);
  const [isProcessingBuyNow, setIsProcessingBuyNow] = useState(false);

  // Load data
  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        
        // Load all data in parallel
        const [allMetadata, nftUrls, auctionMap] = await Promise.all([
          fetch('/docs/combined_metadata.json').then(res => res.json()),
          fetch('/docs/nft_urls.json').then(res => res.json()),
          fetch('/docs/auction-map-static.json').then(res => res.json())
        ]);
        
        // Find this NFT's metadata
        const nftData = allMetadata.find((nft: any) => nft.token_id === Number(tokenId));
        if (!nftData) {
          console.error('NFT not found');
          return;
        }
        
        setMetadata(nftData);
        
        // Get image URL
        const urlData = nftUrls.find((url: any) => url.tokenId === Number(tokenId));
        setImageUrl(urlData ? urlData["Media Image URL"] : '/placeholder-nft.webp');
        
        // Get auction data
        const listingId = auctionMap.find((item: any) => item.tokenId === Number(tokenId))?.listingId;
        if (listingId) {
          try {
            const auctionData = await readContract({
              contract: marketplace,
              method: "function getAllValidAuctions(uint256 _startId, uint256 _endId) view returns ((uint256 auctionId, uint256 tokenId, uint256 quantity, uint256 minimumBidAmount, uint256 buyoutBidAmount, uint64 timeBufferInSeconds, uint64 bidBufferBps, uint64 startTimestamp, uint64 endTimestamp, address auctionCreator, address assetContract, address currency, uint8 tokenType, uint8 status)[] _validAuctions)",
              params: [BigInt(listingId), BigInt(listingId)],
            });
            
            if (auctionData && Array.isArray(auctionData) && auctionData.length > 0) {
              setAuction(auctionData[0]);
            }
          } catch (error) {
            console.error('Error fetching auction data:', error);
          }
        }
        
      } catch (error) {
        console.error('Error loading NFT data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (tokenId) {
      loadData();
    }
  }, [tokenId]);

  // Handle bid
  const handleBid = async () => {
    if (!account || !auction || !bidAmount) return;

    try {
      setIsProcessingBid(true);
      
      await bidInAuction({
        contract: marketplace,
        auctionId: BigInt(auction.auctionId),
        bidAmount: toWei(bidAmount),
      });
      
      // Refresh auction data
      // You can add a refresh function here
    } catch (error) {
      console.error('Error placing bid:', error);
    } finally {
      setIsProcessingBid(false);
    }
  };

  // Handle buy now
  const handleBuyNow = async () => {
    if (!account || !auction) return;

    try {
      setIsProcessingBuyNow(true);
      
      await buyoutAuction({
        contract: marketplace,
        auctionId: BigInt(auction.auctionId),
      });
      
      // Refresh auction data
      // You can add a refresh function here
    } catch (error) {
      console.error('Error buying NFT:', error);
    } finally {
      setIsProcessingBuyNow(false);
    }
  };

  // Handle favorite toggle
  const handleFavoriteToggle = () => {
    if (!metadata) return;
    
    toggleFavorite({
      tokenId: tokenId,
      name: metadata.name,
      image: imageUrl,
      rarity: metadata.rarity_tier,
      rank: metadata.rank,
      rarityPercent: metadata.rarity_percent,
    });
  };

  if (isLoading) {
    return (
      <main className="min-h-screen bg-background text-foreground pt-24 sm:pt-28">
        <Navigation activePage="nfts" />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">Loading...</div>
        </div>
        <Footer />
      </main>
    );
  }

  if (!metadata) {
    return (
      <main className="min-h-screen bg-background text-foreground pt-24 sm:pt-28">
        <Navigation activePage="nfts" />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">NFT not found</div>
        </div>
        <Footer />
      </main>
    );
  }

  const isLive = auction && auction.status === 1;
  const minBid = auction ? Number(auction.minimumBidAmount) / 1e18 : 0;
  const buyNow = auction ? Number(auction.buyoutBidAmount) / 1e18 : 0;
  const timeRemaining = auction ? getAuctionCountdown(auction.endTimestamp) : 'N/A';
  const timeColor = auction ? getAuctionEndColor(auction.endTimestamp) : 'text-neutral-400';

  return (
    <main className="min-h-screen bg-background text-foreground pt-24 sm:pt-28">
      <Navigation activePage="nfts" />

      <div className="container mx-auto px-4 py-8">
        {/* Back button */}
        <Link href="/nfts" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6">
          <ArrowLeft className="w-4 h-4" />
          Back to Collection
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Image */}
          <div className="space-y-4">
            <div className="relative">
              <Image
                src={imageUrl}
                alt={metadata.name}
                width={600}
                height={600}
                className="w-full aspect-square object-cover rounded-lg"
              />
              <button
                onClick={handleFavoriteToggle}
                className="absolute top-4 right-4 p-2 rounded-full bg-black/50 hover:bg-black/70 transition-colors"
              >
                <Heart 
                  className={`w-6 h-6 ${
                    isFavorited(tokenId) ? 'fill-red-500 text-red-500' : 'text-white'
                  }`} 
                />
              </button>
            </div>
          </div>

          {/* Details */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold mb-2">{metadata.name}</h1>
              <p className="text-muted-foreground mb-4">{metadata.description}</p>
              
              <div className="flex items-center gap-4 text-sm">
                <span>Token #{metadata.token_id}</span>
                <span>Rank #{metadata.rank}</span>
                <span className="px-2 py-1 bg-primary/10 text-primary rounded">
                  {metadata.rarity_tier}
                </span>
              </div>
            </div>

            {/* Auction Info */}
            {isLive && (
              <div className="space-y-4 p-4 border rounded-lg">
                <h3 className="text-lg font-semibold">Auction Details</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Minimum Bid:</span>
                    <span className="font-medium">{minBid.toFixed(4)} ETH</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Buy Now:</span>
                    <span className="font-medium">{buyNow.toFixed(4)} ETH</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Time Remaining:</span>
                    <span className={`font-medium ${timeColor}`}>{timeRemaining}</span>
                  </div>
                </div>

                {/* Bid Form */}
                <div className="space-y-3">
                  <div className="flex gap-2">
                    <Input
                      type="number"
                      placeholder="Bid amount (ETH)"
                      value={bidAmount}
                      onChange={(e) => setBidAmount(e.target.value)}
                      className="flex-1"
                    />
                    <Button 
                      onClick={handleBid}
                      disabled={!bidAmount || isProcessingBid}
                    >
                      {isProcessingBid ? 'Bidding...' : 'Place Bid'}
                    </Button>
                  </div>
                  
                  <Button 
                    onClick={handleBuyNow}
                    disabled={isProcessingBuyNow}
                    className="w-full"
                  >
                    {isProcessingBuyNow ? 'Processing...' : `Buy Now - ${buyNow.toFixed(4)} ETH`}
                  </Button>
                </div>
              </div>
            )}

            {/* Attributes */}
            <Tabs defaultValue="attributes" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="attributes">Attributes</TabsTrigger>
                <TabsTrigger value="rarity">Rarity Chart</TabsTrigger>
              </TabsList>
              
              <TabsContent value="attributes" className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  {metadata.attributes?.map((attr: any, index: number) => (
                    <div key={index} className="p-3 border rounded-lg">
                      <div className="text-sm text-muted-foreground">{attr.trait_type}</div>
                      <div className="font-medium">{attr.value}</div>
                      <div className="text-xs text-muted-foreground">
                        {attr.rarity}% have this trait
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>
              
              <TabsContent value="rarity">
                <AttributeRarityChart attributes={metadata.attributes || []} />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}