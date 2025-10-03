// src/app/nfts/page.tsx

"use client";
import { useState } from "react";
import { StatsCard } from "@/components/StatsCard";
import { Sidebar } from "@/components/Sidebar";
import { NFTGrid } from "@/components/NftGrid";
import { useQuery } from "@tanstack/react-query";

// Constants
const INSIGHT_CLIENT_ID = process.env.NEXT_PUBLIC_INSIGHT_CLIENT_ID!;
const COLLECTION_ADDRESS = process.env.NEXT_PUBLIC_NFT_COLLECTION_ADDRESS!;
const CHAIN_ID = process.env.NEXT_PUBLIC_CHAIN_ID || "8453"; // Base default

export default function NFTsPage() {
  const [filters, setFilters] = useState({});
  const [page, setPage] = useState(0);

  // Fetch collection stats from our API (fallback until Insight indexes)
  const { data: stats } = useQuery({
    queryKey: ["stats", COLLECTION_ADDRESS],
    queryFn: async () =>
      fetch(`/api/collection-stats`).then((r) => r.json()),
  });

  return (
    <div className="flex flex-col gap-4">
      <StatsCard stats={stats} />
      <div className="flex gap-6">
        <Sidebar filters={filters} setFilters={setFilters} />
        <NFTGrid
          filters={filters}
          page={page}
          setPage={setPage}
          collectionAddress={COLLECTION_ADDRESS}
          insightClientId={INSIGHT_CLIENT_ID}
          chainId={CHAIN_ID}
        />
      </div>
    </div>
  );
}
