"use client";
import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { NFTCard } from "./NftCard";
import { Skeleton } from "./ui/skeleton";
import { STATIC_NFTS, StaticNFT } from "@/data/staticNfts";
import { DataSource } from "@/hooks/useDataSource";

interface NFTGridProps {
  dataSource: DataSource;
  filters: any; // eslint-disable-line @typescript-eslint/no-explicit-any
  page: number;
  setPage: (page: number) => void;
}

export function NFTGrid({
  dataSource,
  filters,
  page,
  setPage,
}: NFTGridProps) {
  const [limit] = useState(48);

  // Static data handling with search/sort/filter
  const staticNfts = useMemo(() => {
    let filtered = [...STATIC_NFTS];

    // Search filter
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      filtered = filtered.filter(
        (nft) =>
          nft.metadata.name.toLowerCase().includes(searchTerm) ||
          nft.tokenId.includes(searchTerm)
      );
    }

    // Sort filter
    if (filters.sort) {
      switch (filters.sort) {
        case "tokenId_asc":
          filtered.sort((a, b) => parseInt(a.tokenId) - parseInt(b.tokenId));
          break;
        case "tokenId_desc":
          filtered.sort((a, b) => parseInt(b.tokenId) - parseInt(a.tokenId));
          break;
        case "price_asc":
          filtered.sort((a, b) => {
            const priceA = a.auction ? parseFloat(a.auction.minBid) : 0;
            const priceB = b.auction ? parseFloat(b.auction.minBid) : 0;
            return priceA - priceB;
          });
          break;
        case "price_desc":
          filtered.sort((a, b) => {
            const priceA = a.auction ? parseFloat(a.auction.minBid) : 0;
            const priceB = b.auction ? parseFloat(b.auction.minBid) : 0;
            return priceB - priceA;
          });
          break;
      }
    }

    return filtered;
  }, [filters]);

  // Live data fetching (when Insight is available)
  const { data: liveData, isLoading, error } = useQuery({
    queryKey: ["auctions", page, limit, filters],
    queryFn: async () => {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        ...filters,
      });
      const res = await fetch(`/api/auctions?${params}`);
      return res.json();
    },
    refetchInterval: 30000,
    enabled: dataSource === "insight", // Only fetch when using Insight
  });

  if (dataSource === "static") {
    // Paginate static data
    const startIndex = page * limit;
    const endIndex = startIndex + limit;
    const paginatedNfts = staticNfts.slice(startIndex, endIndex);

    return (
      <div className="flex-1">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {paginatedNfts.map((nft: StaticNFT, index: number) => (
            <NFTCard
              key={nft.tokenId}
              nft={nft}
            />
          ))}
        </div>

        {/* Pagination for static data */}
        <div className="flex justify-center items-center gap-4 mt-8">
          <button
            onClick={() => setPage(Math.max(0, page - 1))}
            disabled={page === 0}
            className="btn btn-outline"
          >
            Previous
          </button>
          <span className="text-sm text-gray-600">
            Page {page + 1} of {Math.ceil(staticNfts.length / limit)}
          </span>
          <button
            onClick={() => setPage(page + 1)}
            disabled={endIndex >= staticNfts.length}
            className="btn btn-outline"
          >
            Next
          </button>
        </div>
      </div>
    );
  }

  // Live data handling
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {Array.from({ length: 12 }).map((_, i) => (
          <div key={i} className="space-y-3">
            <Skeleton className="aspect-square w-full" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Failed to load NFTs
        </h3>
        <p className="text-gray-600">
          {error instanceof Error ? error.message : "Unknown error occurred"}
        </p>
      </div>
    );
  }

  const nfts = liveData?.events || [];

  if (nfts.length === 0) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          No NFTs found
        </h3>
        <p className="text-gray-600">
          Try adjusting your search or filter criteria.
        </p>
      </div>
    );
  }

  return (
    <div className="flex-1">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {nfts.map((nft: any, index: number) => ( // eslint-disable-line @typescript-eslint/no-explicit-any
          <NFTCard
            key={nft.tokenId}
            nft={nft}
          />
        ))}
      </div>

      {/* Pagination for live data */}
      <div className="flex justify-center items-center gap-4 mt-8">
        <button
          onClick={() => setPage(Math.max(0, page - 1))}
          disabled={page === 0}
          className="btn btn-outline"
        >
          Previous
        </button>
        <span className="text-sm text-gray-600">
          Page {page + 1} of {Math.ceil((liveData?.totalCount || 0) / limit)}
        </span>
        <button
          onClick={() => setPage(page + 1)}
          disabled={nfts.length < limit}
          className="btn btn-outline"
        >
          Next
        </button>
      </div>
    </div>
  );
}