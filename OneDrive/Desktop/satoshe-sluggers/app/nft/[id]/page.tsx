"use client";

import { useState, useEffect, useMemo } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Heart, ChevronLeft, ChevronRight, ExternalLink } from "lucide-react";
import Footer from "@/components/footer";
import Navigation from "@/components/navigation";
import AttributeRarityChart from "@/components/attribute-rarity-chart";
import { MediaRenderer, useActiveAccount, BuyDirectListingButton } from "thirdweb/react";
import { base } from "thirdweb/chains";
import { client } from "../../../lib/thirdweb";
import { useFavorites } from "@/hooks/useFavorites";
import { getNFTByTokenId, NFTData } from "@/lib/simple-data-service";
import { track } from '@vercel/analytics';
import { TOTAL_COLLECTION_SIZE } from "@/lib/contracts";
import confetti from 'canvas-confetti';
import { Separator } from "@/components/ui/separator";

// Type definitions
interface NFTAttribute {
  trait_type: string;
  value: string;
  occurrence?: number;
  rarity?: number;
  percentage?: number;
}

// Consistent color scheme based on the radial chart
const COLORS = {
  background: "#3B82F6", // blue
  skinTone: "#F59E0B", // yellow/orange
  shirt: "#EF4444", // red
  hair: "#10B981", // green
  eyewear: "#06B6D4", // teal/cyan
  headwear: "#A855F7", // purple
  // Keep the hot pink as requested
  accent: "#EC4899", // hot pink
  // UI colors
  neutral: {
    100: "#F5F5F5",
    400: "#A3A3A3",
    600: "#525252",
    700: "#404040",
    800: "#262626",
    900: "#171717",
  }
};

// Helper to get color for attribute
function getColorForAttribute(attributeName: string) {
  const colorMap: { [key: string]: string } = {
    "Background": COLORS.background,
    "Skin Tone": COLORS.skinTone,
    "Shirt": COLORS.shirt,
    "Hair": COLORS.hair,
    "Eyewear": COLORS.eyewear,
    "Headwear": COLORS.headwear,
  };
  return colorMap[attributeName] || COLORS.background;
}

export default function NFTDetailPage() {
  const params = useParams<{ id: string }>();
  const tokenId = params.id;
  const [metadata, setMetadata] = useState<NFTData | null>(null);
  const [imageUrl, setImageUrl] = useState<string>("/media/nfts/placeholder-nft.webp");
  const [isLoading, setIsLoading] = useState(true);
  const [navigationTokens, setNavigationTokens] = useState<{prev: number | null, next: number | null}>({prev: null, next: null});
  const [isPurchased, setIsPurchased] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [transactionState, setTransactionState] = useState<'idle' | 'pending' | 'success' | 'error'>('idle');
  const [transactionError, setTransactionError] = useState<string | null>(null);
  
  const { isFavorited, toggleFavorite, isConnected } = useFavorites();

  // Calculate navigation tokens (previous and next)
  useEffect(() => {
    const currentTokenId = parseInt(tokenId);
    
    // For main collection, navigate within main range (1-TOTAL_COLLECTION_SIZE)
    const prevToken = currentTokenId > 1 ? currentTokenId - 1 : null;
    const nextToken = currentTokenId < TOTAL_COLLECTION_SIZE ? currentTokenId + 1 : null;
    
    setNavigationTokens({
      prev: prevToken,
      next: nextToken
    });
  }, [tokenId]);

  // Load NFT metadata
  useEffect(() => {
    setIsLoading(true);

    // Set a timeout to prevent infinite loading
    const timeoutId = setTimeout(() => {
      setIsLoading(false);
    }, 10000); // 10 second timeout

    const tokenIdNum = parseInt(tokenId);
    
    // Check if this is a test NFT first (token IDs 7777-7781)
    if (tokenIdNum >= 7777 && tokenIdNum <= 7781) {
      // Load test NFT metadata and listing data
      Promise.all([
        fetch(`/data/test-nfts/${tokenIdNum}.json`).then(res => res.json()),
        fetch('/data/test_listings.json').then(res => res.json())
      ])
        .then(([metadata, listingsData]) => {
          const testListing = Object.values(listingsData.test_listings).find((listing: any) => 
            listing.token_id === tokenIdNum && listing.status === 'Active'
          ) as any;
          
          if (testListing) {
            // Merge the real metadata with listing data
            const testMetadata = {
              ...metadata,
              merged_data: {
                nft: testListing.token_id,
                token_id: testListing.token_id,
                listing_id: parseInt(Object.keys(listingsData.test_listings).find(key => 
                  listingsData.test_listings[key].token_id === tokenIdNum
                ) || "0"),
                metadata_cid: "test-cid",
                media_cid: "test-cid",
                metadata_url: "/nfts/placeholder-nft.webp",
                media_url: "/nfts/placeholder-nft.webp",
                price_eth: testListing.price_eth
              }
            };
            setMetadata(testMetadata);
            setImageUrl("/nfts/placeholder-nft.webp");
          } else {
            setMetadata(null);
            setImageUrl("/nfts/placeholder-nft.webp");
          }
          clearTimeout(timeoutId);
          setIsLoading(false);
        })
        .catch(() => {
          setMetadata(null);
          setImageUrl("/nfts/placeholder-nft.webp");
          clearTimeout(timeoutId);
          setIsLoading(false);
        });
    } else {
      // Load main collection NFT data using data service
      // Note: token IDs in metadata start from 0, but URLs use human-friendly numbers (1-based)
      const actualTokenId = tokenIdNum - 1;
      getNFTByTokenId(actualTokenId)
            .then((nftData: NFTData | null) => {
            
            if (nftData) {
              setMetadata(nftData);
              
              // Set image URL from metadata
              const mediaUrl = nftData.merged_data?.media_url;
              if (mediaUrl) {
                setImageUrl(mediaUrl);
              } else {
                setImageUrl("/nfts/placeholder-nft.webp");
              }
            } else {
              setMetadata(null);
              setImageUrl("/nfts/placeholder-nft.webp");
            }
            clearTimeout(timeoutId);
            setIsLoading(false);
          })
          .catch(() => {
            setMetadata(null);
            setImageUrl("/nfts/placeholder-nft.webp");
            clearTimeout(timeoutId);
            setIsLoading(false);
          });
    }

    // Cleanup timeout on unmount
    return () => clearTimeout(timeoutId);
  }, [tokenId]);

  const attributes = useMemo(() => {
    // Use real attributes from complete metadata
    if (metadata && metadata.attributes) {
      const mappedAttributes = metadata.attributes.map((attr: NFTAttribute) => {
        // Generate a simple percentage based on attribute value if not provided
        let percentage = attr.percentage || attr.rarity || 0;
        
        // If no percentage data, create a simple distribution
        if (percentage === 0) {
          // Simple hash-based percentage for demo purposes
          const hash = attr.value.split('').reduce((a, b) => {
            a = ((a << 5) - a) + b.charCodeAt(0);
            return a & a;
          }, 0);
          percentage = Math.abs(hash) % 50 + 1; // 1-50% range
        }
        
        return {
          name: attr.trait_type,
          value: attr.value,
          percentage: percentage,
          occurrence: attr.occurrence
        };
      });
      return mappedAttributes;
    }
    return [];
  }, [metadata]);

  // Get pricing data from metadata
  const priceEth = metadata?.merged_data?.price_eth || 0;
  const listingId = metadata?.merged_data?.listing_id || 0;
  const isForSale = priceEth > 0 && !isPurchased;

  // Confetti celebration function
  const triggerConfetti = () => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#ff0099', '#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6']
    });
  };

  // Handle transaction state changes
  const handleTransactionPending = () => {
    setTransactionState('pending');
    setTransactionError(null);
  };

  const handleTransactionSuccess = async (receipt: { transactionHash: string; blockNumber: bigint }) => {
    setTransactionState('success');
    setIsPurchased(true);
    setShowSuccess(true);
    triggerConfetti();
    track('NFT Purchase Success', { 
      tokenId: tokenId,
      transactionHash: receipt.transactionHash,
      blockNumber: Number(receipt.blockNumber)
    });
    
    // Hide success message after 5 seconds
    setTimeout(() => {
      setShowSuccess(false);
    }, 5000);
  };

  const handleTransactionError = (error: Error) => {
    // Transaction failed - error handled by UI
    setTransactionState('error');
    
    // Parse error message for user-friendly display
    let errorMessage = "Transaction failed. Please try again.";
    
    if (error?.message) {
      if (error.message.includes("user rejected")) {
        errorMessage = "Transaction was cancelled by user.";
      } else if (error.message.includes("insufficient funds")) {
        errorMessage = "Insufficient funds for this transaction.";
      } else if (error.message.includes("gas")) {
        errorMessage = "Transaction failed due to gas issues. Please try again.";
      } else if (error.message.includes("already sold")) {
        errorMessage = "This NFT has already been sold.";
      } else {
        errorMessage = error.message;
      }
    }
    
    setTransactionError(errorMessage);
    track('NFT Purchase Failed', { 
      tokenId: tokenId,
      error: errorMessage
    });
    
    // Clear error after 10 seconds
    setTimeout(() => {
      setTransactionState('idle');
      setTransactionError(null);
    }, 10000);
  };
  

  // Handle favorite toggle
  const handleFavoriteToggle = () => {
    if (!isConnected) {
      alert("Please connect your wallet to favorite NFTs");
      return;
    }

    if (metadata) {
      toggleFavorite({
        tokenId: tokenId,
        name: metadata.name || `SATOSHE SLUGGER #${parseInt(tokenId) + 1}`,
        image: imageUrl,
        rarity: metadata.rarity_tier || "Unknown",
        rank: metadata.rank || "—",
        rarityPercent: metadata.rarity_percent || "—",
      });
    }
  };



  if (isLoading) {
    return (
      <main className="min-h-screen bg-background text-foreground flex flex-col">
        <Navigation activePage="nfts" />
        <div className="flex-grow flex flex-col items-center justify-center pt-24 sm:pt-28">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-pink mx-auto mb-4"></div>
            <p className="text-neutral-400">Loading NFT details...</p>
            <p className="text-sm text-gray-500 mt-2">Token ID: {tokenId}</p>
          </div>
        </div>
        <Footer />
      </main>
    );
  }

  if (!metadata) {
    return (
      <main className="min-h-screen bg-background text-foreground flex flex-col">
        <Navigation activePage="nfts" />
        <div className="flex-grow flex flex-col items-center justify-center pt-24 sm:pt-28">
          <p className="text-xl" style={{ color: COLORS.shirt }}>NFT not found in local metadata.</p>
        </div>
        <Footer />
      </main>
    );
  }

  const isFav = isFavorited(tokenId);

  return (
    <main id="main-content" className="min-h-screen bg-background text-foreground flex flex-col">
      <Navigation activePage="nfts" />
      <div className="max-w-7xl mx-auto py-4 sm:py-6 flex-grow pt-24 sm:pt-28 pb-16 sm:pb-20 px-6 sm:px-8 md:px-12 lg:px-16 xl:px-20 2xl:px-24">
        <div className="flex items-center justify-between mb-8 sm:mb-10">
          <Link
            href="/nfts"
            className="inline-flex items-center text-neutral-400 hover:text-[#ff0099] text-sm transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to collection
          </Link>

          {/* Navigation Arrows */}
          <div className="flex items-center gap-3">
            {navigationTokens.prev !== null && (
              <Link
                href={`/nft/${navigationTokens.prev}`}
                className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-neutral-800 hover:bg-[#171717] text-neutral-400 hover:text-[#ff0099] transition-colors border border-neutral-700 hover:border-[#ff0099]"
                title={`Previous NFT #${navigationTokens.prev + 1}`}
              >
                <ChevronLeft className="h-5 w-5" />
              </Link>
            )}
            
            <span className="text-sm text-neutral-500 px-2">
              {parseInt(tokenId) + 1} of {TOTAL_COLLECTION_SIZE}
            </span>
            
            {navigationTokens.next !== null && (
              <Link
                href={`/nft/${navigationTokens.next}`}
                className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-neutral-800 hover:bg-[#171717] text-neutral-400 hover:text-[#ff0099] transition-colors border border-neutral-700 hover:border-[#ff0099]"
                title={`Next NFT #${navigationTokens.next + 1}`}
              >
                <ChevronRight className="h-5 w-5" />
              </Link>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 xl:gap-16">
          {/* Left Column - Image */}
          <div className="space-y-6 order-1 lg:order-1">
            {/* NFT Image Card */}
            <div className="relative" style={{ aspectRatio: "2700/3000" }}>
              <div className="relative w-full h-full">
                <MediaRenderer
                  client={client}
                  src={imageUrl}
                  alt={metadata?.name || `SATOSHE SLUGGER #${parseInt(tokenId) + 1}`}
                  width="100%"
                  height="100%"
                  className="w-full h-full object-contain"
                />
              </div>
            </div>


            {/* IPFS Links - CID Information */}
            <div className="space-y-3">
                <a
                  href={metadata?.merged_data?.metadata_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between w-full px-4 py-3 bg-neutral-800 hover:bg-[#171717] border border-neutral-600 rounded transition-colors group focus:ring-2 focus:ring-green-500 focus:outline-none"
                  aria-label="View token metadata on IPFS"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: COLORS.hair + '20' }}>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        style={{ color: COLORS.hair }}
                        aria-hidden="true"
                      >
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                        <polyline points="14,2 14,8 20,8"></polyline>
                        <line x1="16" y1="13" x2="8" y2="13"></line>
                        <line x1="16" y1="17" x2="8" y2="17"></line>
                        <polyline points="10,9 9,9 8,9"></polyline>
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm font-medium" style={{ color: COLORS.hair }}>Token URI</p>
                      <p className="text-xs text-neutral-400">View metadata on IPFS</p>
                    </div>
                  </div>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-neutral-400 group-hover:text-green-500 transition-colors"
                    aria-hidden="true"
                  >
                    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                    <polyline points="15 3 21 3 21 9"></polyline>
                    <line x1="10" y1="14" x2="21" y2="3"></line>
                  </svg>
                </a>

                <a
                  href={metadata?.merged_data?.media_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between w-full px-4 py-3 bg-neutral-800 hover:bg-[#171717] border border-neutral-600 rounded transition-colors group focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  aria-label="View NFT image on IPFS"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: COLORS.background + '20' }}>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        style={{ color: COLORS.background }}
                        aria-hidden="true"
                      >
                        <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                        <circle cx="8.5" cy="8.5" r="1.5"></circle>
                        <polyline points="21,15 16,10 5,21"></polyline>
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm font-medium" style={{ color: COLORS.background }}>Media URI</p>
                      <p className="text-xs text-neutral-400">View image on IPFS</p>
                    </div>
                  </div>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-neutral-400 group-hover:text-blue-500 transition-colors"
                    aria-hidden="true"
                  >
                    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                    <polyline points="15 3 21 3 21 9"></polyline>
                    <line x1="10" y1="14" x2="21" y2="3"></line>
                  </svg>
                </a>
              </div>

            {/* Attributes - 3 rows, 2 columns */}
            <div className="bg-neutral-800 p-4 rounded border border-neutral-700">
              <h3 className="text-lg font-semibold mb-4 text-off-white">Attributes</h3>
              <div className="grid grid-cols-2 gap-3">
                {attributes.map((attr: { name: string; value: string; percentage?: number; occurrence?: number }, index: number) => (
                  <div key={index} className="bg-neutral-900 p-3 rounded border border-neutral-700">
                    <div className="flex items-center mb-2">
                      <div
                        className="w-3 h-3 rounded-full mr-2"
                        style={{ backgroundColor: getColorForAttribute(attr.name) }}
                      ></div>
                      <span className="text-xs text-neutral-400">{attr.name}</span>
                    </div>
                    <div className="text-sm font-medium text-off-white mb-1">{attr.value}</div>
                    <div className="text-xs text-neutral-400">
                      {attr.percentage}% • {attr.occurrence} of {TOTAL_COLLECTION_SIZE}
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Right Column - NFT Details */}
          <div className="space-y-6 order-2 lg:order-2">
            {/* NFT Name with Heart Icon */}
            <div className="flex items-start justify-between gap-4">
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-semibold leading-tight text-off-white">
                {metadata?.name || `Satoshe Slugger #${parseInt(tokenId) + 1}`}
              </h1>
              <button
                onClick={handleFavoriteToggle}
                className={`p-2 rounded-full hover:bg-neutral-800 transition-colors ${
                  isFav
                    ? "text-brand-pink fill-brand-pink"
                    : "text-neutral-400 hover:text-brand-pink"
                }`}
                aria-label={isFav ? "Remove from favorites" : "Add to favorites"}
              >
                <Heart
                  className={`w-6 h-6 transition-colors cursor-pointer ${
                    isFav
                      ? "text-[#ff0099] fill-[#ff0099]"
                      : "text-neutral-400 hover:text-[#ff0099]"
                  }`}
                />
              </button>
            </div>

            {/* Buy Now Section - Simplified */}
            {isForSale ? (
              <div className="bg-neutral-800 p-4 rounded border border-neutral-700">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-blue-500 mb-1">Buy Now Price</p>
                    <p className="text-2xl font-bold text-blue-500">
                      {priceEth} ETH
                    </p>
                    {transactionState === 'pending' && (
                      <p className="text-xs text-yellow-400 mt-1">
                        ⏳ Transaction pending... Please wait for confirmation.
                      </p>
                    )}
                  </div>
                  <BuyDirectListingButton
                    contractAddress={process.env.NEXT_PUBLIC_MARKETPLACE_ADDRESS!}
                    client={client}
                    chain={base}
                    listingId={BigInt(listingId)}
                    quantity={1n}
                    onTransactionSent={handleTransactionPending}
                    onTransactionConfirmed={handleTransactionSuccess}
                    onError={handleTransactionError}
                    className="px-6 py-3 font-bold transition-all duration-500 ease-out focus:ring-2 focus:ring-offset-2 text-white rounded-sm disabled:opacity-50 disabled:cursor-not-allowed hover:!bg-blue-700"
                    style={{
                      backgroundColor: transactionState === 'pending' ? "#6B7280" : "#3B82F6",
                      color: "white",
                      borderColor: transactionState === 'pending' ? "#6B7280" : "#3B82F6",
                      borderRadius: "2px"
                    }}
                  >
                    {transactionState === 'pending' ? 'PROCESSING...' : 'BUY NOW'}
                  </BuyDirectListingButton>
                </div>
              </div>
            ) : isPurchased ? (
              <div className="bg-neutral-800 p-4 rounded border border-neutral-700">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-green-500 mb-1">Sold At</p>
                    <p className="text-2xl font-bold text-green-500">
                      {priceEth} ETH
                    </p>
                  </div>
                  <Link
                    href={`https://opensea.io/assets/base/${process.env.NEXT_PUBLIC_NFT_CONTRACT_ADDRESS}/${tokenId}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-6 py-3 font-bold transition-colors duration-300 ease-in-out focus:ring-2 focus:ring-offset-2 bg-green-500 hover:bg-green-700 text-white rounded-sm flex items-center gap-2"
                    style={{
                      backgroundColor: "#10B981",
                      color: "white",
                      borderColor: "#10B981",
                      borderRadius: "2px"
                    }}
                  >
                    View My NFT
                    <ExternalLink className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            ) : (
              <div className="bg-neutral-800 p-4 rounded border border-neutral-700">
                <p className="text-blue-400 text-center">This NFT is not currently for sale</p>
              </div>
            )}

            {/* Error Message */}
            {transactionState === 'error' && transactionError && (
              <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                <div className="bg-neutral-800 p-8 rounded-lg border border-red-500/50 text-center max-w-md mx-4">
                  <div className="text-6xl mb-4">❌</div>
                  <h3 className="text-2xl font-bold text-red-400 mb-2">Transaction Failed</h3>
                  <p className="text-neutral-300 mb-4">
                    {transactionError}
                  </p>
                  <p className="text-sm text-neutral-400">
                    This message will disappear in a few seconds...
                  </p>
                </div>
              </div>
            )}

            {/* Success Message */}
            {showSuccess && (
              <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                <div className="bg-neutral-800 p-8 rounded-lg border border-neutral-700 text-center max-w-md mx-4">
                  <div className="text-6xl mb-4">🎉</div>
                  <h3 className="text-2xl font-bold text-green-400 mb-2">Purchase Successful!</h3>
                  <p className="text-neutral-300 mb-4">
                    You successfully purchased <strong>Satoshe Slugger #{parseInt(tokenId) + 1}</strong> for {priceEth} ETH!
                  </p>
                  <p className="text-sm text-neutral-400 mb-4">
                    Transaction confirmed on the blockchain.
                  </p>
                  <p className="text-xs text-neutral-500">
                    This message will disappear in a few seconds...
                  </p>
                </div>
              </div>
            )}



            {/* Additional Details */}
            <div className="bg-neutral-800 p-4 rounded border border-neutral-700">
              <h3 className="text-lg font-semibold mb-4 text-off-white">Collection Details</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-neutral-400 mb-1">NFT Number</p>
                  <p className="font-normal text-off-white">{metadata?.card_number ?? parseInt(tokenId) + 1}</p>
                </div>
                <div>
                  <p className="text-neutral-400 mb-1">Token ID</p>
                  <p className="font-normal text-off-white">{metadata?.token_id ?? parseInt(tokenId) - 1}</p>
                </div>
                <div>
                  <p className="text-neutral-400 mb-1">Collection</p>
                  <p className="font-normal text-off-white">
                    {metadata?.collection_number ?? "—"}
                  </p>
                </div>
                <div>
                  <p className="text-neutral-400 mb-1">Edition</p>
                  <p className="font-normal text-off-white">{metadata?.edition ?? "—"}</p>
                </div>
                <div>
                  <p className="text-neutral-400 mb-1">Series</p>
                  <p className="font-normal text-off-white">{metadata?.series ?? "—"}</p>
                </div>
                <div>
                  <p className="text-neutral-400 mb-1">Rarity Tier</p>
                  <p className="font-normal text-off-white">{metadata?.rarity_tier ?? "Unknown"}</p>
                </div>
                <div>
                  <p className="text-neutral-400 mb-1">Rarity Score</p>
                  <p className="font-normal text-off-white">{metadata?.rarity_score ?? "—"}</p>
                </div>
                <div>
                  <p className="text-neutral-400 mb-1">Rank</p>
                  <p className="font-normal text-off-white">{metadata?.rank ?? "—"} of {TOTAL_COLLECTION_SIZE}</p>
                </div>
                <div>
                  <p className="text-neutral-400 mb-1">Rarity Percentage</p>
                  <p className="font-normal text-off-white">{metadata?.rarity_percent ?? "—"}%</p>
                </div>
              </div>
            </div>

            {/* Artist and Platform - Two Column Layout */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="flex items-center justify-between w-full px-4 py-3 bg-neutral-800 hover:bg-[#171717] border border-neutral-600 rounded transition-colors group">
                <div className="flex items-center gap-3">
                  <Image
                    src="/brands/kristen-woerdeman/kwoerd-circular-offwhite-32.png"
                    alt="Kristen Woerdeman"
                    width={26}
                    height={26}
                    className="w-6 h-6"
                    sizes="26px"
                  />
                  <div>
                    <p className="text-sm font-medium text-off-white">Artist</p>
                    <p className="text-xs text-neutral-400">Kristen Woerdeman</p>
                  </div>
                </div>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-neutral-400 group-hover:text-[#ff0099] transition-colors"
                  aria-hidden="true"
                >
                  <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                  <polyline points="15 3 21 3 21 9"></polyline>
                  <line x1="10" y1="14" x2="21" y2="3"></line>
                </svg>
              </div>

              <div className="flex items-center justify-between w-full px-4 py-3 bg-neutral-800 hover:bg-[#171717] border border-neutral-600 rounded transition-colors group">
                <div className="flex items-center gap-3">
                  <Image
                    src="/brands/retinal-delights/retinal-delights-cicular-offwhite-32.png"
                    alt="Retinal Delights"
                    width={26}
                    height={26}
                    className="w-6 h-6"
                    sizes="26px"
                  />
                  <div>
                    <p className="text-sm font-medium text-off-white">Platform</p>
                    <p className="text-xs text-neutral-400">Retinal Delights</p>
                  </div>
                </div>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-neutral-400 group-hover:text-[#ff0099] transition-colors"
                  aria-hidden="true"
                >
                  <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                  <polyline points="15 3 21 3 21 9"></polyline>
                  <line x1="10" y1="14" x2="21" y2="3"></line>
                </svg>
              </div>
            </div>

            {/* Contract Details - Moved from Women's Baseball Card */}
            <div className="bg-neutral-800 p-4 rounded border border-neutral-700">
              <h3 className="text-lg font-semibold mb-4 text-off-white">Contract Details</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between items-center">
                    <span className="text-neutral-400">Contract Address</span>
                    <div className="flex items-center gap-2">
                      <span className="text-off-white">0xf167...1d9C</span>
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText('0xf167...1d9C');
                          // You could add a toast notification here if desired
                        }}
                        className="p-1 hover:bg-neutral-700 rounded transition-colors group"
                        aria-label="Copy contract address"
                        title="Copy contract address"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="text-neutral-400 group-hover:text-green-500 transition-colors"
                        >
                          <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                          <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                        </svg>
                      </button>
                    </div>
                  </div>
                  <Separator className="bg-neutral-600" />
                  <div className="flex justify-between items-center">
                    <span className="text-neutral-400">Token ID</span>
                    <span className="text-off-white">{metadata?.token_id ?? tokenId}</span>
                  </div>
                  <Separator className="bg-neutral-600" />
                  <div className="flex justify-between items-center">
                    <span className="text-neutral-400">Token Standard</span>
                    <span className="text-off-white">ERC-721</span>
                  </div>
                  <Separator className="bg-neutral-600" />
                  <div className="flex justify-between items-center">
                    <span className="text-neutral-400">Blockchain</span>
                    <span className="text-off-white">Base</span>
                  </div>
                </div>
            </div>

            {/* Rarity Distribution - Right Side, No Box */}
            <h3 className="text-lg font-semibold mb-4 text-off-white">Rarity Distribution</h3>
            {attributes.length > 0 ? (
              <AttributeRarityChart
                attributes={attributes.map((attr: { name: string; value: string; percentage?: number; occurrence?: number }) => ({
                  name: attr.name,
                  value: attr.value,
                  percentage: attr.percentage || 0,
                  occurrence: attr.occurrence,
                  color: getColorForAttribute(attr.name)
                }))}
                overallRarity={metadata?.rarity_percent || "93.5"}
              />
            ) : (
              <div className="text-center py-8">
                <p className="text-neutral-400">No attributes available for rarity distribution</p>
                <p className="text-xs text-neutral-500 mt-2">Attributes count: {attributes.length}</p>
                <p className="text-xs text-neutral-500 mt-1">Metadata: {metadata ? 'Loaded' : 'Not loaded'}</p>
              </div>
            )}



          </div>
        </div>

      </div>

      <Footer />
    </main>
  );
}
