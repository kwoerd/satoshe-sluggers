"use client";

import { useState, useEffect, useMemo } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Heart, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import AttributeRarityChart from "@/components/attribute-rarity-chart";
import Footer from "@/components/footer";
import Navigation from "@/components/navigation";
import { MediaRenderer } from "thirdweb/react";
import {
  useReadContract,
  useSendTransaction,
  useActiveAccount,
} from "thirdweb/react";
import {
  nftCollection,
  marketplace,
} from "@/lib/contracts";
import { getListing, buyFromListing } from "thirdweb/extensions/marketplace";
import { client } from "@/lib/thirdweb";
import { useFavorites } from "@/hooks/useFavorites";
import { ownerOf } from "thirdweb/extensions/erc721";
import { triggerPurchaseConfetti } from "@/lib/confetti";

const METADATA_URL = "/docs/combined_metadata.json";

// Consistent color scheme
const COLORS = {
  background: "#3B82F6", // blue
  skinTone: "#F59E0B", // yellow/orange
  shirt: "#EF4444", // red
  hair: "#10B981", // green
  eyewear: "#06B6D4", // teal/cyan
  headwear: "#A855F7", // purple
  accent: "#EC4899", // hot pink
  neutral: {
    100: "#F5F5F5",
    400: "#A3A3A3",
    600: "#525252",
    700: "#404040",
    800: "#262626",
    900: "#171717",
  }
};

const DEFAULT_PRICE = 0.05; // ETH

// Helper function to get IPFS URLs
function getIPFSUrls(tokenId: string) {
  return {
    metadataUrl: `https://ipfs.io/ipfs/QmNjwSdgNhRSTfXu34kEwyLVvvMcFVuYKzsmB4zUsgsibQ/${tokenId}`,
    mediaUrl: `https://ipfs.io/ipfs/QmPBBAsMUPtDLcw1PEunB779B8dsg9gxpdwHXrAkLnWwUD/${tokenId}.webp`
  };
}

// Helper to format price
function formatPrice(priceWei: string | number | bigint) {
  if (!priceWei || priceWei === "0") return "0";
  try {
    const price = Number(priceWei) / 1e18;
    return price.toString();
  } catch {
    return "0";
  }
}

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
  return colorMap[attributeName] || COLORS.neutral[400];
}

export default function NFTDetailPage() {
  const params = useParams<{ id: string }>();
  const tokenId = params.id;
  const [metadata, setMetadata] = useState<{
    name?: string;
    description?: string;
    price_eth?: number;
    attributes?: Array<{ trait_type: string; value: string }>;
    [key: string]: unknown;
  } | null>(null);
  const [imageUrl, setImageUrl] = useState<string>("/placeholder-nft.webp");
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showPurchaseModal, setShowPurchaseModal] = useState(false);

  const account = useActiveAccount();
  const { isFavorited, toggleFavorite, isConnected } = useFavorites();
  const { mutate: sendTransaction } = useSendTransaction();

  // Get current owner of the NFT
  const { data: currentOwner } = useReadContract(ownerOf, {
    contract: nftCollection,
    tokenId: BigInt(tokenId),
  });

  // Get listing data
  const [listingData, setListingData] = useState<{
    id: bigint;
    tokenId: bigint;
    price: bigint;
    currencyContractAddress: string;
    status: string;
    [key: string]: unknown;
  } | null>(null);
  const [isLoadingListing, setIsLoadingListing] = useState(true);

  useEffect(() => {
    console.log(`[NFT Detail] Loading data for token ID: ${tokenId}`);
    setIsLoading(true);

    fetch(METADATA_URL)
      .then((r) => r.json())
      .then((metaDataArr: Array<{ token_id?: number; [key: string]: unknown }>) => {
        const found = metaDataArr.find((item) =>
          item.token_id?.toString() === tokenId
        );

        if (found) {
          setMetadata(found);
          const ipfsUrls = getIPFSUrls(tokenId);
          setImageUrl(ipfsUrls.mediaUrl);
        } else {
          setMetadata(null);
          setImageUrl("/placeholder-nft.webp");
        }
        setIsLoading(false);
      })
      .catch((error) => {
        console.error(`[NFT Detail] Error loading data:`, error);
        setMetadata(null);
        setIsLoading(false);
      });
  }, [tokenId]);

  // Fetch listing data
  const fetchListingData = async () => {
    try {
      setIsLoadingListing(true);
      const listing = await getListing({
        contract: marketplace,
        listingId: BigInt(tokenId),
      });

      if (listing) {
        setListingData({
          id: listing.id,
          tokenId: listing.tokenId,
          price: listing.pricePerToken,
          currencyContractAddress: listing.currencyContractAddress,
          status: listing.status,
        });
      } else {
        setListingData(null);
      }
    } catch (error) {
      console.error(`[NFT Detail] Error fetching listing:`, error);
      setListingData(null);
    } finally {
      setIsLoadingListing(false);
    }
  };

  useEffect(() => {
    fetchListingData();
  }, [tokenId]);

  const attributes = useMemo(() => {
    if (metadata && Array.isArray(metadata.attributes)) {
      return metadata.attributes.map((attr, index: number) => {
        const displayPercentages = [10.84, 16.29, 14.58, 2.65, 81.75, 6.51];
        return {
          name: attr.trait_type || "Unknown",
          value: attr.value || "—",
          percentage: displayPercentages[index] || 0,
          occurrence: 0,
        };
      });
    }
    return [];
  }, [metadata]);

  // Get price from metadata
  const nftPrice = metadata?.price_eth || DEFAULT_PRICE;
  const listingPrice = nftPrice.toString();
  
  // NFT is for sale if it has a price and a listing
  const isForSale = nftPrice > 0;

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
        rarity: (metadata.rarity_tier as string) || "Unknown",
        rank: (metadata.rank as string) || "—",
        rarityPercent: (metadata.rarity_percent as string) || "—",
      });
    }
  };

  // Handle purchase
  const handlePurchase = async () => {
    if (!account?.address) {
      alert("Please connect your wallet first");
      return;
    }

    if (!isForSale) {
      alert("This NFT is not for sale!");
      return;
    }

    setIsProcessing(true);
    try {
      const listing = listingData;
      if (!listing) {
        alert("No active listing found for this NFT");
        setIsProcessing(false);
        return;
      }

      const tx = buyFromListing({
        contract: marketplace,
        listingId: listing.id,
        quantity: 1n,
        recipient: account.address,
      });

      await new Promise((resolve, reject) => {
        sendTransaction(tx, {
          onSuccess: () => {
            fetchListingData();
            // Trigger confetti celebration on successful purchase
            triggerPurchaseConfetti();
            resolve(true);
          },
          onError: reject,
        });
      });

      alert(`NFT purchased successfully for ${listingPrice} ETH! 🎉`);
    } catch (error) {
      console.error("Error purchasing NFT:", error);
      alert("Failed to purchase NFT. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  // Handle copy contract address
  const handleCopyAddress = async () => {
    const fullAddress = nftCollection.address;
    try {
      await navigator.clipboard.writeText(fullAddress);
      alert("Contract address copied to clipboard!");
    } catch (err) {
      console.error('Failed to copy: ', err);
      alert("Failed to copy address. Please try again.");
    }
  };

  const salesHistory: Array<{ date: string; price: string; buyer: string }> = [];

  if (isLoading) {
    return (
      <main className="min-h-screen bg-background text-foreground flex flex-col">
        <Navigation activePage="nfts" />
        <div className="flex-grow flex flex-col items-center justify-center pt-24 sm:pt-28">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2" style={{ borderTopColor: COLORS.background, borderBottomColor: COLORS.background }}></div>
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

  const handlePrevious = () => {
    const prevId = parseInt(tokenId) - 1;
    if (prevId >= 0) {
      window.location.href = `/nft/${prevId}`;
    }
  };

  const handleNext = () => {
    const nextId = parseInt(tokenId) + 1;
    if (nextId < 7777) {
      window.location.href = `/nft/${nextId}`;
    }
  };

  const hasPrevious = parseInt(tokenId) > 0;
  const hasNext = parseInt(tokenId) < 7776;

  return (
    <main className="min-h-screen bg-background text-foreground flex flex-col">
      <Navigation activePage="nfts" />
      
      {/* Previous NFT Button */}
      {hasPrevious && (
        <button
          onClick={handlePrevious}
          className="fixed left-2 sm:left-4 top-1/2 -translate-y-1/2 z-40 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-neutral-800/90 backdrop-blur-md border border-neutral-700 hover:bg-[hsl(0,0%,4%)] hover:border-[#ff0099]/50 transition-all duration-200 flex items-center justify-center group"
          aria-label="Previous NFT"
        >
          <svg 
            className="w-5 h-5 sm:w-6 sm:h-6 text-neutral-400 group-hover:text-[#ff0099] transition-colors" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
      )}

      {/* Next NFT Button */}
      {hasNext && (
        <button
          onClick={handleNext}
          className="fixed right-2 sm:right-4 top-1/2 -translate-y-1/2 z-40 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-neutral-800/90 backdrop-blur-md border border-neutral-700 hover:bg-[hsl(0,0%,4%)] hover:border-[#ff0099]/50 transition-all duration-200 flex items-center justify-center group"
          aria-label="Next NFT"
        >
          <svg 
            className="w-5 h-5 sm:w-6 sm:h-6 text-neutral-400 group-hover:text-[#ff0099] transition-colors" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 flex-grow pt-24 sm:pt-28 relative">
        <Link
          href="/nfts"
          className="inline-flex items-center text-neutral-400 hover:text-neutral-100 mb-4 sm:mb-6 text-sm"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to collection
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6 xl:gap-8">
          {/* Left Column */}
          <div className="space-y-4">
            {/* NFT Image */}
            <div className="relative w-full" style={{ aspectRatio: "2700/3000" }}>
              <MediaRenderer
                client={client}
                src={imageUrl}
                alt={metadata?.name || `SATOSHE SLUGGER #${parseInt(tokenId) + 1}`}
                width="100%"
                height="100%"
                className="w-full h-full object-contain rounded-lg"
              />
            </div>

            {/* Token URI */}
            <div className="bg-neutral-800 p-4 rounded-sm border border-neutral-700 group hover:bg-neutral-700/50 transition-all duration-200">
              <a 
                href={`https://ipfs.io/ipfs/QmNjwSdgNhRSTfXu34kEwyLVvvMcFVuYKzsmB4zUsgsibQ/${tokenId}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between gap-3 cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-emerald-500/20 group-hover:bg-emerald-500/30 flex items-center justify-center flex-shrink-0 transition-all duration-200 group-hover:scale-110">
                    <svg className="w-5 h-5 text-emerald-500 group-hover:text-emerald-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-normal text-emerald-500 group-hover:text-emerald-400 transition-colors">Token URI</p>
                    <p className="text-xs text-neutral-400 group-hover:text-neutral-300 transition-colors">View metadata on IPFS</p>
                  </div>
                </div>
                <svg className="w-4 h-4 text-neutral-400 group-hover:text-emerald-500 group-hover:translate-x-1 transition-all duration-200 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
            </div>

            {/* Media URI */}
            <div className="bg-neutral-800 p-4 rounded-sm border border-neutral-700 group hover:bg-neutral-700/50 transition-all duration-200">
              <a 
                href={`https://ipfs.io/ipfs/QmPBBAsMUPtDLcw1PEunB779B8dsg9gxpdwHXrAkLnWwUD/${tokenId}.webp`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between gap-3 cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-blue-500/20 group-hover:bg-blue-500/30 flex items-center justify-center flex-shrink-0 transition-all duration-200 group-hover:scale-110">
                    <svg className="w-5 h-5 text-blue-500 group-hover:text-blue-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-normal text-blue-500 group-hover:text-blue-400 transition-colors">Media URI</p>
                    <p className="text-xs text-neutral-400 group-hover:text-neutral-300 transition-colors">View image on IPFS</p>
                  </div>
                </div>
                <svg className="w-4 h-4 text-neutral-400 group-hover:text-blue-500 group-hover:translate-x-1 transition-all duration-200 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
            </div>

            {/* Attributes */}
            <div className="bg-neutral-800 p-4 rounded-sm border border-neutral-700">
              <h2 className="text-lg font-medium mb-3 sm:mb-4 text-neutral-100">Attributes</h2>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-3">
                  {attributes.slice(0, 3).map((attr, index: number) => {
                    const color = getColorForAttribute(attr.name);
                    return (
                      <div key={index} className="bg-neutral-800 p-3 rounded-sm border border-neutral-700">
                        <div className="flex items-center gap-2 mb-1">
                          <div
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: color }}
                          />
                          <p className="text-sm font-medium uppercase tracking-wide" style={{ color: color }}>
                            {attr.name}
                          </p>
                        </div>
                        <p className="font-medium text-base text-neutral-100 leading-tight">{attr.value}</p>
                        <div className="text-sm text-neutral-400 mt-1">
                          <p className="leading-tight">{attr.percentage}% have this trait</p>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="space-y-3">
                  {attributes.slice(3, 6).map((attr, index: number) => {
                    const color = getColorForAttribute(attr.name);
                    return (
                      <div key={index + 3} className="bg-neutral-800 p-3 rounded-sm border border-neutral-700">
                        <div className="flex items-center gap-2 mb-1">
                          <div
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: color }}
                          />
                          <p className="text-sm font-medium uppercase tracking-wide" style={{ color: color }}>
                            {attr.name}
                          </p>
                        </div>
                        <p className="font-medium text-base text-neutral-100 leading-tight">{attr.value}</p>
                        <div className="text-sm text-neutral-400 mt-1">
                          <p className="leading-tight">{attr.percentage}% have this trait</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-4">
            {/* NFT Name, Heart Icon, and Buy Button */}
            <div>
              <div className="flex items-start justify-between gap-4 mb-4">
                <h1 className="text-xl sm:text-2xl lg:text-3xl font-semibold text-neutral-100 leading-tight">
                  {metadata?.name || `Satoshe Slugger #${parseInt(tokenId) + 1}`}
                </h1>
                <button
                  onClick={handleFavoriteToggle}
                  className={`p-2 rounded-full hover:bg-neutral-800 transition-colors ${
                    isFav
                      ? "text-[#ff0099] fill-[#ff0099]"
                      : "text-neutral-400 hover:text-[#ff0099]"
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
              
              {/* Buy a Slugger */}
              {isForSale ? (
                <div className="p-4 rounded-sm bg-neutral-800/50">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-[#3B82F6]"></div>
                      <span className="text-neutral-300 text-sm font-medium">Buy a Slugger</span>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-[#3B82F6]">{listingPrice}</div>
                      <div className="text-sm text-neutral-400">ETH</div>
                    </div>
                  </div>
                  <Button
                    onClick={handlePurchase}
                    disabled={isProcessing || !listingData}
                    className="w-full h-12 bg-[#3B82F6] text-white hover:bg-[#2563EB] transition-all duration-200 font-semibold text-base rounded-sm disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isProcessing ? "Processing..." : listingData ? "BUY" : "Not Listed"}
                  </Button>
                </div>
              ) : (
                <div className="p-4 rounded-sm border border-neutral-600 bg-transparent">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-[#ff0099]"></div>
                      <span className="text-neutral-300 text-sm font-medium">Status</span>
                    </div>
                    <span className="text-xl font-bold text-blue-500">SOLD!</span>
                  </div>
                </div>
              )}
            </div>

            {/* Details */}
            <div className="bg-neutral-800 p-4 rounded-sm border border-neutral-700">
              <h3 className="text-lg font-medium text-neutral-100 mb-4">Details</h3>
              <div className="grid grid-cols-2 gap-x-6 gap-y-4 text-sm">
                <div>
                  <p className="text-neutral-400 mb-1 leading-tight">Description</p>
                  <p className="text-neutral-100 font-light leading-tight">{metadata?.description || "Women's Baseball Card"}</p>
                </div>
                <div>
                  <p className="text-neutral-400 mb-1 leading-tight">NFT Number</p>
                  <p className="text-neutral-100 font-light leading-tight">{(metadata?.card_number as number) ?? parseInt(tokenId) + 1}</p>
                </div>
                <div>
                  <p className="text-neutral-400 mb-1 leading-tight">Token ID</p>
                  <p className="text-neutral-100 font-light leading-tight">{(metadata?.token_id as number) ?? tokenId}</p>
                </div>
                <div>
                  <p className="text-neutral-400 mb-1 leading-tight">Collection</p>
                  <p className="text-neutral-100 font-light leading-tight">{(metadata?.collection as string) || "Retinal Delights - Collection 11"}</p>
                </div>
                <div>
                  <p className="text-neutral-400 mb-1 leading-tight">Edition</p>
                  <p className="text-neutral-100 font-light leading-tight">{(metadata?.edition as number) || "1"}</p>
                </div>
                <div>
                  <p className="text-neutral-400 mb-1 leading-tight">Series</p>
                  <p className="text-neutral-100 font-light leading-tight">{(metadata?.series as string) || "Round the Bases Series"}</p>
                </div>
                <div>
                  <p className="text-neutral-400 mb-1 leading-tight">Rarity Tier</p>
                  <p className="text-neutral-100 font-light leading-tight">{(metadata?.rarity_tier as string) ?? "Unknown"}</p>
                </div>
                <div>
                  <p className="text-neutral-400 mb-1 leading-tight">Rarity Score</p>
                  <p className="text-neutral-100 font-light leading-tight">{(metadata?.rarity_score as number) ?? "—"}</p>
                </div>
                <div>
                  <p className="text-neutral-400 mb-1 leading-tight">Rank</p>
                  <p className="text-neutral-100 font-light leading-tight">{(metadata?.rank as number) ?? "—"} of 7777</p>
                </div>
                <div>
                  <p className="text-neutral-400 mb-1 leading-tight">Rarity Percentage</p>
                  <p className="text-neutral-100 font-light leading-tight">{(metadata?.rarity_percent as number) ?? "—"}%</p>
                </div>
              </div>
            </div>

            {/* Contract Details */}
            <div className="bg-neutral-800 p-4 rounded-sm border border-neutral-700">
              <h3 className="text-lg font-medium text-neutral-100 mb-4">Contract Details</h3>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-neutral-400 text-sm leading-tight">Contract Address</span>
                  <button
                    onClick={handleCopyAddress}
                    className="text-sm font-mono text-neutral-100 hover:text-[#ff0099] transition-colors cursor-pointer leading-tight"
                  >
                    {nftCollection.address.slice(0, 6)}...{nftCollection.address.slice(-4)}
                  </button>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-neutral-400 text-sm leading-tight">Token ID</span>
                  <span className="text-sm font-light text-neutral-100 leading-tight">{(metadata?.token_id as number) ?? tokenId}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-neutral-400 text-sm leading-tight">Token Standard</span>
                  <span className="text-sm font-light text-neutral-100 leading-tight">ERC-721</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-neutral-400 text-sm leading-tight">Blockchain</span>
                  <span className="text-sm font-light text-neutral-100 leading-tight">Base</span>
                </div>
              </div>
            </div>

            {/* Artist & Platform */}
            <div className="grid grid-cols-2 gap-4">
              <a 
                href="https://kristenwoerdeman.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="bg-neutral-800 p-4 rounded-sm border border-neutral-700 group cursor-pointer"
              >
                <div className="flex items-center justify-between mb-2">
                  <p className="text-neutral-400 text-sm leading-tight">Artist</p>
                  <svg className="w-4 h-4 text-neutral-400 group-hover:text-[#ff0099] transition-colors flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </div>
                <div className="flex items-center gap-2">
                  <img 
                    src="/brands/kristen-woerdeman/artist-logo-kristen-woerdeman-26px.png" 
                    alt="Kristen Woerdeman" 
                    className="w-[26px] h-[26px]"
                  />
                  <p className="text-neutral-100 font-normal group-hover:text-[#ff0099] transition-colors leading-tight">Kristen Woerdeman</p>
                </div>
              </a>
              <a 
                href="https://retinaldelights.io" 
                target="_blank" 
                rel="noopener noreferrer"
                className="bg-neutral-800 p-4 rounded-sm border border-neutral-700 group cursor-pointer"
              >
                <div className="flex items-center justify-between mb-2">
                  <p className="text-neutral-400 text-sm leading-tight">Platform</p>
                  <svg className="w-4 h-4 text-neutral-400 group-hover:text-[#ff0099] transition-colors flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </div>
                <div className="flex items-center gap-2">
                  <img 
                    src="/brands/retinal-delights/platform-logo-retinal-delights-26px.png" 
                    alt="Retinal Delights" 
                    className="w-[26px] h-[26px]"
                  />
                  <p className="text-neutral-100 font-normal group-hover:text-[#ff0099] transition-colors leading-tight">Retinal Delights</p>
                </div>
              </a>
            </div>

            {/* Attribute Rarity Distribution Chart */}
            {attributes && attributes.length > 0 && (
              <div>
                <AttributeRarityChart
                  attributes={attributes}
                  overallRarity={(metadata?.rarity_percent as number) || "—"}
                />
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}

