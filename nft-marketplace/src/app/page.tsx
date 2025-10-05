"use client";

import { useLiveAuctions } from "@/hooks/useLiveAuctions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function Home() {
  const { data, isLoading, error } = useLiveAuctions();

  // Diagnostic UI with color-coded status
  if (isLoading) 
    return (
      <main className="p-10 min-h-screen bg-neutral-900 text-neutral-100">
        <h1 className="text-3xl font-bold mb-6">Satoshe Sluggers</h1>
        <div className="text-yellow-400 text-xl">🟡 Loading Auctions...</div>
      </main>
    );

  if (error) 
    return (
      <main className="p-10 min-h-screen bg-neutral-900 text-neutral-100">
        <h1 className="text-3xl font-bold mb-6">Satoshe Sluggers</h1>
        <div className="text-red-500 text-xl">🔴 Error fetching auctions: {error}</div>
      </main>
    );

  const items = data?.items || [];

  return (
    <main className="p-10 min-h-screen bg-neutral-900 text-neutral-100">
      <h1 className="text-3xl font-bold mb-6">Satoshe Sluggers</h1>
      
      {/* Diagnostic Status Banner */}
      <div className="mb-6 p-4 rounded-lg border">
        {data?.source === "insight" && (
          <p className="text-green-400 text-lg">
            🟢 Insight API — {data?.total || 0} listings loaded from Thirdweb Insight
          </p>
        )}
        {data?.source === "static-json" && (
          <p className="text-orange-400 text-lg">
            🟠 Fallback: Static JSON — {data?.items?.length || 0} listings loaded from fallback data
            {data?.reason && <span className="block text-sm text-orange-300">Reason: {data.reason}</span>}
          </p>
        )}
        {!data?.source && (
          <p className="text-red-500 text-lg">
            🔴 No data source detected
          </p>
        )}
      </div>

      {items.length === 0 ? (
        <div className="text-neutral-500 text-xl">
          No active auctions found.
        </div>
      ) : (
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((auction: any, index: number) => (
            <Card key={`${auction.listingId}-${auction.tokenId}-${index}`} className="p-4 border border-neutral-700 rounded-lg">
              <CardHeader>
                <CardTitle>Listing #{auction.listingId}</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-neutral-300">
                <p>Token ID: {auction.tokenId}</p>
                <p>Bids: {auction.bidCount || 0}</p>
                <p>Ends: {auction.endSec || 0}s</p>
                <p>Start: {auction.startSec || 0}s</p>
                <p>Reserve: {auction.reservePrice || "0"}</p>
                <p>Buyout: {auction.buyoutPrice || "0"}</p>
                <details className="mt-2">
                  <summary className="cursor-pointer text-xs text-neutral-500">Raw Data</summary>
                  <pre className="text-xs text-neutral-600 mt-1 overflow-auto">
                    {JSON.stringify(auction, null, 2)}
                  </pre>
                </details>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </main>
  );
}
