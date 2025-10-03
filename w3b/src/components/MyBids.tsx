// src/components/MyBids.tsx

"use client";

import { useEffect, useState } from "react";
import { CancelBidButton } from "./CancelBidButton";
import { NFTCard } from "./NftCard";

export default function MyBids({ wallet }: { wallet: string }) {
  const [bids, setBids] = useState<unknown[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setLoading(true);
      const res = await fetch(`/api/my-bids?wallet=${wallet}`);
      const data = await res.json();
      setBids(data.events ?? []);
      setLoading(false);
    }
    load();
  }, [wallet]);

  if (loading) return <p>Loading your bids…</p>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {bids.map((b: any) => ( // eslint-disable-line @typescript-eslint/no-explicit-any
        <div key={b.listingId || b.auctionId}>
          <NFTCard nft={b} />
          {b.listingId && <CancelBidButton listingId={BigInt(b.listingId)} />}
        </div>
      ))}
    </div>
  );
}
