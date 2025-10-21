// components/nft-grid.tsx
"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import { TOTAL_COLLECTION_SIZE } from "@/lib/contracts";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Pagination from "@/components/ui/pagination";
// Removed BuyDirectListingButton imports - using regular buttons to avoid RPC calls
import NFTCard from "./nft-card";
import { LayoutGrid, Rows3, Grid3x3, Heart, Square } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useFavorites } from "@/hooks/useFavorites";
import Link from "next/link";
import Image from "next/image";
import { loadAllNFTs } from "@/lib/simple-data-service";
import { announceToScreenReader } from "@/lib/accessibility-utils";



type NFTGridItem = {
  id: string;
  tokenId: string;
  cardNumber: number;
  listingId?: string | number;
  name: string;
  image: string;
  priceEth: number; // Static price from metadata
  priceWei: string | number | bigint;
  rank: number | string;
  rarity: string;
  rarityPercent: string | number;
  tier: string | number;
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
  token_id?: number;
  name?: string;
  media_url?: string;
  rarity_tier?: string;
  rarity_percent?: number | string;
  rank?: number | string;
  attributes?: Array<{ trait_type: string; value: string }>;
  merged_data?: {
    media_url?: string;
    metadata_url?: string;
    token_id?: number;
    [key: string]: unknown;
  };
  background?: string;
  skinTone?: string;
  shirt?: string;
  eyewear?: string;
  hair?: string;
  headwear?: string;
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
  const value = meta?.attributes?.find((attr) => attr.trait_type === traitType)?.value;
  
  // Clean up redundant prefixes in values
  if (traitType === 'Eyewear' && value && value.startsWith('Eyewear ')) {
    return value.replace('Eyewear ', '');
  }
  
  return value;
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
  const [allMetadata, setAllMetadata] = useState<unknown[]>([]);
  const [viewMode, setViewMode] = useState<'grid-large' | 'grid-medium' | 'grid-small' | 'compact'>('grid-large');
  const [pricingMappings, setPricingMappings] = useState<Record<number, { price_eth: number; listing_id?: number }>>({});
  const [ipfsUrls, setIpfsUrls] = useState<Record<number, { mediaUrl: string; metadataUrl: string }>>({});
  const [focusedIndex, setFocusedIndex] = useState<number>(-1);
  const [scrollPosition, setScrollPosition] = useState<number>(0);
  const gridRef = useRef<HTMLDivElement>(null);
  
  // Load IPFS URLs
  useEffect(() => {
    const loadIpfsUrls = async () => {
      try {
        const response = await fetch('/data/urls/ipfs_urls.json');
        if (response.ok) {
          const urlsData = await response.json();
          const urlMap: Record<number, { mediaUrl: string; metadataUrl: string }> = {};
          
          urlsData.forEach((item: any) => {
            urlMap[item.TokenID] = {
              mediaUrl: item["Media URL"],
              metadataUrl: item["Metadata URL"]
            };
          });
          
          setIpfsUrls(urlMap);
        }
      } catch (error) {
        console.warn('Failed to load IPFS URLs:', error);
      }
    };
    loadIpfsUrls();
  }, []);

  // Load pricing mappings (optimized)
  useEffect(() => {
    const loadPricingMappings = async () => {
      try {
        // Try optimized file first
        let response = await fetch('/data/pricing/optimized_pricing.json');
        
        if (response.ok) {
          const optimizedData = await response.json();
          // Convert optimized structure back to original format for compatibility
          const mappings: Record<number, { price_eth: number; listing_id?: number }> = {};
          
          Object.entries(optimizedData.byTokenId).forEach(([tokenId, data]) => {
            const typedData = data as { price_eth: number; rarity_tier: string };
            mappings[parseInt(tokenId)] = {
              price_eth: typedData.price_eth,
              listing_id: undefined // Not stored in optimized format
            };
          });
          
          // Load test listings
          try {
            const testResponse = await fetch('/data/test-nfts/test_listings.json');
            if (testResponse.ok) {
              const testData = await testResponse.json();
              Object.entries(testData.test_listings).forEach(([listingId, data]) => {
                const testListing = data as { token_id: number; price_eth: number; status: string };
                if (testListing.status === 'Active') {
                  mappings[testListing.token_id] = {
                    price_eth: testListing.price_eth,
                    listing_id: parseInt(listingId)
                  };
                }
              });
            }
          } catch (error) {
            console.warn('Failed to load test listings:', error);
          }
          
          setPricingMappings(mappings);
          return;
        }
        
        // Fallback to original file
        response = await fetch('/data/pricing/token_pricing_mappings.json');
        const pricingData = await response.json();
        const mappings: Record<number, { price_eth: number; listing_id?: number }> = {};
        pricingData.forEach((item: { token_id: number; price_eth: number; listing_id?: number }) => {
          mappings[item.token_id] = {
            price_eth: item.price_eth,
            listing_id: item.listing_id
          };
        });
        
        // Load test listings for fallback too
        try {
          const testResponse = await fetch('/data/test-nfts/test_listings.json');
          if (testResponse.ok) {
            const testData = await testResponse.json();
            Object.entries(testData.test_listings).forEach(([listingId, data]) => {
              const testListing = data as { token_id: number; price_eth: number; status: string };
              if (testListing.status === 'Active') {
                mappings[testListing.token_id] = {
                  price_eth: testListing.price_eth,
                  listing_id: parseInt(listingId)
                };
              }
            });
          }
        } catch (error) {
          console.warn('Failed to load test listings:', error);
        }
        
        setPricingMappings(mappings);
      } catch {
        // Silent fail - pricing will be empty
      }
    };
    loadPricingMappings();
  }, []);

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

  // Keyboard navigation for grid items
  const handleKeyDown = (event: React.KeyboardEvent, index: number) => {
    const totalItems = paginatedNFTs.length;
    const itemsPerRow = viewMode === 'grid-large' ? 5 : viewMode === 'grid-medium' ? 7 : viewMode === 'grid-small' ? 8 : 1;
    
    switch (event.key) {
      case 'ArrowRight':
        event.preventDefault();
        if (index < totalItems - 1) {
          setFocusedIndex(index + 1);
        }
        break;
      case 'ArrowLeft':
        event.preventDefault();
        if (index > 0) {
          setFocusedIndex(index - 1);
        }
        break;
      case 'ArrowDown':
        event.preventDefault();
        if (index + itemsPerRow < totalItems) {
          setFocusedIndex(index + itemsPerRow);
        }
        break;
      case 'ArrowUp':
        event.preventDefault();
        if (index - itemsPerRow >= 0) {
          setFocusedIndex(index - itemsPerRow);
        }
        break;
      case 'Home':
        event.preventDefault();
        setFocusedIndex(0);
        break;
      case 'End':
        event.preventDefault();
        setFocusedIndex(totalItems - 1);
        break;
    }
  };

  // Load metadata
  useEffect(() => {
    const loadMetadata = async () => {
      try {
        setIsLoading(true);
        
        // Load main collection using simple data service
        const mainMetadata = await loadAllNFTs();
        
        // Load test NFTs with full metadata (for testing only)
        let testMetadata: any[] = [];
        try {
          // Load test listings for pricing data
          const testResponse = await fetch('/data/test-nfts/test_listings.json');
          if (testResponse.ok) {
            const testData = await testResponse.json();
            const activeListings = Object.entries(testData.test_listings)
              .filter(([_, data]) => (data as any).status === 'Active')
              .map(([listingId, data]) => ({ listingId, ...data as any }));

            // Load individual test NFT metadata files
            for (const listing of activeListings) {
              try {
                const metadataResponse = await fetch(`/data/test-nfts/${listing.token_id}.json`);
                if (metadataResponse.ok) {
                  const metadata = await metadataResponse.json();
                  testMetadata.push({
                    ...metadata,
                    merged_data: {
                      media_url: "/nfts/placeholder-nft.webp",
                      price_eth: listing.price_eth,
                      listing_id: parseInt(listing.listingId)
                    }
                  });
                }
              } catch (error) {
                console.warn(`Failed to load metadata for test NFT ${listing.token_id}:`, error);
              }
            }
          }
        } catch (error) {
          console.warn('Failed to load test listings for metadata:', error);
        }
        
        // Combine main collection with test NFTs (for testing)
        const combinedMetadata = [...(mainMetadata || []), ...testMetadata];
        setAllMetadata(combinedMetadata);

      } catch {
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
    if (allMetadata.length > 0 && Object.keys(pricingMappings).length > 0 && Object.keys(ipfsUrls).length > 0) {
      const processNFTs = async () => {
        const mappedNFTs: NFTGridItem[] = await Promise.all(
          (allMetadata as NFTMetadata[])
            .filter((meta: NFTMetadata) => meta.token_id !== undefined)
            .map(async (meta: NFTMetadata) => {
              const tokenId = meta.token_id?.toString() || "";
              
              // Use IPFS URL for image
              const tokenIdNum = parseInt(tokenId);
              const ipfsData = ipfsUrls[tokenIdNum];
              const imageUrl = ipfsData?.mediaUrl || (meta.merged_data?.media_url) || `/nfts/placeholder-nft.webp`;

              const name = meta.name || `Satoshe Slugger #${parseInt(tokenId) + 1}`;
              const rank = (meta.rank as number | string) ?? "—";
              const rarityPercent = (meta.rarity_percent as number | string) ?? "--";
              const rarity = ((meta.rarity_tier as string) ?? "Unknown").replace(" (Ultra-Legendary)", "");
              
              // Use static price data from pricing mappings - no RPC calls for display
              let priceEth = 0;
              let listingId = undefined;
              
              // Use pricing mappings for all NFTs
              const pricing = pricingMappings[tokenIdNum];
              if (pricing) {
                priceEth = pricing.price_eth;
                // Generate listing ID if not provided (all NFTs are live listings)
                listingId = pricing.listing_id || (tokenIdNum + 10000); // Generate listing ID
              }
              
              // Check if NFT is sold based on token_id
              // NFT 7826 is completed/sold, others are active
              const isSold = tokenIdNum === 7826;
              const isForSale = priceEth > 0 && !isSold;
              const priceWei = isForSale ? (priceEth * 1e18).toString() : "0";

              return {
                id: `${tokenId}-${meta.card_number || (parseInt(tokenId) + 1)}`,
                tokenId,
                cardNumber: parseInt(tokenId) + 1, // NFT number (token ID + 1)
                listingId: listingId || meta.token_id,
                name,
                image: imageUrl,
                priceEth: priceEth, // Static price for display
                priceWei: priceWei,
                isForSale: isForSale,
                rank,
                rarity,
                rarityPercent,
                tier: meta.rarity_tier || "Unknown",
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
  }, [allMetadata, pricingMappings, ipfsUrls]);


  // Preserve scroll position when filters change
  useEffect(() => {
    const handleScroll = () => {
      setScrollPosition(window.scrollY);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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

  // Restore scroll position after filtering
  useEffect(() => {
    if (scrollPosition > 0 && !isLoading) {
      // Small delay to ensure DOM is updated
      const timeoutId = setTimeout(() => {
        window.scrollTo(0, scrollPosition);
      }, 100);
      
      return () => clearTimeout(timeoutId);
    }
  }, [filteredNFTs.length, scrollPosition, isLoading]); // Only depend on length, not the entire array

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
                <div className="text-sm font-medium mt-1">
                  <span className="text-green-400">{filteredNFTs.filter(nft => nft.isForSale).length} Live</span>
                  <span className="text-neutral-400"> • </span>
                  <span className="text-blue-400">{filteredNFTs.filter(nft => !nft.isForSale && nft.priceEth > 0).length} Sold</span>
                </div>
                <div className="text-xs text-neutral-500 mt-1">
                  {startIndex + 1}-{Math.min(endIndex, filteredNFTs.length)} of {filteredNFTs.length} NFTs
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
                      onClick={() => {
                        setViewMode('grid-large')
                        announceToScreenReader('Switched to large grid view')
                      }}
                      className={`p-2 rounded-sm transition-colors ${viewMode === 'grid-large' ? 'bg-neutral-800 text-[#ff0099]' : 'text-neutral-500 hover:text-neutral-300'}`}
                      aria-label="Switch to large grid view"
                      aria-pressed={viewMode === 'grid-large'}
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
                      onClick={() => {
                        setViewMode('grid-medium')
                        announceToScreenReader('Switched to medium grid view')
                      }}
                      className={`p-2 rounded-sm transition-colors ${viewMode === 'grid-medium' ? 'bg-neutral-800 text-[#ff0099]' : 'text-neutral-500 hover:text-neutral-300'}`}
                      aria-label="Switch to medium grid view"
                      aria-pressed={viewMode === 'grid-medium'}
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
                      onClick={() => {
                        setViewMode('grid-small')
                        announceToScreenReader('Switched to small grid view')
                      }}
                      className={`p-2 rounded-sm transition-colors ${viewMode === 'grid-small' ? 'bg-neutral-800 text-[#ff0099]' : 'text-neutral-500 hover:text-neutral-300'}`}
                      aria-label="Switch to small grid view"
                      aria-pressed={viewMode === 'grid-small'}
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
                      onClick={() => {
                        setViewMode('compact')
                        announceToScreenReader('Switched to compact table view')
                      }}
                      className={`p-2 rounded-sm transition-colors ${viewMode === 'compact' ? 'bg-neutral-800 text-[#ff0099]' : 'text-neutral-500 hover:text-neutral-300'}`}
                      aria-label="Switch to compact table view"
                      aria-pressed={viewMode === 'compact'}
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
            <div ref={gridRef} className={`mt-4 mb-8 grid ${
              viewMode === 'grid-large' ? 'gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5' :
              viewMode === 'grid-medium' ? 'gap-1 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7' :
              'gap-2 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-8'
            }`}>
              {paginatedNFTs.map((nft, index) => (
                  <div
                    key={`${nft.tokenId}-${nft.cardNumber}-${index}`}
                    tabIndex={0}
                    onKeyDown={(e) => handleKeyDown(e, index)}
                    className={`focus:outline-none focus:ring-2 focus:ring-[#ff0099] focus:ring-offset-2 focus:ring-offset-neutral-900 rounded-sm ${
                      focusedIndex === index ? 'ring-2 ring-[#ff0099] ring-offset-2 ring-offset-neutral-900' : ''
                    }`}
                  >
                    <NFTCard
                      image={nft.image}
                      name={nft.name}
                      rank={nft.rank}
                      rarity={nft.rarity}
                      rarityPercent={nft.rarityPercent}
                      priceEth={nft.priceEth}
                      tokenId={nft.tokenId}
                      cardNumber={nft.cardNumber}
                      isForSale={nft.isForSale}
                      tier={nft.tier}
                      viewMode={viewMode}
                    />
                  </div>
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
                    <tr 
                      key={`${nft.tokenId}-${nft.cardNumber}-${index}`} 
                      tabIndex={0}
                      onKeyDown={(e) => handleKeyDown(e, index)}
                      className={`border-b border-neutral-700/50 hover:bg-neutral-800/30 transition-colors focus:outline-none focus:ring-2 focus:ring-[#ff0099] focus:ring-inset ${
                        index % 2 === 0 ? 'bg-neutral-900/20' : ''
                      } ${focusedIndex === index ? 'ring-2 ring-[#ff0099] ring-inset' : ''}`}
                    >
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <Link href={`/nft/${nft.tokenId}`} className="flex items-center gap-3 cursor-pointer hover:opacity-80 transition-opacity">
                            <Image src={nft.image} alt={`${nft.name} - NFT #${nft.cardNumber}, Rank ${nft.rank}, ${nft.rarity} rarity, Tier ${nft.tier}`} width={40} height={40} className="rounded object-contain" />
                            <div>
                              <p className="text-xs font-normal text-[#FFFBEB] truncate">{nft.name}</p>
                              <p className="text-xs text-neutral-500 truncate">Token ID: {nft.tokenId}</p>
                            </div>
                          </Link>
                        </div>
                      </td>
                      <td className="px-6 py-3 text-xs text-neutral-300 truncate font-normal">{nft.rank} / {TOTAL_COLLECTION_SIZE}</td>
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
                              className="px-2.5 py-1 bg-yellow-500/10 border border-yellow-500/30 rounded-sm text-yellow-400 text-xs font-medium hover:bg-yellow-500/20 hover:border-yellow-500/50 transition-colors"
                            >
                              View
                            </Link>
                            {nft.isForSale ? (
                              <Link
                                href={`/nft/${nft.tokenId}`}
                                className="px-2.5 py-1 bg-blue-500/10 border border-blue-500/30 rounded-sm text-blue-400 text-xs font-medium hover:bg-blue-500/20 hover:border-blue-500/50 transition-colors"
                              >
                                Buy
                              </Link>
                            ) : (
                              <span className="px-2.5 py-1 bg-green-500/10 border border-green-500/30 rounded-sm text-green-400 text-xs font-medium">
                                SOLD
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


