// src/app/nfts/page.tsx

"use client";
import { useState } from "react";
import { StatsCard } from "@/components/StatsCard";
import { Sidebar } from "@/components/Sidebar";
import { NFTGrid } from "@/components/NftGrid";
import { useDataSource } from "@/hooks/useDataSource";
import { STATIC_COLLECTION_STATS } from "@/data/staticNfts";

export default function NFTsPage() {
  const [filters, setFilters] = useState({});
  const [page, setPage] = useState(0);
  const { dataSource, isChecking } = useDataSource();

  // Use static stats for now - will switch to API when Insight is ready
  const stats = STATIC_COLLECTION_STATS;

  if (isChecking) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="loading loading-spinner loading-lg"></div>
          <p className="mt-4 text-gray-600">Checking data availability...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {dataSource === "static" && (
        <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded">
          <strong>Demo Mode:</strong> Showing sample NFTs. Live data will be available when collection is indexed.
        </div>
      )}
      <StatsCard stats={stats} />
      <div className="flex gap-6">
        <Sidebar filters={filters} setFilters={setFilters} />
        <NFTGrid
          dataSource={dataSource}
          filters={filters}
          page={page}
          setPage={setPage}
        />
      </div>
    </div>
  );
}
