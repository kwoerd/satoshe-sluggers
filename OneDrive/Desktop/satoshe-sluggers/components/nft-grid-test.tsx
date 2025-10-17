"use client";

import { useState, useEffect } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Pagination from "@/components/ui/pagination";
import { useActiveAccount, useSendTransaction } from "thirdweb/react";
import { buyFromListing } from "thirdweb/extensions/marketplace";
import { marketplace } from "@/lib/contracts";
import { getAllTestNFTs, searchTestNFTs, getTestTraitCounts, convertTestNFTToLegacyFormat } from "@/lib/test-data-service";
import NFTCard from "./nft-card";
import { track } from '@vercel/analytics';
import { triggerPurchaseConfetti } from "@/lib/confetti";
import { LayoutGrid, Rows3, Grid3x3, Heart } from "lucide-react";
import { useFavorites } from "@/hooks/useFavorites";
import Link from "next/link";
import Image from "next/image";

interface NFTGridItem {
  id: string;
  tokenId: string;
  listingId?: number; // Add listing ID for marketplace purchases
  name: string;
  image: string;
  rank: number | string;
  rarity: string;
  rarityPercent: number | string;
  price: number;
  priceWei: string;
  isForSale: boolean;
  attributes: Array<{ trait_type: string; value: string; occurrence?: number; rarity?: number }>;
  description: string;
  artist: string;
  platform: string;
  series: string;
  rarityScore: number;
}

interface NFTGridProps {
  searchTerm: string;
  searchMode: string;
  selectedFilters: Record<string, string[]>;
  onFilteredCountChange: (count: number) => void;
  onTraitCountsChange: (counts: Record<string, Record<string, number>>) => void;
}

type ViewMode = 'grid-large' | 'grid-medium' | 'grid-small' | 'compact';

export default function NFTGridTest({
  searchTerm,
  searchMode: _searchMode, // eslint-disable-line @typescript-eslint/no-unused-vars
  selectedFilters,
  onFilteredCountChange,
  onTraitCountsChange,
}: NFTGridProps) {
  const [nfts, setNfts] = useState<NFTGridItem[]>([]);
  const [filteredNFTs, setFilteredNFTs] = useState<NFTGridItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFiltering, setIsFiltering] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>('grid-large');
  const [sortBy, setSortBy] = useState('rank');
  const [currentPage, setCurrentPage] = useState(1);
  const [isProcessingPurchase, setIsProcessingPurchase] = useState<Record<string, boolean>>({});
  
  const account = useActiveAccount();
  const { mutate: sendTransaction } = useSendTransaction();
  const { toggleFavorite, isFavorited } = useFavorites();

  const itemsPerPage = 20;

  // Load test NFTs
  useEffect(() => {
    const loadNFTs = async () => {
      try {
        setLoading(true);
        const testNFTs = getAllTestNFTs();
        const legacyNFTs = testNFTs.map(convertTestNFTToLegacyFormat);
        setNfts(legacyNFTs);
        setFilteredNFTs(legacyNFTs);
        
        // Load trait counts
        const traitCounts = getTestTraitCounts();
        onTraitCountsChange(traitCounts);
      } catch (error) {
        console.error('Error loading test NFTs:', error);
      } finally {
        setLoading(false);
      }
    };

    loadNFTs();
  }, [onTraitCountsChange]);

  // Filter and search NFTs
  useEffect(() => {
    const filterNFTs = async () => {
      if (nfts.length === 0) return;

      try {
        setIsFiltering(true);
        
        // Use test data search
        const results = searchTestNFTs(searchTerm, selectedFilters);
        const legacyResults = results.map(convertTestNFTToLegacyFormat);
        
        // Sort results
        const sortedResults = [...legacyResults].sort((a, b) => {
          switch (sortBy) {
            case 'rank':
              return Number(a.rank) - Number(b.rank);
            case 'rarity':
              return Number(b.rarityScore) - Number(a.rarityScore);
            case 'price-low':
              return a.price - b.price;
            case 'price-high':
              return b.price - a.price;
            case 'name':
              return a.name.localeCompare(b.name);
            default:
              return 0;
          }
        });

        setFilteredNFTs(sortedResults);
        onFilteredCountChange(sortedResults.length);
      } catch (error) {
        console.error('Error filtering NFTs:', error);
      } finally {
        setIsFiltering(false);
      }
    };

    filterNFTs();
  }, [searchTerm, selectedFilters, sortBy, nfts, onFilteredCountChange]);

  // Handle purchase
  const handlePurchase = async (nft: NFTGridItem) => {
    if (!account) {
      alert('Please connect your wallet to purchase NFTs');
      return;
    }

    if (!nft.isForSale) {
      alert('This NFT is not for sale');
      return;
    }

    if (isProcessingPurchase[nft.id]) return;

    try {
      setIsProcessingPurchase(prev => ({ ...prev, [nft.id]: true }));
      
      // Use the actual listing ID from test data
      const listingId = nft.listingId || nft.tokenId;
      
      if (!listingId) {
        throw new Error('No listing ID available for this NFT');
      }

      const transaction = await buyFromListing({
        contract: marketplace,
        listingId: BigInt(listingId),
        quantity: 1n,
        recipient: account.address,
      });

      await sendTransaction(transaction);
      
      track('NFT Purchased', { 
        tokenId: nft.tokenId, 
        listingId: listingId,
        price: nft.price,
        rarity: nft.rarity 
      });
      
      triggerPurchaseConfetti();
      alert('NFT purchased successfully! 🎉');
      
      // Update UI to reflect purchase - mark as sold
      setNfts(prevNfts => 
        prevNfts.map(n => 
          n.id === nft.id 
            ? { ...n, isForSale: false, price: 0, priceWei: "0" } 
            : n
        )
      );
      
    } catch (error) {
      console.error('Purchase failed:', error);
      const errorMessage = error instanceof Error ? error.message : 'Purchase failed. Please try again.';
      alert(`Purchase failed: ${errorMessage}`);
    } finally {
      setIsProcessingPurchase(prev => ({ ...prev, [nft.id]: false }));
    }
  };

  // Pagination
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedNFTs = filteredNFTs.slice(startIndex, endIndex);
  const totalPages = Math.ceil(filteredNFTs.length / itemsPerPage);

  // View mode icons
  const viewModeIcons = {
    'grid-large': LayoutGrid,
    'grid-medium': Grid3x3,
    'grid-small': Grid3x3,
    'compact': Rows3,
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-white">Loading Test NFTs...</h1>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="bg-neutral-900 rounded-sm border border-neutral-700 animate-pulse">
              <div className="aspect-[0.9/1] bg-neutral-800 rounded-t-sm"></div>
              <div className="p-4 space-y-2">
                <div className="h-4 bg-neutral-700 rounded w-3/4"></div>
                <div className="h-3 bg-neutral-700 rounded w-1/2"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with Collection Info */}
      <div className="w-full max-w-full">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 pl-2">
          <div>
            <h1 className="text-2xl font-bold text-white mb-1">TEST - SATOSHE SLUGGERS</h1>
            <h2 className="text-lg font-medium text-neutral-300">NFT Collection (Test Mode)</h2>
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
        </div>
      </div>

      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-sm text-neutral-400">View:</span>
          <div className="flex bg-neutral-800 rounded-sm border border-neutral-700">
            {Object.entries(viewModeIcons).map(([mode, Icon]) => (
              <button
                key={mode}
                onClick={() => setViewMode(mode as ViewMode)}
                className={`p-2 transition-colors ${
                  viewMode === mode
                    ? 'bg-[#ff0099] text-white'
                    : 'text-neutral-400 hover:text-white hover:bg-neutral-700'
                }`}
                title={mode.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
              >
                <Icon className="h-4 w-4" />
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-sm text-neutral-400">Sort by:</span>
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-40 bg-neutral-800 border-neutral-700 text-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-neutral-800 border-neutral-700">
              <SelectItem value="rank" className="text-white hover:bg-neutral-700">Rank</SelectItem>
              <SelectItem value="rarity" className="text-white hover:bg-neutral-700">Rarity</SelectItem>
              <SelectItem value="price-low" className="text-white hover:bg-neutral-700">Price: Low to High</SelectItem>
              <SelectItem value="price-high" className="text-white hover:bg-neutral-700">Price: High to Low</SelectItem>
              <SelectItem value="name" className="text-white hover:bg-neutral-700">Name</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Loading indicator for filtering */}
      {isFiltering && (
        <div className="text-center py-4">
          <div className="text-sm text-neutral-400">Filtering NFTs...</div>
        </div>
      )}

      {/* NFT Grid */}
      {paginatedNFTs.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-neutral-400 text-lg">No NFTs found matching your criteria</div>
          <div className="text-neutral-500 text-sm mt-2">Try adjusting your search or filters</div>
        </div>
      ) : (
        <>
          {viewMode === 'compact' ? (
            <div className="bg-neutral-900 rounded-sm border border-neutral-700 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-neutral-800 border-b border-neutral-700">
                    <tr>
                      <th className="text-left p-4 text-xs sm:text-sm font-medium text-neutral-300">NFT</th>
                      <th className="text-left p-4 text-xs sm:text-sm font-medium text-neutral-300">Name</th>
                      <th className="text-left p-4 text-xs sm:text-sm font-medium text-neutral-300">Rank</th>
                      <th className="text-left p-4 text-xs sm:text-sm font-medium text-neutral-300">Rarity</th>
                      <th className="text-left p-4 text-xs sm:text-sm font-medium text-neutral-300">Tier</th>
                      <th className="text-left p-4 text-xs sm:text-sm font-medium text-neutral-300">Price</th>
                      <th className="text-left p-4 text-xs sm:text-sm font-medium text-neutral-300">Favorite</th>
                      <th className="text-left p-4 text-xs sm:text-sm font-medium text-neutral-300">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedNFTs.map((nft) => (
                      <tr key={nft.id} className="border-b border-neutral-700 hover:bg-neutral-800/50">
                        <td className="p-4">
                          <Link href={`/nft/${nft.tokenId}`} className="block">
                            <Image src={nft.image} alt={nft.name} width={40} height={40} className="rounded object-contain" />
                          </Link>
                        </td>
                        <td className="p-4">
                          <Link href={`/nft/${nft.tokenId}`} className="block">
                            <div className="text-xs sm:text-sm font-medium text-white truncate max-w-[200px]">
                              {nft.name}
                            </div>
                          </Link>
                        </td>
                        <td className="p-4 text-xs sm:text-sm text-neutral-300 truncate">
                          {nft.rank}
                        </td>
                        <td className="p-4 text-xs sm:text-sm text-neutral-300 truncate">
                          {nft.rarityPercent}%
                        </td>
                        <td className="p-4 text-xs sm:text-sm text-neutral-300 truncate">
                          {nft.rarity}
                        </td>
                        <td className="p-4 text-xs sm:text-sm text-neutral-300 truncate">
                          {nft.isForSale ? `${nft.price} ETH` : 'Not for sale'}
                        </td>
                        <td className="p-4">
                          <button
                            onClick={() => toggleFavorite({
                              tokenId: nft.tokenId,
                              name: nft.name,
                              image: nft.image,
                              rarity: nft.rarity,
                              rank: nft.rank,
                              rarityPercent: nft.rarityPercent
                            })}
                            className="p-1 hover:bg-neutral-700 rounded transition-colors"
                          >
                            <Heart className={`w-4 h-4 ${isFavorited(nft.tokenId) ? "fill-[#ff0099] text-[#ff0099]" : "text-neutral-400"}`} />
                          </button>
                        </td>
                        <td className="p-4">
                          {nft.isForSale ? (
                            <button
                              onClick={() => handlePurchase(nft)}
                              disabled={isProcessingPurchase[nft.id]}
                              className="bg-[#3B82F6] text-white px-3 py-1 text-xs rounded-sm hover:bg-[#2563EB] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              {isProcessingPurchase[nft.id] ? 'Buying...' : 'BUY'}
                            </button>
                          ) : (
                            <span className="text-xs text-neutral-500">Sold</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div className={`grid gap-3 ${
              viewMode === 'grid-large' ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' :
              viewMode === 'grid-medium' ? 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6' :
              'grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8'
            }`}>
              {paginatedNFTs.map((nft) => (
                <NFTCard
                  key={nft.id}
                  image={nft.image}
                  name={nft.name}
                  rank={nft.rank}
                  rarity={nft.rarity}
                  rarityPercent={nft.rarityPercent}
                  price={nft.isForSale ? `${nft.price} ETH` : 'Not for sale'}
                  tokenId={nft.tokenId}
                  isForSale={nft.isForSale}
                  onPurchase={() => handlePurchase(nft)}
                  isProcessing={isProcessingPurchase[nft.id] || false}
                  viewMode={viewMode}
                />
              ))}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center mt-8">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
                totalItems={filteredNFTs.length}
                itemsPerPage={itemsPerPage}
              />
            </div>
          )}
        </>
      )}
    </div>
  );
}
