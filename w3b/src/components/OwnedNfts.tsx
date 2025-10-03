// src/components/OwnedNfts.tsx

"use client";

import { useEffect, useState } from "react";
import { NFTCard } from "./NftCard";

export default function OwnedNfts({ wallet }: { wallet: string }) {
  const [owned, setOwned] = useState<unknown[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setLoading(true);
      const res = await fetch(
        `/api/owned?wallet=${wallet}&limit=50`
      );
      const data = await res.json();
      setOwned(data.items ?? []);
      setLoading(false);
    }
    load();
  }, [wallet]);

  if (loading) return <p>Loading your NFTs…</p>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {owned.map((o: any) => ( // eslint-disable-line @typescript-eslint/no-explicit-any
        <NFTCard key={o.tokenId} nft={o} />
      ))}
    </div>
  );
}
