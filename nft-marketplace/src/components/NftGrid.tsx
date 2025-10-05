// components/NftGrid.tsx
"use client";
import { useEffect, useMemo, useState } from "react";
import { BidBuyoutSection } from "./BidBuyoutSection";

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
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(24);
  const [sort, _setSort] = useState("buyoutPrice:asc");
  const [filters, _setFilters] = useState<{search?: string; minPrice?: string; maxPrice?: string}>({});

  const [events, setEvents] = useState<AuctionEvent[]>([]);
  const [metas, setMetas]   = useState<Record<string, unknown>>({});
  // const MARKET = process.env.NEXT_PUBLIC_MARKETPLACE_ADDRESS!;
  const COLLECTION = process.env.NEXT_PUBLIC_NFT_COLLECTION_ADDRESS!;

  async function load() {
    const qs = new URLSearchParams({ page: String(page), limit: String(limit), sort });
    if (filters.minPrice) qs.set("minPrice", filters.minPrice);
    if (filters.maxPrice) qs.set("maxPrice", filters.maxPrice);
    const res = await fetch(`/api/auctions?${qs.toString()}`);
    const data = await res.json();

    const evts: AuctionEvent[] = data.events ?? data.items ?? [];
    // Optional: apply name search after metadata (below) if needed
    setEvents(evts);

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
  }

  useEffect(() => { load(); }, [page, limit, sort, JSON.stringify(filters)]);

  // (Optional) client-side name search using fetched metadata
  const rows = useMemo(() => {
    if (!filters.search) return events;
    const q = filters.search.toLowerCase();
    return events.filter(e => {
      const key = `${e.nftContract ?? COLLECTION}:${e.tokenId}`;
      const name = (metas[key] as any)?.name?.toLowerCase?.() ?? "";
      return name.includes(q);
    });
  }, [events, metas, filters.search, COLLECTION]);

  return (
    <div className="space-y-4">
      {/* Sidebar lives next to Grid in page layout; call setFilters from there */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {rows.map(e => {
          const key = `${e.nftContract ?? COLLECTION}:${e.tokenId}`;
          return <NftCard key={key} auction={e} metadata={metas[key]} />;
        })}
      </div>

      <div className="flex items-center gap-2">
        <button onClick={() => setPage(p=>Math.max(1,p-1))}>Prev</button>
        <span>Page {page}</span>
        <button onClick={() => setPage(p=>p+1)}>Next</button>
        <select value={limit} onChange={e=>setLimit(parseInt(e.target.value,10))}>
          <option value={12}>12</option><option value={24}>24</option><option value={48}>48</option>
        </select>
      </div>
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
