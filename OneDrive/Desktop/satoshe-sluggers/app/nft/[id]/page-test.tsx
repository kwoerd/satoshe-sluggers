"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { useActiveAccount, useSendTransaction } from "thirdweb/react";
import { buyFromListing } from "thirdweb/extensions/marketplace";
import { marketplace } from "@/lib/contracts";
import { getTestNFTByTokenId } from "@/lib/test-data-service";
import { track } from '@vercel/analytics';
import { triggerPurchaseConfetti } from "@/lib/confetti";
import { ArrowLeft, Heart } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useFavorites } from "@/hooks/useFavorites";

interface TestNFTData {
  name: string;
  description: string;
  token_id: number;
  card_number: number;
  collection_number: number;
  edition: number;
  series: string;
  rarity_score: number;
  rank: number;
  rarity_percent: number;
  rarity_tier: string;
  attributes: Array<{
    trait_type: string;
    value: string;
    occurrence: number;
    rarity: number;
  }>;
  artist: string;
  platform: string;
  compiler: string;
  copyright: string;
  date: number;
  image: string;
  listing_id: number;
  price_eth: number;
}

export default function NFTDetailPageTest() {
  const params = useParams();
  const tokenId = params.id as string;
  
  const [nftData, setNftData] = useState<TestNFTData | null>(null);
  const [loading, setLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  
  const account = useActiveAccount();
  const { mutate: sendTransaction } = useSendTransaction();
  const { toggleFavorite, isFavorited } = useFavorites();

  // Load NFT data
  useEffect(() => {
    const loadNFT = async () => {
      try {
        setLoading(true);
        const nft = getTestNFTByTokenId(tokenId);
        
        if (!nft) {
          console.error('NFT not found');
          return;
        }

        setNftData(nft);
      } catch (error) {
        console.error('Error loading NFT:', error);
      } finally {
        setLoading(false);
      }
    };

    if (tokenId) {
      loadNFT();
    }
  }, [tokenId]);

  // Handle purchase
  const handlePurchase = async () => {
    if (!account) {
      alert('Please connect your wallet to purchase NFTs');
      return;
    }

    if (!nftData?.price_eth || nftData.price_eth <= 0) {
      alert('This NFT is not for sale');
      return;
    }

    if (!nftData.listing_id) {
      alert('No listing ID available for this NFT');
      return;
    }

    try {
      setIsProcessing(true);
      
      const transaction = await buyFromListing({
        contract: marketplace,
        listingId: BigInt(nftData.listing_id),
        quantity: 1n,
        recipient: account.address,
      });

      await sendTransaction(transaction);
      
      track('NFT Purchased', { 
        tokenId: nftData.token_id, 
        listingId: nftData.listing_id,
        price: nftData.price_eth,
        rarity: nftData.rarity_tier 
      });
      
      triggerPurchaseConfetti();
      alert('NFT purchased successfully! 🎉');
      
      // Update UI to reflect purchase - mark as sold
      setNftData(prev => prev ? {
        ...prev,
        price_eth: 0
      } : null);
      
    } catch (error) {
      console.error('Purchase failed:', error);
      const errorMessage = error instanceof Error ? error.message : 'Purchase failed. Please try again.';
      alert(`Purchase failed: ${errorMessage}`);
    } finally {
      setIsProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-950 text-white">
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-neutral-800 rounded w-1/4 mb-8"></div>
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
            <p className="text-neutral-400 mb-8">The NFT you&apos;re looking for doesn&apos;t exist.</p>
            <Link 
              href="/nfts" 
              className="bg-[#3B82F6] text-white px-6 py-3 rounded-sm hover:bg-[#2563EB] transition-colors"
            >
              Back to Collection
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const isFav = isFavorited(nftData.token_id.toString());

  return (
    <div className="min-h-screen bg-neutral-950 text-white">
      <div className="container mx-auto px-4 py-8">
        {/* Navigation */}
        <div className="flex items-center justify-between mb-8">
          <Link 
            href="/nfts" 
            className="flex items-center gap-2 text-neutral-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Collection
          </Link>
          
          <div className="flex items-center gap-4">
            <button
              onClick={() => toggleFavorite({
                tokenId: nftData.token_id.toString(),
                name: nftData.name,
                image: nftData.image,
                rarity: nftData.rarity_tier,
                rank: nftData.rank,
                rarityPercent: nftData.rarity_percent
              })}
              className="p-2 hover:bg-neutral-800 rounded-full transition-colors"
            >
              <Heart className={`w-6 h-6 ${isFav ? "fill-[#ff0099] text-[#ff0099]" : "text-neutral-400"}`} />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* NFT Image */}
          <div className="relative">
            <div className="aspect-square bg-neutral-900 rounded-sm border border-neutral-700 overflow-hidden">
              <Image
                src={nftData.image}
                alt={nftData.name}
                fill
                className="object-contain p-4"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
          </div>

          {/* NFT Details */}
          <div className="space-y-6">
            {/* Title and Basic Info */}
            <div>
              <h1 className="text-3xl font-bold mb-2">{nftData.name}</h1>
              <p className="text-neutral-400 text-lg mb-4">{nftData.description}</p>
              
              <div className="flex items-center gap-4 text-sm text-neutral-300">
                <span>Token ID: {nftData.token_id}</span>
                <span>•</span>
                <span>Rank: #{nftData.rank}</span>
                <span>•</span>
                <span>Rarity: {nftData.rarity_percent}%</span>
              </div>
            </div>

            {/* Price and Purchase */}
            {nftData.price_eth > 0 ? (
              <div className="bg-neutral-800 p-6 rounded-sm border border-neutral-700">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <div className="text-2xl font-bold text-white">
                      {nftData.price_eth} ETH
                    </div>
                    <div className="text-sm text-neutral-400">Current Price</div>
                  </div>
                </div>
                
                <button
                  onClick={handlePurchase}
                  disabled={isProcessing || !account}
                  className="w-full bg-[#3B82F6] text-white py-3 px-6 rounded-sm hover:bg-[#2563EB] transition-all duration-200 font-semibold text-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isProcessing ? 'Processing...' : 'BUY NOW'}
                </button>
                
                {!account && (
                  <p className="text-sm text-neutral-400 mt-2 text-center">
                    Connect your wallet to purchase
                  </p>
                )}
              </div>
            ) : (
              <div className="bg-neutral-800 p-6 rounded-sm border border-neutral-700">
                <div className="text-center">
                  <div className="text-xl font-semibold text-neutral-400 mb-2">Not for Sale</div>
                  <div className="text-sm text-neutral-500">This NFT is not currently available for purchase</div>
                </div>
              </div>
            )}

            {/* Rarity and Stats */}
            <div className="bg-neutral-800 p-6 rounded-sm border border-neutral-700">
              <h3 className="text-lg font-semibold mb-4">Rarity Information</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-sm text-neutral-400">Rarity Tier</div>
                  <div className="text-lg font-semibold text-[#ff0099]">{nftData.rarity_tier}</div>
                </div>
                <div>
                  <div className="text-sm text-neutral-400">Rarity Score</div>
                  <div className="text-lg font-semibold">{nftData.rarity_score}</div>
                </div>
                <div>
                  <div className="text-sm text-neutral-400">Rank</div>
                  <div className="text-lg font-semibold">#{nftData.rank}</div>
                </div>
                <div>
                  <div className="text-sm text-neutral-400">Percentile</div>
                  <div className="text-lg font-semibold">{nftData.rarity_percent}%</div>
                </div>
              </div>
            </div>

            {/* Attributes */}
            <div className="bg-neutral-800 p-6 rounded-sm border border-neutral-700">
              <h3 className="text-lg font-semibold mb-4">Attributes</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {nftData.attributes.map((attr, index) => (
                  <div key={index} className="bg-neutral-900 p-3 rounded-sm border border-neutral-700">
                    <div className="text-sm font-medium uppercase tracking-wide text-neutral-400 mb-1">
                      {attr.trait_type}
                    </div>
                    <div className="font-medium text-base text-white mb-1">
                      {attr.value}
                    </div>
                    <div className="text-xs text-neutral-500">
                      {attr.occurrence} ({attr.rarity}%)
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Collection Info */}
            <div className="bg-neutral-800 p-6 rounded-sm border border-neutral-700">
              <h3 className="text-lg font-semibold mb-4">Collection Information</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-neutral-400">Series</span>
                  <span className="text-white">{nftData.series}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-neutral-400">Edition</span>
                  <span className="text-white">{nftData.edition}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-neutral-400">Card Number</span>
                  <span className="text-white">{nftData.card_number}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-neutral-400">Collection Number</span>
                  <span className="text-white">{nftData.collection_number}</span>
                </div>
              </div>
            </div>

            {/* Artist and Platform */}
            <div className="bg-neutral-800 p-6 rounded-sm border border-neutral-700">
              <h3 className="text-lg font-semibold mb-4">Credits</h3>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <Image 
                    src="/brands/kristen-woerdeman/artist-logo-kristen-woerdeman-26px.png" 
                    alt="Kristen Woerdeman" 
                    width={26}
                    height={26}
                    className="w-[26px] h-[26px]"
                  />
                  <span className="text-sm text-neutral-400">Artist:</span>
                  <span className="text-sm font-medium">{nftData.artist}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Image 
                    src="/brands/retinal-delights/platform-logo-retinal-delights-26px.png" 
                    alt="Retinal Delights" 
                    width={26}
                    height={26}
                    className="w-[26px] h-[26px]"
                  />
                  <span className="text-sm text-neutral-400">Platform:</span>
                  <span className="text-sm font-medium">{nftData.platform}</span>
                </div>
              </div>
              <div className="mt-3 text-xs text-neutral-500">
                {nftData.copyright}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
