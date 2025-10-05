"use client";

import { useLiveAuctions } from "@/hooks/useLiveAuctions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function Home() {
  const { data, isLoading, isError } = useLiveAuctions();

  if (isLoading)
    return (
      <div className="flex justify-center items-center h-screen text-neutral-400">
        Loading live auctions...
      </div>
    );

  if (isError)
    return (
      <div className="flex justify-center items-center h-screen text-red-400">
        Failed to load auctions.
      </div>
    );

  const items = data?.items || [];

  if (items.length === 0)
    return (
      <div className="flex justify-center items-center h-screen text-neutral-500">
        No active auctions yet.
      </div>
    );

  return (
    <main className="p-6 bg-neutral-900 text-neutral-100 min-h-screen">
      <h1 className="text-2xl font-bold mb-6">DAO Sports Marketplace</h1>
      <p className="text-sm text-neutral-400 mb-4">
        🟢 Live Auctions ({data?.total || 0})
      </p>

      <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
        {items.map((auction: { listingId: string; tokenId: string; bidCount: number; endSec: number }) => (
          <Card key={auction.listingId} className="bg-neutral-800 border-neutral-700">
            <CardHeader>
              <CardTitle>Listing #{auction.listingId}</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-neutral-300">
              <p>Token ID: {auction.tokenId}</p>
              <p>Bids: {auction.bidCount}</p>
              <p>Ends: {auction.endSec}s</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </main>
  );
}
