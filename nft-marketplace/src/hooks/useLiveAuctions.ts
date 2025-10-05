"use client";

import { useQuery } from "@tanstack/react-query";

export function useLiveAuctions() {
  return useQuery({
    queryKey: ["live-auctions"],
    queryFn: async () => {
      const res = await fetch("/api/auctions/live");
      if (!res.ok) throw new Error("Failed to fetch live auctions");
      return res.json();
    },
    refetchInterval: 30000, // refresh every 30s
  });
}
