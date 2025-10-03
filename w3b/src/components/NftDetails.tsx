// src/components/NftDetails.tsx

"use client";

import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import { BidBuyoutSection } from "./BidBuyoutSection";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export default function NftDetails({ tokenId }: { tokenId: string }) {
  // Fetch NFT data with metadata and auction details
  const { data: nftData } = useQuery({
    queryKey: ["nft", tokenId],
    queryFn: async () => {
      const res = await fetch(`/api/auctions?tokenId=${tokenId}`);
      const data = await res.json();
      return data.events?.[0]; // Get the first (and only) NFT from the response
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
          {nftData?.metadata?.name ?? `NFT #${tokenId}`}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
            {/* Image */}
            {nftData?.metadata?.image && (
              <Image
                src={nftData.metadata.image}
                alt={nftData.metadata.name || `NFT #${tokenId}`}
                width={800}
                height={800}
                className="w-full rounded-lg border object-cover"
                priority={true}
              />
            )}

        {/* Metadata description + traits */}
        {nftData?.metadata?.description && (
          <p className="text-neutral-400">{nftData.metadata.description}</p>
        )}
        {nftData?.metadata?.attributes && (
          <ul className="grid grid-cols-2 gap-2">
            {nftData.metadata.attributes.map((attr: any, i: number) => ( // eslint-disable-line @typescript-eslint/no-explicit-any
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

        {/* Auction details - Only show real data */}
        {nftData?.auction && (
          <div className="space-y-4">
            <h3 className="text-xl font-semibold">Auction Details</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-4 rounded-lg bg-neutral-800">
                <div className="text-sm text-neutral-400">Ends</div>
                <div className="font-semibold">{nftData.auction.timeRemainingFormatted}</div>
              </div>
              <div className="p-4 rounded-lg bg-neutral-800">
                <div className="text-sm text-neutral-400">Rank</div>
                <div className="font-semibold">{nftData.auction.rank} of 7777</div>
              </div>
              <div className="p-4 rounded-lg bg-neutral-800">
                <div className="text-sm text-neutral-400">Bids</div>
                <div className="font-semibold">{nftData.auction.bidCount}</div>
              </div>
              <div className="p-4 rounded-lg bg-neutral-800">
                <div className="text-sm text-neutral-400">Status</div>
                <div className="font-semibold capitalize">{nftData.auction.status}</div>
              </div>
              <div className="p-4 rounded-lg bg-neutral-800">
                <div className="text-sm text-neutral-400">Min Bid</div>
                <div className="font-semibold">{nftData.auction.minBid} ETH</div>
              </div>
              <div className="p-4 rounded-lg bg-neutral-800">
                <div className="text-sm text-neutral-400">Buyout Price</div>
                <div className="font-semibold">{nftData.auction.buyoutPrice} ETH</div>
              </div>
            </div>
          </div>
        )}

            {/* Bid/Buyout actions */}
            {nftData?.auction?.listingId && (
              <BidBuyoutSection
                listingId={BigInt(nftData.auction.listingId)}
                minBid={nftData.auction.minBid}
                buyoutPrice={nftData.auction.buyoutPrice}
              />
            )}

        {/* Bid history */}
        <div>
          <h3 className="text-xl font-semibold mb-4">Bid History</h3>
          {bids?.events?.length ? (
            <div className="space-y-2">
              {bids.events.map((b: any, i: number) => ( // eslint-disable-line @typescript-eslint/no-explicit-any
                <div
                  key={i}
                  className="p-3 rounded-lg bg-neutral-800 flex justify-between items-center"
                >
                  <div>
                    <div className="font-medium">{b.account}</div>
                    <div className="text-sm text-neutral-400">
                      {new Date(b.timestamp * 1000).toLocaleString()}
                    </div>
                  </div>
                  <div className="font-semibold">{b.amount} ETH</div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-4 rounded-lg bg-neutral-800 text-center">
              <p className="text-neutral-400">No bids yet. Be the first to bid!</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
