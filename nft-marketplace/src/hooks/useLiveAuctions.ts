import { useState, useEffect } from 'react';

interface AuctionItem {
  listingId: string;
  tokenId: string;
  bidCount: number;
  endSec: number;
  startSec?: number;
  reservePrice?: string;
  buyoutPrice?: string;
  blockNumber?: number;
  transactionHash?: string;
}

interface LiveAuctionsResponse {
  source: string;
  total?: number;
  items: AuctionItem[];
  pagination?: {
    page: number;
    limit: number;
    hasMore: boolean;
  };
  reason?: string;
}

interface UseLiveAuctionsReturn {
  data: LiveAuctionsResponse | null;
  isLoading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useLiveAuctions(
  page: number = 1,
  limit: number = 25
): UseLiveAuctionsReturn {
  const [data, setData] = useState<LiveAuctionsResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAuctions = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await fetch(`/api/auctions?type=live&page=${page}&limit=${limit}&t=${Date.now()}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch auctions');
      console.error('Error fetching live auctions:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAuctions();
  }, [page, limit]);

  return {
    data,
    isLoading,
    error,
    refetch: fetchAuctions,
  };
}