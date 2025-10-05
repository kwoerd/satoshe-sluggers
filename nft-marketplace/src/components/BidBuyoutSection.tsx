// components/BidBuyoutSection.tsx
"use client";
import { useState } from "react";
import { useActiveAccount, useSendTransaction } from "thirdweb/react";
import { getContract } from "thirdweb";
import { createThirdwebClient } from "thirdweb";
import { base } from "thirdweb/chains";
import { bidInAuction, buyoutAuction } from "thirdweb/extensions/marketplace";

export function BidBuyoutSection({
  contractAddress,
  auctionId,
  minBid,
  buyoutPrice,
}: {
  contractAddress: string;
  auctionId: bigint;
  minBid?: string;
  buyoutPrice?: string;
}) {
  const account = useActiveAccount();
  const client = createThirdwebClient({ clientId: process.env.NEXT_PUBLIC_CLIENT_ID! });
  const contract = getContract({ client, chain: base, address: contractAddress });
  const { mutate: sendTx, isPending } = useSendTransaction();
  const [bidAmount, setBidAmount] = useState("");

  const min = Number(minBid ?? 0);

  const handleBid = () => {
    if (!account) return alert("Connect your wallet first.");
    if (bidAmount === "" || Number(bidAmount) < min) {
      return alert(`Bid must be at least ${min}`);
    }
    const tx = bidInAuction({
      contract: contract!,
      auctionId,
      bidAmount: bidAmount, // assumes native units already
    });
    sendTx(tx);
  };

  const handleBuyout = () => {
    if (!account) return alert("Connect your wallet first.");
    const tx = buyoutAuction({ contract: contract!, auctionId });
    sendTx(tx);
  };

  return (
    <div className="space-y-2">
      <input
        type="number"
        value={bidAmount}
        min={min}
        onChange={(e) => setBidAmount(e.target.value)}
        placeholder={min ? `Min bid: ${min}` : "Enter bid"}
        className="w-full border rounded px-2 py-1"
      />
      <div className="flex gap-2">
        <button disabled={isPending} onClick={handleBid} className="btn">Place Bid</button>
        <button disabled={isPending} onClick={handleBuyout} className="btn">
          {buyoutPrice ? `Buyout for ${buyoutPrice}` : "Buyout"}
        </button>
      </div>
    </div>
  );
}
