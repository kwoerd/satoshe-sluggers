// nft-marketplace/src/app/page.tsx
"use client";

import { useLiveAuctions } from "@/hooks/useLiveAuctions";

export default function Home() {
  const { data, isLoading, isError, error } = useLiveAuctions();

  return (
    <main className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">DAO Sports Marketplace</h1>

      {/* Status badge */}
      <div
        className={`badge mb-6 ${
          data?.source === "insight" ? "bg-green-700" : "bg-orange-700"
        }`}
      >
        {data?.source === "insight" ? "🟢 Insight API" : "🟠 Fallback: Insight API"}
      </div>

      {isLoading && <p className="text-sm text-[var(--text-secondary)]">Loading auctions…</p>}
      {isError && <p className="text-sm text-red-400">Error: {(error as any)?.message}</p>}

      {!isLoading && data && (
        <>
          <p className="text-sm mb-4 text-[var(--text-secondary)]">
            {data.items.length} listings loaded.
          </p>

          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
            {data.items.slice(0, 24).map((a) => (
              <div key={`${a.listingId}-${a.tokenId}`} className="card p-4">
                <div className="text-xs text-[var(--text-secondary)]">Listing #{a.listingId}</div>
                <div className="mt-1 text-lg font-semibold">Token ID: {a.tokenId}</div>
                <div className="mt-2 text-sm">Bids: {a.bidCount ?? 0}</div>
                <div className="mt-1 text-sm">Ends: {a.endSec ?? 0}s</div>
              </div>
            ))}
          </div>
        </>
      )}
    </main>
  );
}