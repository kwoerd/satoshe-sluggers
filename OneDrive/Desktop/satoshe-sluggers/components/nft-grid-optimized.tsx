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
import { getAllNFTs, searchNFTs, getTraitCounts, convertToLegacyFormat } from "@/lib/data-service";
import NFTCard from "./nft-card";
import { track } from '@vercel/analytics';
import { triggerPurchaseConfetti } from "@/lib/confetti";
import { LayoutGrid, Rows3, Grid3x3, Heart } from "lucide-react";
import { useFavorites } from "@/hooks/useFavorites";
import Link from "next/link";

interface NFTGridItem {
  id: string;
  tokenId: string;
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


export default function NFTGrid({ searchTerm, searchMode, selectedFilters, onFilteredCountChange, onTraitCountsChange }: NFTGridProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(25);
  const [sortBy, setSortBy] = useState("default");
  const [nfts, setNfts] = useState<NFTGridItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessingPurchase, setIsProcessingPurchase] = useState<{
    [id: string]: boolean;
  }>({});
  const [viewMode, setViewMode] = useState<'grid-large' | 'grid-medium' | 'grid-small' | 'compact'>('grid-large');
  
  const account = useActiveAccount();
  const { mutate: sendTransaction } = useSendTransaction();
  
  // Favorites functionality
  const { isFavorited, toggleFavorite } = useFavorites();

  // Load NFTs using lightweight data service
  useEffect(() => {
    const loadNFTs = async () => {
      try {
        setIsLoading(true);
        const { nfts: allNFTs } = await getAllNFTs(1, 7777); // Get all NFTs
        const mappedNFTs = allNFTs.map(convertToLegacyFormat);
        setNfts(mappedNFTs);
        
        // Get trait counts from data service
        const traitCounts = await getTraitCounts();
        onTraitCountsChange(traitCounts);
      } catch (error) {
        console.error('[NFTGrid] Error loading NFTs:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadNFTs();
  }, [onTraitCountsChange]);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [itemsPerPage, searchTerm]);

  // Filter and search NFTs using data service
  const [filteredNFTs, setFilteredNFTs] = useState<NFTGridItem[]>([]);
  const [isFiltering, setIsFiltering] = useState(false);

  useEffect(() => {
    const applyFilters = async () => {
      if (nfts.length === 0) return;
      
      try {
        setIsFiltering(true);
        
        // Use data service for search and filtering
        const searchQuery = searchMode === "exact" ? searchTerm : searchTerm;
        const searchResults = await searchNFTs(searchQuery, selectedFilters);
        const mappedResults = searchResults.map(convertToLegacyFormat);
        
        // Apply sorting
        const sortedResults = [...mappedResults];
        switch (sortBy) {
          case "rank-low":
            sortedResults.sort((a, b) => Number(a.rank) - Number(b.rank));
            break;
          case "rank-high":
            sortedResults.sort((a, b) => Number(b.rank) - Number(a.rank));
            break;
          case "price-low":
            sortedResults.sort((a, b) => a.price - b.price);
            break;
          case "price-high":
            sortedResults.sort((a, b) => b.price - a.price);
            break;
          case "rarity-low":
            sortedResults.sort((a, b) => Number(a.rarityPercent) - Number(b.rarityPercent));
            break;
          case "rarity-high":
            sortedResults.sort((a, b) => Number(b.rarityPercent) - Number(a.rarityPercent));
            break;
          case "name-a-z":
            sortedResults.sort((a, b) => a.name.localeCompare(b.name));
            break;
          case "name-z-a":
            sortedResults.sort((a, b) => b.name.localeCompare(a.name));
            break;
        }

        setFilteredNFTs(sortedResults);
        onFilteredCountChange(sortedResults.length);
      } catch (error) {
        console.error('Error filtering NFTs:', error);
        setFilteredNFTs(nfts);
        onFilteredCountChange(nfts.length);
      } finally {
        setIsFiltering(false);
      }
    };

    applyFilters();
  }, [nfts, searchTerm, searchMode, selectedFilters, sortBy, onFilteredCountChange]);

  // Pagination
  const totalPages = Math.ceil(filteredNFTs.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedNFTs = filteredNFTs.slice(startIndex, startIndex + itemsPerPage);

  // Purchase handler
  const handlePurchase = async (nft: NFTGridItem) => {
    if (!account) {
      alert('Please connect your wallet to purchase NFTs');
      return;
    }

    if (isProcessingPurchase[nft.id]) return;

    try {
      setIsProcessingPurchase(prev => ({ ...prev, [nft.id]: true }));
      
      // Use the listing ID from the complete metadata
      const listingId = nft.tokenId; // This maps to the listing ID in our data
      
      const transaction = await buyFromListing({
        contract: marketplace,
        listingId: BigInt(listingId),
        quantity: 1n,
        recipient: account.address,
      });

      await sendTransaction(transaction);
      
      track('NFT Purchased', { 
        tokenId: nft.tokenId, 
        price: nft.price,
        rarity: nft.rarity 
      });
      
      triggerPurchaseConfetti();
      
    } catch (error) {
      console.error('Purchase failed:', error);
      alert('Purchase failed. Please try again.');
    } finally {
      setIsProcessingPurchase(prev => ({ ...prev, [nft.id]: false }));
    }
  };

  // Price display helper
  const displayPrice = (priceWei: string) => {
    const price = parseFloat(priceWei) / 1e18;
    return price.toFixed(6).replace(/\.?0+$/, '');
  };

  // Loading state
  if (isLoading || isFiltering) {
    return (
      <div className="mt-8 mb-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-3">
        {Array.from({ length: 20 }).map((_, i) => (
          <div key={i} className="bg-neutral-800 rounded-sm border border-neutral-700 p-4 animate-pulse">
            <div className="aspect-square bg-neutral-700 rounded-sm mb-3"></div>
            <div className="h-4 bg-neutral-700 rounded mb-2"></div>
            <div className="h-3 bg-neutral-700 rounded w-2/3"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-sm text-neutral-400">
            {filteredNFTs.length} NFT{filteredNFTs.length !== 1 ? 's' : ''}
          </span>
        </div>
        
        <div className="flex items-center gap-3">
          {/* View Mode Toggle */}
          <div className="flex items-center border border-neutral-700 rounded-sm">
            <button
              onClick={() => setViewMode('grid-large')}
              className={`p-2 ${viewMode === 'grid-large' ? 'bg-neutral-700' : 'hover:bg-neutral-800'}`}
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('grid-medium')}
              className={`p-2 ${viewMode === 'grid-medium' ? 'bg-neutral-700' : 'hover:bg-neutral-800'}`}
            >
              <Grid3x3 className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('compact')}
              className={`p-2 ${viewMode === 'compact' ? 'bg-neutral-700' : 'hover:bg-neutral-800'}`}
            >
              <Rows3 className="w-4 h-4" />
            </button>
          </div>

          {/* Sort */}
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="default">Default</SelectItem>
              <SelectItem value="rank-low">Rank: Low to High</SelectItem>
              <SelectItem value="rank-high">Rank: High to Low</SelectItem>
              <SelectItem value="price-low">Price: Low to High</SelectItem>
              <SelectItem value="price-high">Price: High to Low</SelectItem>
              <SelectItem value="rarity-low">Rarity: Low to High</SelectItem>
              <SelectItem value="rarity-high">Rarity: High to Low</SelectItem>
              <SelectItem value="name-a-z">Name: A to Z</SelectItem>
              <SelectItem value="name-z-a">Name: Z to A</SelectItem>
            </SelectContent>
          </Select>

          {/* Items per page */}
          <Select value={itemsPerPage.toString()} onValueChange={(value) => setItemsPerPage(Number(value))}>
            <SelectTrigger className="w-20">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="12">12</SelectItem>
              <SelectItem value="25">25</SelectItem>
              <SelectItem value="50">50</SelectItem>
              <SelectItem value="100">100</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Grid/Table */}
      {viewMode === 'compact' ? (
        <div className="mt-4 mb-8 border border-neutral-700 rounded-sm overflow-hidden">
          <table className="w-full">
            <thead className="bg-neutral-800/50 border-b border-neutral-700">
              <tr>
                <th className="text-left px-4 py-3 text-xs sm:text-sm font-medium text-neutral-400">NFT</th>
                <th className="text-left px-4 py-3 text-xs sm:text-sm font-medium text-neutral-400">Rank</th>
                <th className="text-left px-4 py-3 text-xs sm:text-sm font-medium text-neutral-400">Rarity</th>
                <th className="text-left px-4 py-3 text-xs sm:text-sm font-medium text-neutral-400">Tier</th>
                <th className="text-left px-4 py-3 text-xs sm:text-sm font-medium text-neutral-400">Price</th>
                <th className="text-center px-4 py-3 text-xs sm:text-sm font-medium text-neutral-400">Favorite</th>
                <th className="text-right px-4 py-3 text-xs sm:text-sm font-medium text-neutral-400">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedNFTs.map((nft, index) => (
                <tr key={nft.id} className={`border-b border-neutral-700/50 hover:bg-neutral-800/30 transition-colors ${index % 2 === 0 ? 'bg-neutral-900/20' : ''}`}>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <Link href={`/nft/${nft.tokenId}`} className="flex items-center gap-3 cursor-pointer hover:opacity-80 transition-opacity">
                        <img src={nft.image} alt={nft.name} className="w-10 h-10 rounded object-contain" />
                        <div>
                          <p className="text-xs sm:text-sm font-medium text-neutral-100 truncate">{nft.name}</p>
                          <p className="text-xs text-neutral-500 truncate">Token ID: {nft.tokenId}</p>
                        </div>
                      </Link>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-xs sm:text-sm text-neutral-300 truncate">{nft.rank} / 7777</td>
                  <td className="px-4 py-3 text-xs sm:text-sm text-neutral-300 truncate">{nft.rarityPercent}%</td>
                  <td className="px-4 py-3 text-xs sm:text-sm text-neutral-300 truncate">{nft.rarity}</td>
                  <td className="px-4 py-3 text-xs sm:text-sm font-medium text-blue-500 truncate">{displayPrice(nft.priceWei)} ETH</td>
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
                        className="px-2 sm:px-3 py-1.5 bg-transparent border border-neutral-600 text-neutral-300 hover:bg-neutral-700 hover:text-white transition-all rounded-sm text-xs sm:text-sm font-medium"
                      >
                        View
                      </Link>
                      <button
                        onClick={() => handlePurchase(nft)}
                        disabled={isProcessingPurchase[nft.id] || !nft.isForSale}
                        className="px-2 sm:px-3 py-1.5 bg-blue-500 text-white hover:bg-blue-600 transition-all rounded-sm text-xs sm:text-sm font-medium disabled:opacity-50"
                      >
                        {isProcessingPurchase[nft.id] ? "..." : "Buy"}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className={`mt-4 mb-8 grid ${
          viewMode === 'grid-large' ? 'gap-3 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5' :
          viewMode === 'grid-medium' ? 'gap-2 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7' :
          'gap-1 grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-8 2xl:grid-cols-10'
        }`}>
          {paginatedNFTs.map((nft) => (
            <NFTCard
              key={nft.id}
              image={nft.image}
              name={nft.name}
              rank={nft.rank}
              rarity={nft.rarity}
              rarityPercent={nft.rarityPercent}
              price={displayPrice(nft.priceWei)}
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
        <div className="flex justify-center">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={filteredNFTs.length}
            itemsPerPage={itemsPerPage}
            onPageChange={setCurrentPage}
          />
        </div>
      )}
    </div>
  );
}
