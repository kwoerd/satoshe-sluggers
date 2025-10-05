// components/NftGrid.tsx
"use client";
import { useEffect, useMemo, useState } from "react";
import { BidBuyoutSection } from "./BidBuyoutSection";
import NFTPagination from "./ui/pagination";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { useAuctionContext, useAuctionActions } from "@/contexts/AuctionContext";

type AuctionEvent = {
  // Shape depends on your Insight response
  tokenId: string;
  nftContract: string;
  buyoutPrice?: string;
  startingPrice?: string;
  endTime?: number;
  bidCount?: number;
  minNextBid?: string;
};

export default function NftGrid() {
  const { state } = useAuctionContext();
  const { setPage, setLimit, setLoading, setTotalItems } = useAuctionActions();
  
  const [events, setEvents] = useState<AuctionEvent[]>([]);
  const [metas, setMetas] = useState<Record<string, unknown>>({});
  // const MARKET = process.env.NEXT_PUBLIC_MARKETPLACE_ADDRESS!;
  const COLLECTION = process.env.NEXT_PUBLIC_NFT_COLLECTION_ADDRESS!;

  async function load() {
    setLoading(true);
    try {
      const qs = new URLSearchParams({ 
        page: String(state.page), 
        limit: String(state.limit), 
        sort: state.sort, 
        type: "live" 
      });
      if (state.filters.minPrice) qs.set("minPrice", state.filters.minPrice);
      if (state.filters.maxPrice) qs.set("maxPrice", state.filters.maxPrice);
      const res = await fetch(`/api/auctions?${qs.toString()}`);
      const data = await res.json();

      const evts: AuctionEvent[] = data.items ?? [];
      setEvents(evts);
      setTotalItems(data.total ?? evts.length);

      // fetch metadata for each (in parallel)
      const reqs = evts.map(e =>
        fetch(`/api/metadata?contract=${e.nftContract ?? COLLECTION}&tokenId=${e.tokenId}`)
          .then(r => r.json())
          .then(j => ({ key: `${e.nftContract}:${e.tokenId}`, meta: j }))
      );
      const results = await Promise.all(reqs);
      const map: Record<string, unknown> = {};
      results.forEach(r => { map[r.key] = r.meta; });
      setMetas(map);
    } catch (error) {
      console.error("Error loading auctions:", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, [state.page, state.limit, state.sort, JSON.stringify(state.filters)]);

  // (Optional) client-side name search using fetched metadata
  const rows = useMemo(() => {
    if (!state.filters.search) return events;
    const q = state.filters.search.toLowerCase();
    return events.filter(e => {
      const key = `${e.nftContract ?? COLLECTION}:${e.tokenId}`;
      const name = (metas[key] as any)?.name?.toLowerCase?.() ?? "";
      return name.includes(q);
    });
  }, [events, metas, state.filters.search, COLLECTION]);

  const totalPages = Math.ceil(state.totalItems / state.limit);

  return (
    <div className="space-y-4">
      {/* Items per page selector */}
      <div className="flex items-center gap-4 mb-4">
        <label className="text-sm text-neutral-400">Items per page:</label>
        <Select value={state.limit.toString()} onValueChange={(value) => setLimit(parseInt(value))}>
          <SelectTrigger className="w-20">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="25">25</SelectItem>
            <SelectItem value="50">50</SelectItem>
            <SelectItem value="100">100</SelectItem>
            <SelectItem value="250">250</SelectItem>
          </SelectContent>
        </Select>
        <span className="text-sm text-neutral-400">
          Showing {events.length} of {state.totalItems} NFTs
        </span>
      </div>

      {/* Loading state */}
      {state.isLoading && (
        <div className="flex justify-center items-center py-8">
          <div className="text-neutral-400">Loading NFTs...</div>
        </div>
      )}

      {/* NFT Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {rows.map((e, index) => {
          const key = `${e.nftContract ?? COLLECTION}:${e.tokenId}`;
          return <NftCard key={`${key}-${index}`} auction={e} metadata={metas[key]} />;
        })}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <NFTPagination
          currentPage={state.page}
          totalPages={totalPages}
          totalItems={state.totalItems}
          itemsPerPage={state.limit}
          onPageChange={setPage}
        />
      )}
    </div>
  );
}

// Minimal card:
function NftCard({ auction, metadata }: { auction: AuctionEvent; metadata: unknown }) {
  const { image, name, rank, rarity_tier, rarity_percent } = (metadata as any) ?? {};
  const remainingMs = Math.max(0, (auction.endTime ?? 0) * 1000 - Date.now());
  const hhmmss = new Date(remainingMs).toISOString().substring(11, 19);

  return (
    <div className="rounded-xl border p-3 space-y-2">
      {image && <img src={image} alt={name ?? "NFT"} className="w-full rounded" />}
      <div className="font-semibold">{name ?? `#${auction.tokenId}`}</div>
      {rank && <div>Rank: {rank}</div>}
      {rarity_tier && <div>Rarity: {rarity_tier} ({rarity_percent}%)</div>}
      <div>Time Left: {hhmmss}</div>
      <div>Bids: {auction.bidCount ?? 0}</div>
      <div>Start: {auction.startingPrice ?? "-"}</div>
      <div>Min Next Bid: {auction.minNextBid ?? "-"}</div>
      <div>Buyout: {auction.buyoutPrice ?? "-"}</div>
      <BidBuyoutSection
        contractAddress={process.env.NEXT_PUBLIC_MARKETPLACE_ADDRESS!}
        auctionId={BigInt(auction.tokenId)} // adjust if different ID
        minBid={auction.minNextBid}
        buyoutPrice={auction.buyoutPrice}
      />
    </div>
  );
}
