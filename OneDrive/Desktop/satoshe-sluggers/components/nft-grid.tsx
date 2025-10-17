// components/nft-grid.tsx
// components/nft-grid.tsx
"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Pagination from "@/components/ui/pagination";
import { BuyDirectListingButton } from "thirdweb/react";
import { client } from "@/lib/thirdweb";
import { base } from "thirdweb/chains";
import NFTCard from "./nft-card";
import { track } from '@vercel/analytics';
import { LayoutGrid, Rows3, Grid3x3, Heart, Square } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useFavorites } from "@/hooks/useFavorites";
import Link from "next/link";
import Image from "next/image";
import { chunkedDataService, ChunkedMetadataItem } from "@/lib/chunked-data-service";

// Utility to display price
function displayPrice(val: string | number | bigint) {
  if (!val || val === "0") {
    return "--";
  }
  if ((typeof val === "string" && /^\d{12,}$/.test(val)) || typeof val === "bigint") {
    try {
      const eth = Number(BigInt(val)) / 1e18;
      if (eth > 10000) {
        return "--";
      }
      return eth.toString();
    } catch {
      return "--";
    }
  }
  if (typeof val === "number" && val < 1e6) {
    return val.toString();
  }
  if (typeof val === "string" && /^\d*\.?\d+$/.test(val)) {
    return val;
  }
  return "--";
}

const TEST_METADATA_URL = "/test-nfts";

type NFTGridItem = {
  id: string;
  tokenId: string;
  listingId?: string | number;
  name: string;
  image: string;
  priceEth: number; // Static price from metadata
  priceWei: string | number | bigint;
  rank: number | string;
  rarity: string;
  rarityPercent: string | number;
  isForSale: boolean;
  background?: string;
  skinTone?: string;
  shirt?: string;
  eyewear?: string;
  hair?: string;
  headwear?: string;
};

interface SelectedFilters {
  background?: string[];
  skinTone?: string[];
  shirt?: string[];
  eyewear?: string[];
  hair?: Record<string, string[]>;
  headwear?: Record<string, string[]>;
  rarity?: string[];
}

interface NFTMetadata {
  attributes?: Array<{ trait_type: string; value: string }>;
  [key: string]: unknown;
}

interface NFTGridProps {
  searchTerm: string;
  searchMode: "contains" | "exact";
  selectedFilters: SelectedFilters;
  onFilteredCountChange?: (count: number) => void;
  onTraitCountsChange?: (counts: Record<string, Record<string, number>>) => void;
}

// Helper to extract attribute value from metadata
function getAttribute(meta: NFTMetadata, traitType: string) {
  return meta?.attributes?.find((attr) => attr.trait_type === traitType)?.value;
}

// Compute dynamic trait counts
function computeTraitCounts(nfts: NFTGridItem[], categories: string[]) {
  const counts: Record<string, Record<string, number>> = {};
  categories.forEach(category => {
    counts[category] = {};
    nfts.forEach(nft => {
      const value = nft[category as keyof NFTGridItem];
      if (value && typeof value === 'string') {
        if (category === 'hair' || category === 'headwear') {
          // For hair and headwear, split by subcategory and color
          const parts = value.split(' ');
          if (parts.length >= 2) {
            const subcategory = parts[0];
            // const _color = parts.slice(1).join(' '); // eslint-disable-line @typescript-eslint/no-unused-vars
            
            // Count the subcategory
            if (!counts[category][subcategory]) counts[category][subcategory] = 0;
            counts[category][subcategory]++;
            
            // Count the full combination
            if (!counts[category][value]) counts[category][value] = 0;
            counts[category][value]++;
          } else {
            // Fallback for single-word values
            if (!counts[category][value]) counts[category][value] = 0;
            counts[category][value]++;
          }
        } else {
          // For other categories, count normally
          if (!counts[category][value]) counts[category][value] = 0;
          counts[category][value]++;
        }
      }
    });
  });
  return counts;
}

export default function NFTGrid({ searchTerm, searchMode, selectedFilters, onFilteredCountChange, onTraitCountsChange }: NFTGridProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(25);
  const [sortBy, setSortBy] = useState("default");
  const [columnSort, setColumnSort] = useState<{ field: string; direction: 'asc' | 'desc' } | null>(null);
  const [nfts, setNfts] = useState<NFTGridItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [allMetadata, setAllMetadata] = useState<NFTMetadata[]>([]);
  const [viewMode, setViewMode] = useState<'grid-large' | 'grid-medium' | 'grid-small' | 'compact'>('grid-large');
  

  
  // Favorites functionality
  const { isFavorited, toggleFavorite } = useFavorites();

  // Column sort handler
  const handleColumnSort = (field: string) => {
    if (columnSort?.field === field) {
      // Toggle direction if same field
      setColumnSort({
        field,
        direction: columnSort.direction === 'asc' ? 'desc' : 'asc'
      });
    } else {
      // New field, start with ascending
      setColumnSort({ field, direction: 'asc' });
    }
    // Reset dropdown sort when using column sort
    setSortBy("default");
  };

  // Load metadata
  useEffect(() => {
    const loadMetadata = async () => {
      try {
        setIsLoading(true);
        
        // Load main collection using chunked data service
        const mainMetadata = await chunkedDataService.loadAllMetadata();
        
        // Load test NFTs
        const testMetadata = [];
        
        // Load all 10 test NFTs
        for (let i = 0; i < 10; i++) {
          try {
            const testFileResponse = await fetch(`${TEST_METADATA_URL}/test-nft-metadata-${i}.json`);
            const testFileData = await testFileResponse.json();
            
            // Add missing fields for compatibility with main collection
            const enhancedTestData = {
              ...testFileData,
              price_eth: 0.001, // Default test price
              listing_id: i + 7777, // Test listing IDs starting from 7777
              token_id: i + 7777, // Adjust token_id to be after main collection
              card_number: i + 7778, // Adjust card_number
              image: `/test-nfts/placeholder-nft-${i}.webp`, // Correct image path
            };
            
            testMetadata.push(enhancedTestData);
          } catch (error) {
            console.warn(`Failed to load test NFT ${i}:`, error);
          }
        }
        
        // Combine main collection with test NFTs
        const combinedMetadata = [...(mainMetadata || []), ...testMetadata];
        console.log('[NFTGrid] Loaded metadata:', {
          mainCollection: mainMetadata?.length || 0,
          testNFTs: testMetadata.length,
          total: combinedMetadata.length
        });
        setAllMetadata(combinedMetadata);

      } catch (error) {
        console.error('[NFTGrid] Error loading metadata:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadMetadata();
  }, []);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [itemsPerPage, searchTerm]);

  // Process NFTs from metadata and check marketplace listings
  useEffect(() => {
    if (allMetadata.length > 0) {

      const processNFTs = async () => {
        const mappedNFTs: NFTGridItem[] = await Promise.all(
          allMetadata
            .filter(meta => meta.token_id !== undefined)
            .map(async (meta: NFTMetadata & { token_id?: number; name?: string; price_eth?: number; media_url?: string; [key: string]: unknown }) => {
              const tokenId = meta.token_id?.toString() || "";
              
              // Use the actual media_url from metadata, fallback to generated URL
              const imageUrl = meta.media_url || `https://ipfs.io/ipfs/QmPBBAsMUPtDLcw1PEunB779B8dsg9gxpdwHXrAkLnWwUD/${tokenId}.webp`;

              const name = meta.name || `Satoshe Slugger #${parseInt(tokenId) + 1}`;
              const rank = (meta.rank as number | string) ?? "—";
              const rarityPercent = (meta.rarity_percent as number | string) ?? "--";
              const rarity = ((meta.rarity_tier as string) ?? "Unknown").replace(" (Ultra-Legendary)", "");
              
              // Use static price data from metadata - no RPC calls for display
              const priceEth = (meta.merged_data as any)?.price_eth || 0;
              const listingId = (meta.merged_data as any)?.listing_id;
              const isForSale = priceEth > 0 && listingId;
              const priceWei = isForSale ? (priceEth * 1e18).toString() : "0";

              return {
                id: tokenId,
                tokenId,
                listingId: listingId || meta.token_id,
                name,
                image: imageUrl,
                priceEth: priceEth, // Static price for display
                priceWei: priceWei,
                isForSale: isForSale,
                rank,
                rarity,
                rarityPercent,
                background: getAttribute(meta, "Background"),
                skinTone: getAttribute(meta, "Skin Tone"),
                shirt: getAttribute(meta, "Shirt"),
                eyewear: getAttribute(meta, "Eyewear"),
                hair: getAttribute(meta, "Hair"),
                headwear: getAttribute(meta, "Headwear"),
              };
            })
        );

        setNfts(mappedNFTs);
      };

      processNFTs();
    }
  }, [allMetadata]);

  // Handle purchase success callback
  const handlePurchaseSuccess = (nft: NFTGridItem) => {
    // Update NFT status to sold
    setNfts(prevNfts => 
      prevNfts.map(n => 
        n.id === nft.id 
          ? { ...n, isForSale: false, priceWei: "0" } 
          : n
      )
    );
  };

  // Filter NFTs
  const filteredNFTs = useMemo(() => {
    return nfts.filter(nft => {
    // Search logic with Contains/Exact mode
    let matchesSearch = true;
    if (searchTerm.trim()) {
      if (searchMode === "exact") {
        // Exact match: Check if token ID, NFT number, or name matches exactly
        const searchValue = searchTerm.trim();
        const tokenIdMatch = nft.tokenId.toString() === searchValue;
        const nftNumberMatch = (parseInt(nft.tokenId) + 1).toString() === searchValue;
        const nameMatch = nft.name.toLowerCase() === searchValue.toLowerCase();
        matchesSearch = tokenIdMatch || nftNumberMatch || nameMatch;
      } else {
        // Contains mode: Search in name, token ID, or NFT number
        const lowerSearch = searchTerm.toLowerCase();
        const nameMatch = nft.name.toLowerCase().includes(lowerSearch);
        const tokenIdMatch = nft.tokenId.toString().includes(searchTerm);
        const nftNumberMatch = (parseInt(nft.tokenId) + 1).toString().includes(searchTerm);
        matchesSearch = nameMatch || tokenIdMatch || nftNumberMatch;
      }
    }

    const matchesRarity =
      !selectedFilters.rarity ||
      selectedFilters.rarity.length === 0 ||
      selectedFilters.rarity.includes(nft.rarity);

    const matchesBackground =
      !selectedFilters.background ||
      selectedFilters.background.length === 0 ||
      (nft.background && selectedFilters.background.includes(nft.background));

    const matchesSkinTone =
      !selectedFilters.skinTone ||
      selectedFilters.skinTone.length === 0 ||
      (nft.skinTone && selectedFilters.skinTone.includes(nft.skinTone));

    const matchesShirt =
      !selectedFilters.shirt ||
      selectedFilters.shirt.length === 0 ||
      (nft.shirt && selectedFilters.shirt.includes(nft.shirt));

    const matchesEyewear =
      !selectedFilters.eyewear ||
      selectedFilters.eyewear.length === 0 ||
      (nft.eyewear && selectedFilters.eyewear.includes(nft.eyewear));

    const hairFilters = selectedFilters.hair || {};
    const hairSubcats = Object.keys(hairFilters);
    const matchesHair =
      hairSubcats.length === 0 ||
      hairSubcats.some(subcat => {
        const colors = hairFilters[subcat];
        const nftHair = nft.hair ? String(nft.hair) : "";
        if (!nftHair) return false;
        if (!colors || colors.length === 0) {
          return nftHair.startsWith(subcat);
        } else {
          return (colors as string[]).some((color: string) => nftHair === `${subcat} ${color}`);
        }
      });

    const headwearFilters = selectedFilters.headwear || {};
    const headwearSubcats = Object.keys(headwearFilters);
    const matchesHeadwear =
      headwearSubcats.length === 0 ||
      headwearSubcats.some(subcat => {
        const colors = headwearFilters[subcat];
        const nftHeadwear = nft.headwear ? String(nft.headwear) : "";
        if (!nftHeadwear) return false;
        if (!colors || colors.length === 0) {
          return nftHeadwear.startsWith(subcat);
        } else {
          return (colors as string[]).some((color: string) => nftHeadwear === `${subcat} ${color}`);
        }
      });

    return (
      matchesSearch &&
      matchesRarity &&
      matchesBackground &&
      matchesSkinTone &&
      matchesShirt &&
      matchesEyewear &&
      matchesHair &&
      matchesHeadwear
    );
  });
  }, [nfts, searchTerm, searchMode, selectedFilters]);

  // Sort filtered NFTs
  const sortedNFTs = useMemo(() => {
    return [...filteredNFTs].sort((a, b) => {
      // Column sort takes precedence
      if (columnSort) {
        const { field, direction } = columnSort;
        const multiplier = direction === 'asc' ? 1 : -1;
        
        switch (field) {
          case 'nft':
            return multiplier * (a.name.localeCompare(b.name));
          case 'rank':
            return multiplier * (Number(a.rank) - Number(b.rank));
          case 'rarity':
            return multiplier * (Number(a.rarityPercent) - Number(b.rarityPercent));
          case 'tier':
            return multiplier * (a.rarity.localeCompare(b.rarity));
          case 'price':
            return multiplier * (Number(a.priceWei) - Number(b.priceWei));
          default:
            return 0;
        }
      }
      
      // Fallback to dropdown sort
      switch (sortBy) {
        case "rank-asc":
          return Number(a.rank) - Number(b.rank);
        case "rank-desc":
          return Number(b.rank) - Number(a.rank);
        case "rarity-asc":
          return Number(a.rarityPercent) - Number(b.rarityPercent);
        case "rarity-desc":
          return Number(b.rarityPercent) - Number(a.rarityPercent);
        case "price-asc":
          return Number(a.priceWei) - Number(b.priceWei);
        case "price-desc":
          return Number(b.priceWei) - Number(a.priceWei);
        default:
          return 0;
      }
    });
  }, [filteredNFTs, sortBy, columnSort]);


  // Pagination
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedNFTs = sortedNFTs.slice(startIndex, endIndex);

  const totalPages = Math.ceil(sortedNFTs.length / itemsPerPage) || 1;

  // Update page if out of bounds
  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(1);
    }
  }, [currentPage, totalPages]);

  // Compute trait counts from ALL NFTs (not filtered) so all options remain visible
  const traitCounts = useMemo(() => {
    return computeTraitCounts(nfts, ["background", "skinTone", "shirt", "eyewear", "hair", "headwear", "rarity"]);
  }, [nfts]);

  const prevFilteredCountRef = useRef<number>(0);
  const prevTraitCountsRef = useRef<Record<string, Record<string, number>>>({});

  useEffect(() => {
    if (onFilteredCountChange && filteredNFTs.length !== prevFilteredCountRef.current) {
      prevFilteredCountRef.current = filteredNFTs.length;
      onFilteredCountChange(filteredNFTs.length);
    }
  }, [filteredNFTs.length, onFilteredCountChange]);

  useEffect(() => {
    if (onTraitCountsChange) {
      const traitCountsString = JSON.stringify(traitCounts);
      const prevTraitCountsString = JSON.stringify(prevTraitCountsRef.current);

      if (traitCountsString !== prevTraitCountsString) {
        prevTraitCountsRef.current = traitCounts;
        onTraitCountsChange(traitCounts);
      }
    }
  }, [traitCounts, onTraitCountsChange]);

  if (isLoading) {
    return (
      <div className="w-full max-w-full">
        <div className="mb-6">
          <h2 className="text-lg font-medium">NFT Collection</h2>
          <div className="text-sm font-medium text-pink-500 mt-1">Loading...</div>
        </div>
        <div className="mt-8 mb-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-3">
          {Array.from({ length: 12 }).map((_, index) => (
            <div key={index} className="bg-neutral-800 rounded-lg p-4 animate-pulse">
              <div className="aspect-square bg-neutral-700 rounded-lg mb-3"></div>
              <div className="h-4 bg-neutral-700 rounded mb-2"></div>
              <div className="h-3 bg-neutral-700 rounded mb-1"></div>
              <div className="h-3 bg-neutral-700 rounded w-2/3"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-full">
      <div className="flex flex-col gap-2 mb-4 pl-2">
        {/* Header section: Title, stats, and controls all together */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          {/* Left side: Title and stats */}
          <div>
            <h2 className="text-lg font-medium">NFT Collection</h2>
            {filteredNFTs.length > 0 && (
              <>
                <div className="text-sm font-medium text-[#ff0099] mt-1">
                  {filteredNFTs.length} Live • 0 Sold
                </div>
                <div className="text-xs text-neutral-500 mt-1">
                  Showing {startIndex + 1}-{Math.min(endIndex, filteredNFTs.length)} of {filteredNFTs.length} NFTs
                </div>
              </>
            )}
          </div>

          {/* Right side: View toggles and dropdowns */}
          <div className="flex flex-col items-end gap-2">
            {/* View Mode Toggles - Above dropdowns */}
            <TooltipProvider>
              <div className="flex items-center gap-1 border border-neutral-700 rounded-sm p-1 bg-neutral-900">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button
                      onClick={() => setViewMode('grid-large')}
                      className={`p-2 rounded-sm transition-colors ${viewMode === 'grid-large' ? 'bg-neutral-800 text-[#ff0099]' : 'text-neutral-500 hover:text-neutral-300'}`}
                    >
                      <Square className="w-4 h-4" />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent side="top" className="bg-neutral-800 text-[#FFFBEB] border-neutral-600">
                    <p>Large Grid</p>
                  </TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button
                      onClick={() => setViewMode('grid-medium')}
                      className={`p-2 rounded-sm transition-colors ${viewMode === 'grid-medium' ? 'bg-neutral-800 text-[#ff0099]' : 'text-neutral-500 hover:text-neutral-300'}`}
                    >
                      <LayoutGrid className="w-4 h-4" />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent side="top" className="bg-neutral-800 text-[#FFFBEB] border-neutral-600">
                    <p>Medium Grid</p>
                  </TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button
                      onClick={() => setViewMode('grid-small')}
                      className={`p-2 rounded-sm transition-colors ${viewMode === 'grid-small' ? 'bg-neutral-800 text-[#ff0099]' : 'text-neutral-500 hover:text-neutral-300'}`}
                    >
                      <Grid3x3 className="w-4 h-4" />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent side="top" className="bg-neutral-800 text-[#FFFBEB] border-neutral-600">
                    <p>Small Grid</p>
                  </TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button
                      onClick={() => setViewMode('compact')}
                      className={`p-2 rounded-sm transition-colors ${viewMode === 'compact' ? 'bg-neutral-800 text-[#ff0099]' : 'text-neutral-500 hover:text-neutral-300'}`}
                    >
                      <Rows3 className="w-4 h-4" />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent side="top" className="bg-neutral-800 text-[#FFFBEB] border-neutral-600">
                    <p>Compact Table</p>
                  </TooltipContent>
                </Tooltip>
              </div>
            </TooltipProvider>

            {/* Dropdowns - Below view toggles */}
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <span className="text-sm text-neutral-500">Sort by:</span>
                <Select value={sortBy} onValueChange={(value) => {
                  setSortBy(value);
                  setColumnSort(null); // Clear column sort when using dropdown
                }}>
                  <SelectTrigger className="w-[180px] bg-neutral-900 border-neutral-700 rounded-sm text-[#FFFBEB] text-sm font-normal">
                    <SelectValue placeholder="Default" />
                  </SelectTrigger>
                  <SelectContent className="bg-neutral-950/95 backdrop-blur-md border-neutral-700 rounded-sm">
                    <SelectItem value="default">Default</SelectItem>
                    <SelectItem value="rank-asc">Rank: Low to High</SelectItem>
                    <SelectItem value="rank-desc">Rank: High to Low</SelectItem>
                    <SelectItem value="rarity-asc">Rarity: Low to High</SelectItem>
                    <SelectItem value="rarity-desc">Rarity: High to Low</SelectItem>
                    <SelectItem value="price-asc">Price: Low to High</SelectItem>
                    <SelectItem value="price-desc">Price: High to Low</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-sm text-neutral-500">Show:</span>
                <Select value={itemsPerPage.toString()} onValueChange={(val) => setItemsPerPage(Number(val))}>
                  <SelectTrigger className="w-[120px] bg-neutral-900 border-neutral-700 rounded-sm text-[#FFFBEB] text-sm font-normal">
                    <SelectValue placeholder="15 items" />
                  </SelectTrigger>
                  <SelectContent className="bg-neutral-950/95 backdrop-blur-md border-neutral-700 rounded-sm">
                    <SelectItem value="15">15 items</SelectItem>
                    <SelectItem value="25">25 items</SelectItem>
                    <SelectItem value="50">50 items</SelectItem>
                    <SelectItem value="100">100 items</SelectItem>
                    <SelectItem value="250">250 items</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </div>
      </div>

      {paginatedNFTs.length > 0 ? (
        <>
          {/* Grid Views */}
          {(viewMode === 'grid-large' || viewMode === 'grid-medium' || viewMode === 'grid-small') && (
            <div className={`mt-4 mb-8 grid ${
              viewMode === 'grid-large' ? 'gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5' :
              viewMode === 'grid-medium' ? 'gap-3 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6' :
              'gap-2 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-8'
            }`}>
              {paginatedNFTs.map((nft) => (
                <NFTCard
                  key={nft.id}
                  image={nft.image}
                  name={nft.name}
                  rank={nft.rank}
                  rarity={nft.rarity}
                  rarityPercent={nft.rarityPercent}
                  priceEth={nft.priceEth}
                  tokenId={nft.tokenId}
                  listingId={nft.listingId || nft.tokenId}
                  isForSale={nft.isForSale}
                  onPurchase={() => handlePurchaseSuccess(nft)}
                  viewMode={viewMode}
                />
              ))}
            </div>
          )}


          {/* Compact Table View */}
          {viewMode === 'compact' && (
            <div className="mt-4 mb-8 border border-neutral-700 rounded-sm overflow-hidden">
              <table className="w-full">
                <thead className="bg-neutral-800/50 border-b border-neutral-700">
                  <tr>
                    <th 
                      className="text-left px-4 py-3 text-xs sm:text-sm font-medium text-[#FFFBEB] hover:text-neutral-200 cursor-pointer select-none"
                      onClick={() => handleColumnSort('nft')}
                    >
                      <div className="flex items-center gap-1">
                        NFT
                        {columnSort?.field === 'nft' && (
                          <span className="text-[#ff0099]">
                            {columnSort.direction === 'asc' ? '↑' : '↓'}
                          </span>
                        )}
                      </div>
                    </th>
                    <th 
                      className="text-left px-6 py-3 text-xs sm:text-sm font-medium text-[#FFFBEB] hover:text-neutral-200 cursor-pointer select-none"
                      onClick={() => handleColumnSort('rank')}
                    >
                      <div className="flex items-center gap-1">
                        Rank
                        {columnSort?.field === 'rank' && (
                          <span className="text-[#ff0099]">
                            {columnSort.direction === 'asc' ? '↑' : '↓'}
                          </span>
                        )}
                      </div>
                    </th>
                    <th 
                      className="text-left px-4 py-3 text-xs sm:text-sm font-medium text-[#FFFBEB] hover:text-neutral-200 cursor-pointer select-none"
                      onClick={() => handleColumnSort('rarity')}
                    >
                      <div className="flex items-center gap-1">
                        Rarity
                        {columnSort?.field === 'rarity' && (
                          <span className="text-[#ff0099]">
                            {columnSort.direction === 'asc' ? '↑' : '↓'}
                          </span>
                        )}
                      </div>
                    </th>
                    <th 
                      className="text-left px-4 py-3 text-xs sm:text-sm font-medium text-[#FFFBEB] hover:text-neutral-200 cursor-pointer select-none"
                      onClick={() => handleColumnSort('tier')}
                    >
                      <div className="flex items-center gap-1">
                        Tier
                        {columnSort?.field === 'tier' && (
                          <span className="text-[#ff0099]">
                            {columnSort.direction === 'asc' ? '↑' : '↓'}
                          </span>
                        )}
                      </div>
                    </th>
                    <th 
                      className="text-left px-4 py-3 text-xs sm:text-sm font-medium text-[#FFFBEB] hover:text-neutral-200 cursor-pointer select-none"
                      onClick={() => handleColumnSort('price')}
                    >
                      <div className="flex items-center gap-1">
                        Price
                        {columnSort?.field === 'price' && (
                          <span className="text-[#ff0099]">
                            {columnSort.direction === 'asc' ? '↑' : '↓'}
                          </span>
                        )}
                      </div>
                    </th>
                    <th className="text-center px-4 py-3 text-xs sm:text-sm font-medium text-[#FFFBEB]">Favorite</th>
                    <th className="text-right px-4 py-3 text-xs sm:text-sm font-medium text-[#FFFBEB]">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedNFTs.map((nft, index) => (
                    <tr key={nft.id} className={`border-b border-neutral-700/50 hover:bg-neutral-800/30 transition-colors ${index % 2 === 0 ? 'bg-neutral-900/20' : ''}`}>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <Link href={`/nft/${nft.tokenId}`} className="flex items-center gap-3 cursor-pointer hover:opacity-80 transition-opacity">
                            <Image src={nft.image} alt={nft.name} width={40} height={40} className="rounded object-contain" />
                            <div>
                              <p className="text-xs font-normal text-[#FFFBEB] truncate">{nft.name}</p>
                              <p className="text-xs text-neutral-500 truncate">Token ID: {nft.tokenId}</p>
                            </div>
                          </Link>
                        </div>
                      </td>
                      <td className="px-6 py-3 text-xs text-neutral-300 truncate font-normal">{nft.rank} / 7777</td>
                      <td className="px-4 py-3 text-xs text-neutral-300 truncate font-normal">{nft.rarityPercent}%</td>
                      <td className="px-4 py-3 text-xs text-neutral-300 truncate font-normal">{nft.rarity}</td>
                      <td className="px-4 py-3 text-xs font-normal text-blue-500 whitespace-nowrap">{nft.priceEth} ETH</td>
                      <td className="px-4 py-3 text-center">
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            toggleFavorite({
                              tokenId: nft.tokenId,
                              name: nft.name,
                              image: nft.image,
                              rarity: nft.rarity,
                              rank: nft.rank,
                              rarityPercent: nft.rarityPercent,
                            });
                          }}
                          className="p-1 hover:bg-neutral-700 rounded transition-colors"
                        >
                          <Heart className={`w-4 h-4 ${isFavorited(nft.tokenId) ? "fill-[#ff0099] text-[#ff0099]" : "text-neutral-400 hover:text-neutral-300"}`} />
                        </button>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center gap-2 justify-end">
                            <Link
                              href={`/nft/${nft.tokenId}`}
                              className="px-2 sm:px-3 py-1.5 bg-transparent border border-neutral-600 text-neutral-300 hover:bg-neutral-700 hover:text-[#FFFBEB] transition-all rounded-sm text-xs sm:text-sm font-medium"
                            >
                              View
                            </Link>
                            {nft.isForSale && nft.listingId ? (
                              <BuyDirectListingButton
                                contractAddress="0x187A56dDfCcc96AA9f4FaAA8C0fE57388820A817"
                                client={client}
                                chain={base}
                                listingId={BigInt(nft.listingId)}
                                quantity={1n}
                                onTransactionSent={() => {
                                  track('NFT Purchase Attempted', { tokenId: nft.tokenId });
                                }}
                                onTransactionConfirmed={() => {
                                  track('NFT Purchase Success', { tokenId: nft.tokenId });
                                  handlePurchaseSuccess(nft);
                                }}
                                onError={(error) => {
                                  console.error('Purchase failed:', error);
                                  track('NFT Purchase Failed', { tokenId: nft.tokenId });
                                }}
                                className="!px-3 !py-1.5 !bg-blue-500 !text-[#FFFBEB] hover:!bg-blue-600 !transition-all !text-xs !font-medium !disabled:opacity-50 !h-auto !min-h-0 !rounded"
                                style={{
                                  padding: '6px 12px',
                                  fontSize: '12px',
                                  height: 'auto',
                                  minHeight: 'unset',
                                  borderRadius: '2px'
                                }}
                              >
                                Buy
                              </BuyDirectListingButton>
                            ) : (
                              <span className="px-1.5 py-1 text-xs text-neutral-400">
                                {nft.isForSale ? "No Listing" : "Sold"}
                              </span>
                            )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      ) : (
        <div className="text-center py-12">
          <p className="text-neutral-400">No NFTs found matching your criteria</p>
        </div>
      )}

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        totalItems={filteredNFTs.length}
        itemsPerPage={itemsPerPage}
        onPageChange={setCurrentPage}
      />
    </div>
  );
}

