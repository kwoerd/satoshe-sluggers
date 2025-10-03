// src/components/NftDetails.tsx

"use client";

import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import { BidBuyoutSection } from "./BidBuyoutSection";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export default function NftDetails({ tokenId }: { tokenId: string }) {
  // Fetch metadata
  const { data: metadata } = useQuery({
    queryKey: ["metadata", tokenId],
    queryFn: async () => {
      const res = await fetch(
        `/api/metadata?contract=${process.env.NEXT_PUBLIC_NFT_COLLECTION_ADDRESS}&tokenId=${tokenId}`
      );
      return res.json();
    },
  });

  // Fetch auction details
  const { data: auction } = useQuery({
    queryKey: ["auction", tokenId],
    queryFn: async () => {
      const res = await fetch(`/api/auctions?tokenId=${tokenId}`);
      return res.json();
    },
  });

  // Fetch bid history
  const { data: bids } = useQuery({
    queryKey: ["bids", tokenId],
    queryFn: async () => {
      const res = await fetch(`/api/bid-history?tokenId=${tokenId}`);
      return res.json();
    },
    refetchInterval: 20000, // every 20s
  });

  return (
    <Card className="max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">
          {metadata?.name ?? `NFT #${tokenId}`}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
            {/* Image */}
            {metadata?.image && (
              <Image
                src={metadata.image}
                alt={metadata.name || `NFT #${tokenId}`}
                width={800}
                height={800}
                className="w-full rounded-lg border object-cover"
                priority={true}
              />
            )}

        {/* Metadata description + traits */}
        {metadata?.description && (
          <p className="text-neutral-400">{metadata.description}</p>
        )}
        {metadata?.attributes && (
          <ul className="grid grid-cols-2 gap-2">
            {metadata.attributes.map((attr: any, i: number) => ( // eslint-disable-line @typescript-eslint/no-explicit-any
              <li
                key={i}
                className="p-2 rounded bg-neutral-800 text-sm"
              >
                <strong>{attr.trait_type}: </strong>
                {attr.value}
              </li>
            ))}
          </ul>
        )}

        {/* Auction details */}
        <div className="space-y-2">
          <p>Current Bids: {auction?.bidCount ?? 0}</p>
          <p>Buyout Price: {auction?.buyoutPrice ?? "—"}</p>
          <p>Ends: {auction?.endTime ? new Date(auction.endTime * 1000).toLocaleString() : "—"}</p>
        </div>

        {/* Bid/Buyout actions */}
        <BidBuyoutSection
          auctionId={BigInt(tokenId)}
          minBid={auction?.minNextBid}
          buyoutPrice={auction?.buyoutPrice}
        />

        {/* Bid history */}
        <div>
          <h3 className="font-semibold mb-2">Bid History</h3>
          {bids?.events?.length ? (
            <ul className="space-y-1">
              {bids.events.map((b: any, i: number) => ( // eslint-disable-line @typescript-eslint/no-explicit-any
                <li
                  key={i}
                  className="text-sm text-neutral-400"
                >
                  {b.account} bid {b.amount} at{" "}
                  {new Date(b.timestamp * 1000).toLocaleString()}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-neutral-500">No bids yet.</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
