// src/components/NftCollection.tsx

"use client";

import { useQuery } from "@tanstack/react-query";
import NftCard from "./NftCard";

interface NftCollectionProps {
  contractAddress: string;
  chainId?: string;
  limit?: number;
  page?: number;
  className?: string;
}

export default function NftCollection({ 
  contractAddress, 
  chainId = process.env.NEXT_PUBLIC_CHAIN_ID!,
  limit = 12,
  page = 1,
  className = ""
}: NftCollectionProps) {
  const { data, isLoading, error } = useQuery({
    queryKey: ["nft-collection", contractAddress, chainId, limit, page],
    queryFn: async () => {
      const res = await fetch(`/api/auctions?page=${page}&limit=${limit}&contract=${contractAddress}&chainId=${chainId}`);
      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`API Error ${res.status}: ${errorText}`);
      }
      return res.json();
    },
    refetchInterval: 20000, // 🔄 every 20 seconds
  });

  if (isLoading) return (
    <div className={`p-4 text-center ${className}`}>
      <div className="inline-flex items-center space-x-2 text-gray-500">
        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-500"></div>
        <span className="text-sm">Loading NFTs…</span>
      </div>
    </div>
  );
  
  if (error) {
    console.error("NftCollection error:", error);
    return (
      <div className={`p-4 text-center ${className}`}>
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-600 text-sm font-medium mb-2">Error loading NFTs</p>
          <p className="text-red-500 text-xs">{String(error)}</p>
          <p className="text-gray-500 text-xs mt-2">Check console for more details</p>
        </div>
      </div>
    );
  }

  const nfts = data?.events ?? [];

  if (nfts.length === 0) {
    return (
      <div className={`p-4 text-center ${className}`}>
        <p className="text-gray-500">No NFTs found in collection</p>
        <p className="text-gray-400 text-sm mt-1">Check your NFT collection address</p>
      </div>
    );
  }

  return (
    <div className={`grid grid-cols-1 md:grid-cols-3 gap-6 ${className}`}>
      {nfts.map((nft: any, index: number) => ( // eslint-disable-line @typescript-eslint/no-explicit-any
        <NftCard 
          key={nft.tokenId || `nft-${index}`} 
          nft={nft} 
          priority={index < 3} // Prioritize first 3 images for LCP
        />
      ))}
    </div>
  );
}
