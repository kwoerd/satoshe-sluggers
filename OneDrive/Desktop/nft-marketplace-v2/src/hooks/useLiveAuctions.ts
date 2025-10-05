// nft-marketplace/src/hooks/useLiveAuctions.ts
"use client";

import { useQuery } from "@tanstack/react-query";

export type AuctionItem = {
  listingId: number;
  tokenId: number;
  bidCount?: number;
  endSec?: number;
};

export function useLiveAuctions() {
  return useQuery({
    queryKey: ["auction-map"],
    queryFn: async (): Promise<{ source: string; items: AuctionItem[] }> => {
      const res = await fetch("/api/auction-map", { cache: "no-store" });
      if (!res.ok) throw new Error(`Auction map ${res.status}`);
      return res.json();
    },
    staleTime: 30_000,
    refetchInterval: 30_000,
  });
}
