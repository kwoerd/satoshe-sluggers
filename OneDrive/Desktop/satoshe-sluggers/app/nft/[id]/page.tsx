"use client";

import { useState, useEffect, useMemo } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Heart, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import Footer from "@/components/footer";
import Navigation from "@/components/navigation";
import AttributeRarityChart from "@/components/attribute-rarity-chart";
import { MediaRenderer, TransactionButton, useSendTransaction, useActiveAccount } from "thirdweb/react";
import { buyFromListing } from "thirdweb/extensions/marketplace";
import { marketplace } from "../../../lib/contracts";
import { client } from "../../../lib/thirdweb";
import { useFavorites } from "@/hooks/useFavorites";
import { getNFTByTokenId } from "@/lib/data-service";
// import { track } from '@vercel/analytics';

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
  const [metadata, setMetadata] = useState<any>(null);
  const [imageUrl, setImageUrl] = useState<string>("/media/nfts/placeholder-nft.webp");
  const [isLoading, setIsLoading] = useState(true);
  const [completeMetadata, setCompleteMetadata] = useState<any[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [navigationTokens, setNavigationTokens] = useState<{prev: number | null, next: number | null}>({prev: null, next: null});
  
  const account = useActiveAccount();
  const { isFavorited, toggleFavorite, isConnected } = useFavorites();
  const { mutate: sendBuy } = useSendTransaction();

  // Calculate navigation tokens (previous and next)
  useEffect(() => {
    const currentTokenId = parseInt(tokenId);
    const prevToken = currentTokenId > 0 ? currentTokenId - 1 : null;
    const nextToken = currentTokenId < 7776 ? currentTokenId + 1 : null; // 7777 total NFTs (0-7776)
    
    setNavigationTokens({
      prev: prevToken,
      next: nextToken
    });
  }, [tokenId]);

  // Load NFT metadata
  useEffect(() => {
    setIsLoading(true);
    console.log("Starting data load for token:", tokenId);

    // Set a timeout to prevent infinite loading
    const timeoutId = setTimeout(() => {
      console.log("Data loading timeout - forcing loading to false");
      setIsLoading(false);
    }, 10000); // 10 second timeout

    // Load NFT data using data service
    getNFTByTokenId(tokenId)
      .then((nftData: any) => {
        console.log("NFT data loaded:", nftData);
        
        if (nftData) {
          setMetadata(nftData);
          
          // Set image URL from metadata
          const mediaUrl = nftData.merged_data?.media_url || nftData.media_url;
          if (mediaUrl) {
            console.log("Setting image URL:", mediaUrl);
            setImageUrl(mediaUrl);
          } else {
            console.log("Using fallback image");
            setImageUrl("/nfts/placeholder-nft.webp");
          }
        } else {
          console.log("No NFT found for tokenId:", tokenId);
          setMetadata(null);
          setImageUrl("/nfts/placeholder-nft.webp");
        }
        console.log("Setting isLoading to false");
        clearTimeout(timeoutId);
        setIsLoading(false);
      })
      .catch((error: any) => {
        console.error(`[NFT Detail] Error loading data for token ${tokenId}:`, error);
        setMetadata(null);
        setImageUrl("/nfts/placeholder-nft.webp");
        clearTimeout(timeoutId);
        setIsLoading(false);
      });

    // Cleanup timeout on unmount
    return () => clearTimeout(timeoutId);
  }, [tokenId]);

  const attributes = useMemo(() => {
    // Use real attributes from complete metadata
    if (metadata && metadata.attributes) {
      const mappedAttributes = metadata.attributes.map((attr: any) => ({
        name: attr.trait_type,
        value: attr.value,
        percentage: attr.rarity,
        occurrence: attr.occurrence
      }));
      console.log("Mapped attributes:", mappedAttributes);
      return mappedAttributes;
    }
    console.log("No attributes found in metadata:", metadata);
    return [];
  }, [metadata]);

  // Get pricing data from metadata
  const priceEth = metadata?.merged_data?.price_eth || 0;
  const listingId = metadata?.merged_data?.listing_id || 0;
  const isForSale = priceEth > 0 && listingId;
  
  // Check if this is a test NFT (token IDs 0-9)
  const isTestNFT = parseInt(tokenId) >= 0 && parseInt(tokenId) <= 9;

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

  // Transaction function for buying NFT
  const createBuyTransaction = () => {
    if (!account?.address) {
      throw new Error("Please connect your wallet first");
    }

    if (!isForSale || listingId === 0) {
      throw new Error("This NFT is not available for purchase");
    }

    return buyFromListing({
      contract: marketplace,
      listingId: BigInt(listingId),
      quantity: 1n,
      recipient: account.address,
    });
  };

  // Handle copy contract address to clipboard
  const handleCopyAddress = async () => {
    const fullAddress = "0x53b062474eF48FD1aE6798f9982c58Ec0267c2Fc"; // NFT Contract address
    try {
      await navigator.clipboard.writeText(fullAddress);
      alert("Contract address copied to clipboard!");
    } catch (err) {
      console.error('Failed to copy: ', err);
      alert("Failed to copy address. Please try again.");
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
    <main className="min-h-screen bg-background text-foreground flex flex-col">
      <Navigation activePage="nfts" />
      <div className="max-w-7xl mx-auto py-4 sm:py-6 flex-grow pt-24 sm:pt-28 pb-16 sm:pb-20 px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16">
        <div className="flex items-center justify-between mb-8 sm:mb-10 px-2 sm:px-4">
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
                className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-neutral-800 hover:bg-neutral-700 text-neutral-400 hover:text-[#ff0099] transition-colors border border-neutral-700 hover:border-[#ff0099]"
                title={`Previous NFT #${navigationTokens.prev + 1}`}
              >
                <ChevronLeft className="h-5 w-5" />
              </Link>
            )}
            
            <span className="text-sm text-neutral-500 px-2">
              {parseInt(tokenId) + 1} of 7777
            </span>
            
            {navigationTokens.next !== null && (
              <Link
                href={`/nft/${navigationTokens.next}`}
                className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-neutral-800 hover:bg-neutral-700 text-neutral-400 hover:text-[#ff0099] transition-colors border border-neutral-700 hover:border-[#ff0099]"
                title={`Next NFT #${navigationTokens.next + 1}`}
              >
                <ChevronRight className="h-5 w-5" />
              </Link>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 xl:gap-12">
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

            {/* IPFS Links - Hidden for test NFTs */}
            {!isTestNFT && (
              <div className="space-y-3">
                <a
                  href={metadata?.merged_data?.metadata_url}
                  target="_blank"
                  rel="noopener noreferrer"
                    className="flex items-center justify-between w-full px-4 py-3 bg-neutral-800 hover:bg-neutral-700 border border-neutral-600 rounded transition-colors group focus:ring-2 focus:ring-green-500 focus:outline-none"
                  aria-label="View token metadata on IPFS"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded flex items-center justify-center" style={{ backgroundColor: COLORS.hair + '20' }}>
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
                    className="flex items-center justify-between w-full px-4 py-3 bg-neutral-800 hover:bg-neutral-700 border border-neutral-600 rounded transition-colors group focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  aria-label="View NFT image on IPFS"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded flex items-center justify-center" style={{ backgroundColor: COLORS.background + '20' }}>
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
            )}

          </div>

          {/* Right Column - NFT Details */}
          <div className="space-y-6 -mt-2 order-2 lg:order-2">
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

            {/* Price Information - Direct Listing Style */}
            {isForSale ? (
              <div className="space-y-4">
                {/* Buy Now Price */}
                <div className="bg-neutral-800 p-4 rounded border border-neutral-700">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm mb-1" style={{ color: COLORS.background }}>Buy Now Price</p>
                      <p className="text-lg sm:text-xl font-semibold" style={{ color: COLORS.background }}>
                        {priceEth} ETH
                      </p>
                    </div>
                    <TransactionButton
                      transaction={createBuyTransaction}
                      onTransactionConfirmed={() => {
                        // track('NFT Buy Now Clicked', {
                        //   tokenId,
                        //   buyNowPrice: priceEth.toString(),
                        //   rarity: metadata.rarity_tier,
                        //   rank: String(metadata.rank),
                        //   listingId: String(listingId),
                        // });
                        alert(`NFT purchased successfully for ${priceEth} ETH!`);
                      }}
                      onError={(error) => {
                        console.error("Buy now failed:", error);
                        alert(error.message || "Failed to buy NFT. Please try again.");
                      }}
                      className="w-32 px-6 h-10 font-bold transition-colors duration-300 ease-in-out focus:ring-2 focus:ring-offset-2 hover:bg-blue-600 rounded"
                      style={{
                        color: "#fffbeb",
                        backgroundColor: COLORS.background,
                        borderColor: COLORS.background,
                        borderRadius: "6px"
                      }}
                    >
                      BUY NOW
                    </TransactionButton>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-neutral-800 p-4 rounded border border-neutral-700">
                <p className="text-neutral-500 text-center">This NFT is not currently for sale</p>
              </div>
            )}

            {/* Additional Details */}
            <div className="bg-neutral-800 p-4 rounded border border-neutral-700">
              <h3 className="text-lg font-semibold mb-4 text-off-white">Details</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-neutral-400 mb-1">NFT Number</p>
                  <p className="font-normal text-off-white">{metadata?.card_number ?? parseInt(tokenId) + 1}</p>
                </div>
                <div>
                  <p className="text-neutral-400 mb-1">Token ID</p>
                  <p className="font-normal text-off-white">{metadata?.token_id ?? tokenId}</p>
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
                  <p className="font-normal text-off-white">{metadata?.rank ?? "—"} of 7777</p>
                </div>
                <div>
                  <p className="text-neutral-400 mb-1">Rarity Percentage</p>
                  <p className="font-normal text-off-white">{metadata?.rarity_percent ?? "—"}%</p>
                </div>
              </div>
            </div>

            {/* Artist and Platform Cards - Moved from Left Column */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-neutral-800 p-4 rounded border border-neutral-700">
                <p className="text-neutral-400 text-sm mb-2">Artist</p>
                <div className="flex items-center">
                  <Image
                    src="/brands/kristen-woerdeman/kwoerd-circular-offwhite-32.png"
                    alt="Kristen Woerdeman"
                    width={26}
                    height={26}
                    className="w-6 h-6 mr-2"
                    sizes="26px"
                  />
                  <a 
                    href="https://kristenwertiman.com" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center text-sm text-off-white hover:text-[#FF0099] transition-colors group"
                  >
                    <span>{metadata?.artist || "Kristen Woerdeman"}</span>
                    <svg className="w-4 h-4 ml-2 text-neutral-400 group-hover:text-[#FF0099] transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </a>
                </div>
              </div>
              <div className="bg-neutral-800 p-4 rounded border border-neutral-700">
                <p className="text-neutral-400 text-sm mb-2">Platform</p>
                <div className="flex items-center">
                  <Image
                    src="/brands/retinal-delights/retinal-delights-cicular-offwhite-32.png"
                    alt="Retinal Delights"
                    width={26}
                    height={26}
                    className="w-6 h-6 mr-2"
                    sizes="26px"
                  />
                  <a 
                    href="https://retinaldelights.io" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center text-sm text-off-white hover:text-[#FF0099] transition-colors group"
                  >
                    <span>{metadata?.platform || "Retinal Delights"}</span>
                    <svg className="w-4 h-4 ml-2 text-neutral-400 group-hover:text-[#FF0099] transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </a>
                </div>
              </div>
            </div>

            {/* Contract Details Section - Without Tabs */}
            <div className="bg-neutral-800 p-4 rounded border border-neutral-700">
              
              <div className="space-y-2">
                <div className="flex justify-between py-2 border-b border-neutral-700">
                  <span className="text-neutral-400 text-sm">Contract Address</span>
                  <button
                    onClick={handleCopyAddress}
                    className="text-sm hover:text-blue-400 transition-colors cursor-pointer text-off-white"
                    title="Click to copy full address to clipboard"
                  >
                    0x....7c2Fc
                  </button>
                </div>
                <div className="flex justify-between py-2 border-b border-neutral-700">
                  <span className="text-neutral-400 text-sm">Token ID</span>
                  <span className="text-sm text-off-white">{metadata?.token_id ?? tokenId}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-neutral-700">
                  <span className="text-neutral-400 text-sm">Token Standard</span>
                  <span className="text-sm text-off-white">ERC-721</span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-neutral-400 text-sm">Blockchain</span>
                  <span className="text-sm text-off-white">Base</span>
                </div>
              </div>
            </div>

            {/* IPFS Links Section */}
            <div className="bg-neutral-800 p-4 rounded border border-neutral-700">
              <h3 className="text-lg font-semibold mb-4 text-off-white">IPFS Links</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between py-2 border-b border-neutral-700">
                  <div className="flex items-center">
                    <svg className="w-5 h-5 mr-3 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <span className="text-sm text-off-white">View metadata on IPFS</span>
                  </div>
                  <a
                    href={metadata?.merged_data?.metadata_url || `https://ipfs.io/ipfs/QmNMFNLD6U5xHcgzgBf6kBabwS54JyLTuPbtqcHp7wtUXR/${tokenId}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-400 hover:text-blue-300 transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </a>
                </div>
                <div className="flex items-center justify-between py-2">
                  <div className="flex items-center">
                    <svg className="w-5 h-5 mr-3 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span className="text-sm text-off-white">View image on IPFS</span>
                  </div>
                  <a
                    href={metadata?.merged_data?.media_url || `https://ipfs.io/ipfs/QmVgSHzcYzUGSZHNTRTQYjSRG3rbMkGBnzpxfxkpRokiTW/${tokenId}.webp`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-400 hover:text-blue-300 transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </a>
                </div>
              </div>
            </div>

            {/* Description and Sales History Tabs */}
            <div className="bg-neutral-800 rounded border border-neutral-700">
              <Tabs defaultValue="description" className="w-full">
                <TabsList className="grid w-full grid-cols-2 bg-neutral-900">
                  <TabsTrigger value="description" className="data-[state=active]:bg-neutral-800">Description</TabsTrigger>
                  <TabsTrigger value="sales" className="data-[state=active]:bg-neutral-800">Sales History</TabsTrigger>
                </TabsList>
                <TabsContent value="description" className="p-4">
                  <div className="space-y-3">
                    <h4 className="text-lg font-semibold text-off-white">{metadata?.description || "Women's Baseball Card"}</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-neutral-400">Contract Address</span>
                        <span className="text-off-white font-mono">0xf167...1d9C</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-neutral-400">Token ID</span>
                        <span className="text-off-white">{metadata?.token_id ?? tokenId}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-neutral-400">Token Standard</span>
                        <span className="text-off-white">ERC-721</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-neutral-400">Blockchain</span>
                        <span className="text-off-white">Base</span>
                      </div>
                    </div>
                  </div>
                </TabsContent>
                <TabsContent value="sales" className="p-4">
                  <div className="text-center text-neutral-400">
                    <p>No sales history available</p>
                  </div>
                </TabsContent>
              </Tabs>
            </div>

          </div>
        </div>

        {/* Individual Attributes Section */}
        <div className="bg-neutral-800 p-6 rounded border border-neutral-700">
          <h3 className="text-xl font-semibold mb-6 text-off-white">Attributes</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {attributes.map((attr: any, index: number) => (
              <div key={index} className="bg-neutral-900 p-4 rounded border border-neutral-700">
                <div className="flex items-center mb-2">
                  <div 
                    className="w-3 h-3 rounded-full mr-3" 
                    style={{ backgroundColor: getColorForAttribute(attr.name) }}
                  ></div>
                  <span className="text-sm text-neutral-400">{attr.name}</span>
                </div>
                <div className="text-lg font-semibold text-off-white mb-1">{attr.value}</div>
                <div className="text-sm text-neutral-400">
                  {attr.percentage}% • {attr.occurrence} of 7777
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Combined Attributes & Rarity Distribution - Spans both columns */}
        <AttributeRarityChart 
          attributes={attributes.map((attr: any) => ({
            name: attr.name,
            value: attr.value,
            percentage: attr.percentage,
            occurrence: attr.occurrence,
            color: getColorForAttribute(attr.name)
          }))}
        />
      </div>

      <Footer />
    </main>
  );
}
