// src/components/NFTGrid.tsx

import { useQuery } from "@tanstack/react-query";
import { NFTCard } from "./NftCard";

interface FilterState {
  search?: string;
  sort?: string;
}

interface NFT {
  tokenId: string;
  listingId?: number | null;
  metadata?: {
    image?: string;
    name?: string;
    description?: string;
  };
  auction?: {
    listingId: number;
    endTime: number;
    bidCount: number;
    status: string;
    timeRemaining: number;
    timeRemainingFormatted: string;
    minBid: string;
    buyoutPrice: string;
    rank: number | null;
    rarity: string | null;
    tier: string | null;
  } | null;
}

export function NFTGrid({
  filters,
  page,
  setPage,
  collectionAddress,
  insightClientId,
  chainId,
}: {
  filters: FilterState;
  page: number;
  setPage: (p: number) => void;
  collectionAddress: string;
  insightClientId: string;
  chainId: string | number;
}) {
  // Build Insight query
  const params = new URLSearchParams({
    page: String(page),
    limit: "40",
    sortBy: filters.sort?.split("_")[0] || "tokenId",
    sortOrder: filters.sort?.split("_")[1] || "asc",
    clientId: insightClientId,
  });
  if (filters.search) params.append("search", filters.search);

  const { data, isLoading } = useQuery({
    queryKey: ["nftgrid", collectionAddress, params.toString()],
    queryFn: async () =>
      fetch(`/api/auctions?${params}`).then((r) => r.json()),
  });

  return (
    <div className="w-full">
      {isLoading ? (
        <div>Loading NFTs…</div>
      ) : (
        <div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {data?.events?.map((nft: NFT) => (
              <NFTCard key={nft.tokenId} nft={nft} />
            ))}
          </div>
          <div className="flex justify-center gap-4 mt-6">
            <button
              disabled={page === 0}
              className="btn"
              onClick={() => setPage(page - 1)}
            >
              Prev
            </button>
            <button
              disabled={!data?.events?.length || data?.events?.length < 40}
              className="btn"
              onClick={() => setPage(page + 1)}
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}