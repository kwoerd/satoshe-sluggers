// components/nft-grid-simplified.tsx
"use client";

import { useState, useEffect, useMemo } from "react";
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
import { LayoutGrid, Rows3, Heart } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useFavorites } from "@/hooks/useFavorites";
import Link from "next/link";
import Image from "next/image";
import { loadAllNFTs, NFTData } from "@/lib/simple-data-service";

const TEST_METADATA_URL = "/test-nfts";

type NFTGridItem = {
  id: string;
  tokenId: string;
  cardNumber: string;
  name: string;
  image: string;
  rank: string | number;
  rarityPercent: string | number;
  rarity: string;
  priceEth: number;
  listingId?: number;
  isForSale: boolean;
  attributes: Array<{
    trait_type: string;
    value: string;
  }>;
};

interface NFTGridProps {
  searchTerm: string;
  searchMode: "exact" | "contains";
  selectedFilters: {
    rarity?: string[];
    background?: string[];
    skinTone?: string[];
    shirt?: string[];
    hair?: Record<string, string[]>;
    eyewear?: string[];
    headwear?: Record<string, string[]>;
  };
  onFilteredCountChange: (count: number) => void;
  onTraitCountsChange: (counts: Record<string, Record<string, number>>) => void;
}

// Simple trait counting function
function computeTraitCounts(nfts: NFTGridItem[], categories: string[]) {
  const counts: Record<string, Record<string, number>> = {};
  
  categories.forEach(category => {
    counts[category] = {};
  });

  nfts.forEach(nft => {
    nft.attributes.forEach(attr => {
      const traitType = attr.trait_type.toLowerCase();
      if (counts[traitType]) {
        counts[traitType][attr.value] = (counts[traitType][attr.value] || 0) + 1;
      }
    });
  });

  return counts;
}

export default function NFTGrid({ searchTerm, searchMode, selectedFilters, onFilteredCountChange, onTraitCountsChange }: NFTGridProps) {
  const [allNFTs, setAllNFTs] = useState<NFTGridItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(50);
  const [viewMode, setViewMode] = useState<"grid" | "table">("grid");
  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const { toggleFavorite, isFavorited } = useFavorites();

  // Load all NFTs
  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        
        // Load main collection
        const mainNFTs = await loadAllNFTs();
        
        // Load test NFTs
        const testNFTs: NFTData[] = [];
        for (let i = 0; i < 10; i++) {
          try {
            const response = await fetch(`${TEST_METADATA_URL}/test-nft-metadata-${i}.json`);
            const data = await response.json();
            testNFTs.push({
              ...data,
              token_id: i,
              card_number: i + 1,
              merged_data: {
                ...data.merged_data,
                price_eth: data.merged_data?.price_eth || data.price_eth || 0.001,
                listing_id: data.merged_data?.listing_id || data.listing_id || (i + 7777),
              }
            });
          } catch (error) {
            console.warn(`Failed to load test NFT ${i}:`, error);
          }
        }

        // Convert to grid items
        const allData = [...mainNFTs, ...testNFTs];
        const gridItems: NFTGridItem[] = allData.map(nft => {
          const isTestNFT = nft.token_id >= 0 && nft.token_id <= 9;
          const mediaUrl = nft.merged_data?.media_url;
          const imageUrl = mediaUrl || (isTestNFT ? `/test-nfts/placeholder-nft-${nft.token_id}.webp` : `/nfts/placeholder-nft.webp`);
          
          return {
            id: nft.token_id.toString(),
            tokenId: nft.token_id.toString(),
            cardNumber: nft.card_number.toString(),
            name: nft.name || `Satoshe Slugger #${nft.token_id + 1}`,
            image: imageUrl,
            rank: nft.rank ?? "—",
            rarityPercent: nft.rarity_percent ?? "--",
            rarity: (nft.rarity_tier ?? "Unknown").replace(" (Ultra-Legendary)", ""),
            priceEth: nft.merged_data?.price_eth || 0,
            listingId: nft.merged_data?.listing_id,
            isForSale: (nft.merged_data?.price_eth || 0) > 0,
            attributes: nft.attributes || []
          };
        });

        setAllNFTs(gridItems);
      } catch (error) {
        console.error('Error loading NFTs:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  // Filter and search NFTs
  const filteredNFTs = useMemo(() => {
    let filtered = allNFTs;

    // Apply search
    if (searchTerm.trim()) {
      filtered = filtered.filter(nft => {
        const searchText = `${nft.name} ${nft.cardNumber}`.toLowerCase();
        const query = searchTerm.toLowerCase();
        return searchMode === "exact" ? searchText === query : searchText.includes(query);
      });
    }

    // Apply filters
    if (selectedFilters.rarity && selectedFilters.rarity.length > 0) {
      filtered = filtered.filter(nft => selectedFilters.rarity!.includes(nft.rarity));
    }

    // Apply attribute filters
    Object.entries(selectedFilters).forEach(([key, values]) => {
      if (key === 'rarity' || !values || values.length === 0) return;
      
      filtered = filtered.filter(nft => {
        const attribute = nft.attributes.find(attr => 
          attr.trait_type.toLowerCase() === key.toLowerCase()
        );
        
        if (!attribute) return false;
        
        if (key === 'hair' || key === 'headwear') {
          // Handle subcategories
          const subcategoryValues = values as Record<string, string[]>;
          return Object.entries(subcategoryValues).some(([subcat, colors]) => {
            return attribute.value.includes(subcat) && colors.some(color => attribute.value.includes(color));
          });
        } else {
          // Handle simple attributes
          const simpleValues = values as string[];
          return simpleValues.includes(attribute.value);
        }
      });
    });

    return filtered;
  }, [allNFTs, searchTerm, searchMode, selectedFilters]);

  // Sort NFTs
  const sortedNFTs = useMemo(() => {
    if (!sortColumn) return filteredNFTs;

    return [...filteredNFTs].sort((a, b) => {
      let aValue: string | number = a[sortColumn as keyof NFTGridItem] as string | number;
      let bValue: string | number = b[sortColumn as keyof NFTGridItem] as string | number;

      if (sortColumn === 'rank' || sortColumn === 'rarityPercent') {
        aValue = typeof aValue === 'string' ? parseFloat(aValue) || 0 : aValue;
        bValue = typeof bValue === 'string' ? parseFloat(bValue) || 0 : bValue;
      }

      if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
  }, [filteredNFTs, sortColumn, sortDirection]);

  // Paginate NFTs
  const paginatedNFTs = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return sortedNFTs.slice(startIndex, startIndex + itemsPerPage);
  }, [sortedNFTs, currentPage, itemsPerPage]);

  // Update trait counts
  useEffect(() => {
    const counts = computeTraitCounts(allNFTs, ['background', 'skinTone', 'shirt', 'hair', 'eyewear', 'headwear']);
    onTraitCountsChange(counts);
  }, [allNFTs, onTraitCountsChange]);

  // Update filtered count
  useEffect(() => {
    onFilteredCountChange(filteredNFTs.length);
  }, [filteredNFTs.length, onFilteredCountChange]);

  // Handle sorting
  const handleSort = (column: string) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortDirection('asc');
    }
  };

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [itemsPerPage, searchTerm, selectedFilters]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-pink mx-auto mb-4"></div>
          <p className="text-neutral-400">Loading NFTs...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-sm text-neutral-400">
            Showing {filteredNFTs.length} of {allNFTs.length} NFTs
          </span>
        </div>
        
        <div className="flex items-center gap-2">
          <Select value={itemsPerPage.toString()} onValueChange={(value) => setItemsPerPage(Number(value))}>
            <SelectTrigger className="w-20">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="25">25</SelectItem>
              <SelectItem value="50">50</SelectItem>
              <SelectItem value="100">100</SelectItem>
            </SelectContent>
          </Select>
          
          <div className="flex border border-neutral-600 rounded">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    onClick={() => setViewMode("grid")}
                    className={`p-2 ${viewMode === "grid" ? "bg-brand-pink text-white" : "text-neutral-400 hover:text-white"}`}
                  >
                    <LayoutGrid className="h-4 w-4" />
                  </button>
                </TooltipTrigger>
                <TooltipContent>Grid View</TooltipContent>
              </Tooltip>
              
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    onClick={() => setViewMode("table")}
                    className={`p-2 ${viewMode === "table" ? "bg-brand-pink text-white" : "text-neutral-400 hover:text-white"}`}
                  >
                    <Rows3 className="h-4 w-4" />
                  </button>
                </TooltipTrigger>
                <TooltipContent>Table View</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
      </div>

      {/* NFT Display */}
      {viewMode === "grid" ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
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
              listingId={nft.listingId || 0}
              isForSale={nft.isForSale}
            />
          ))}
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-neutral-700">
                <th className="text-left p-3 text-sm font-medium text-neutral-300">NFT</th>
                <th 
                  className="text-left p-3 text-sm font-medium text-neutral-300 cursor-pointer hover:text-white"
                  onClick={() => handleSort('rank')}
                >
                  Rank {sortColumn === 'rank' && (sortDirection === 'asc' ? '↑' : '↓')}
                </th>
                <th 
                  className="text-left p-3 text-sm font-medium text-neutral-300 cursor-pointer hover:text-white"
                  onClick={() => handleSort('rarity')}
                >
                  Rarity {sortColumn === 'rarity' && (sortDirection === 'asc' ? '↑' : '↓')}
                </th>
                <th className="text-left p-3 text-sm font-medium text-neutral-300">Price</th>
                <th className="text-left p-3 text-sm font-medium text-neutral-300">Action</th>
              </tr>
            </thead>
            <tbody>
              {paginatedNFTs.map((nft) => (
                <tr key={nft.id} className="border-b border-neutral-800 hover:bg-neutral-800/50">
                  <td className="p-3">
                    <div className="flex items-center gap-3">
                      <Image
                        src={nft.image}
                        alt={nft.name}
                        width={48}
                        height={48}
                        className="rounded object-cover"
                      />
                      <div>
                        <div className="font-medium text-white">{nft.name}</div>
                        <div className="text-sm text-neutral-400">#{nft.cardNumber}</div>
                      </div>
                    </div>
                  </td>
                  <td className="p-3 text-neutral-300">{nft.rank}</td>
                  <td className="p-3">
                    <span className="px-2 py-1 bg-neutral-700 rounded text-sm">
                      {nft.rarity}
                    </span>
                  </td>
                  <td className="p-3 text-neutral-300">
                    {nft.isForSale ? `${nft.priceEth} ETH` : 'Not Listed'}
                  </td>
                  <td className="p-3">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => toggleFavorite({
                          tokenId: nft.tokenId,
                          name: nft.name,
                          image: nft.image,
                          rarity: nft.rarity,
                          rank: nft.rank,
                          rarityPercent: nft.rarityPercent
                        })}
                        className="p-1 hover:bg-neutral-700 rounded"
                      >
                        <Heart 
                          className={`h-4 w-4 ${isFavorited(nft.tokenId) ? 'text-red-500 fill-current' : 'text-neutral-400'}`} 
                        />
                      </button>
                      <Link href={`/nft/${nft.tokenId}`}>
                        <button className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded">
                          View
                        </button>
                      </Link>
                      {nft.isForSale && (
                        <BuyDirectListingButton
                          client={client}
                          chain={base}
                          contractAddress={process.env.NEXT_PUBLIC_MARKETPLACE_ADDRESS!}
                          listingId={BigInt(nft.listingId!)}
                          onTransactionSent={() => {
                            track('nft_purchase_attempt', { tokenId: nft.tokenId });
                          }}
                          onTransactionConfirmed={() => {
                            track('nft_purchase_success', { tokenId: nft.tokenId });
                          }}
                          className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded"
                        >
                          Buy
                        </BuyDirectListingButton>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination */}
      {filteredNFTs.length > itemsPerPage && (
        <div className="flex justify-center">
          <Pagination
            currentPage={currentPage}
            totalPages={Math.ceil(filteredNFTs.length / itemsPerPage)}
            totalItems={filteredNFTs.length}
            itemsPerPage={itemsPerPage}
            onPageChange={setCurrentPage}
          />
        </div>
      )}
    </div>
  );
}
