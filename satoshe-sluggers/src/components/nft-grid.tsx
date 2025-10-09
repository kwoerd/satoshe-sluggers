"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { useReadContract } from "thirdweb/react";
import { marketplace } from "../lib/contracts";
import { loadNFTMetadata } from "../utils/nft-utils";
import { NFTCardData, Auction } from "../lib/types";
import { NFTCard } from "./nft-card";
import { Skeleton } from "./ui/skeleton";
import Pagination from "./ui/pagination";

interface NFTGridProps {
  searchTerm: string;
  selectedFilters: Record<string, any>;
  onFilteredCountChange: (count: number) => void;
  onTraitCountsChange: (counts: Record<string, Record<string, number>>) => void;
}

export function NFTGrid({ 
  searchTerm, 
  selectedFilters, 
  onFilteredCountChange, 
  onTraitCountsChange 
}: NFTGridProps) {
  const [nfts, setNfts] = useState<NFTCardData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(24);
  const [sortBy, setSortBy] = useState<"tokenId" | "rarity" | "price">("tokenId");

  // Fetch auction data
  const { data: auctions, isLoading: auctionsLoading } = useReadContract({
    contract: marketplace,
    method: "function getAllValidAuctions(uint256 _startId, uint256 _endId) view returns ((uint256 auctionId, uint256 tokenId, uint256 quantity, uint256 minimumBidAmount, uint256 buyoutBidAmount, uint64 timeBufferInSeconds, uint64 bidBufferBps, uint64 startTimestamp, uint64 endTimestamp, address auctionCreator, address assetContract, address currency, uint8 tokenType, uint8 status)[] _validAuctions)",
    params: [0n, 1000n],
  });

  // Load and combine data
  useEffect(() => {
    const loadData = async () => {
      if (auctionsLoading || !auctions) return;

      try {
        setIsLoading(true);
        
        // Load metadata
        const metadata = await loadNFTMetadata();
        
        // Filter valid auctions (status 1 = active)
        const validAuctions = (auctions as unknown as Auction[]).filter(auction => auction.status === 1);
        
        // Create auction map
        const auctionMap = new Map<string, Auction>();
        validAuctions.forEach(auction => {
          auctionMap.set(auction.tokenId.toString(), auction);
        });
        
        // Combine data
        const combinedData: NFTCardData[] = [];
        for (const nft of metadata) {
          const auction = auctionMap.get(nft.token_id.toString());
          const combined: NFTCardData = {
            tokenId: nft.token_id.toString(),
            name: nft.name,
            image: nft.image || '/placeholder-nft.webp',
            rarity: nft.rarity_tier,
            rank: nft.rank,
            rarityPercent: nft.rarity_percent,
            minBid: auction ? (Number(auction.minimumBidAmount) / 1e18).toFixed(4) + ' ETH' : 'N/A',
            buyNow: auction ? (Number(auction.buyoutBidAmount) / 1e18).toFixed(4) + ' ETH' : 'N/A',
            isLive: auction ? auction.status === 1 : false,
            isSold: auction ? auction.status === 2 : false,
            isEnded: auction ? auction.status === 0 : false,
            auction: auction
          };
          combinedData.push(combined);
        }
        
        setNfts(combinedData);
      } catch (error) {
        console.error("Error loading NFT data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [auctions, auctionsLoading]);

  // Filter and search
  const filteredNFTs = useMemo(() => {
    let filtered = nfts;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(nft => 
        nft.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        nft.tokenId.includes(searchTerm)
      );
    }

    // Trait filters
    Object.entries(selectedFilters).forEach(([trait, values]) => {
      if (values && values.length > 0) {
        filtered = filtered.filter(nft => {
          // This would need to be implemented based on your trait structure
          return true; // Placeholder
        });
      }
    });

    return filtered;
  }, [nfts, searchTerm, selectedFilters]);

  // Sort
  const sortedNFTs = useMemo(() => {
    return [...filteredNFTs].sort((a, b) => {
      switch (sortBy) {
        case "tokenId":
          return Number(a.tokenId) - Number(b.tokenId);
        case "rarity":
          return a.rank - b.rank;
        case "price":
          return Number(a.minBid) - Number(b.minBid);
        default:
          return 0;
      }
    });
  }, [filteredNFTs, sortBy]);

  // Pagination
  const paginatedNFTs = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return sortedNFTs.slice(startIndex, startIndex + itemsPerPage);
  }, [sortedNFTs, currentPage, itemsPerPage]);

  // Update counts
  useEffect(() => {
    onFilteredCountChange(filteredNFTs.length);
    
    // Calculate trait counts
    const traitCounts: Record<string, Record<string, number>> = {};
    filteredNFTs.forEach(nft => {
      // This would need to be implemented based on your trait structure
    });
    onTraitCountsChange(traitCounts);
  }, [filteredNFTs, onFilteredCountChange, onTraitCountsChange]);

  // Calculate live/sold counts
  const liveCount = filteredNFTs.filter(nft => nft.isLive).length;
  const soldCount = filteredNFTs.filter(nft => nft.isSold).length;
  const endedCount = filteredNFTs.filter(nft => nft.isEnded).length;

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">
            NFT Collection
          </h2>
          <p className="text-muted-foreground">
            Loading collection...
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} className="space-y-4">
              <Skeleton className="h-64 w-full rounded-lg" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-8 w-full" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Collection Header */}
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">
          NFT Collection
        </h2>
        <p className="text-muted-foreground">
          {liveCount} Live • {soldCount} Sold{endedCount > 0 ? ` • ${endedCount} Ended` : ''}
        </p>
      </div>

      {/* Sort Controls */}
      <div className="flex justify-between items-center">
        <p className="text-sm text-muted-foreground">
          Showing {paginatedNFTs.length} of {filteredNFTs.length} NFTs
        </p>
        <select 
          value={sortBy} 
          onChange={(e) => setSortBy(e.target.value as any)}
          className="px-3 py-1 border rounded"
        >
          <option value="tokenId">Token ID</option>
          <option value="rarity">Rarity</option>
          <option value="price">Price</option>
        </select>
      </div>

      {/* NFT Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {paginatedNFTs.map((nft) => (
          <NFTCard key={nft.tokenId} nft={nft} />
        ))}
      </div>

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
