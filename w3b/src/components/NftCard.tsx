import { useState } from "react";
import { useActiveAccount, useSendTransaction } from "thirdweb/react";
import { getContract } from "thirdweb";
import { bidInAuction, buyoutAuction } from "thirdweb/extensions/marketplace";
import { client, base } from "@/utils/thirdweb";

interface NFT {
  tokenId: string;
  listingId?: number | null;
  metadata?: {
    image?: string;
    name?: string;
    description?: string;
  };
  auction?: {
    listingId: number;
    endTime: number;
    bidCount: number;
    status: string;
    timeRemaining: number;
    timeRemainingFormatted: string;
    minBid: string;
    buyoutPrice: string;
    rank: number | null;
    rarity: string | null;
    tier: string | null;
  } | null;
}

export function NFTCard({ nft }: { nft: NFT }) {
  const [bidAmount, setBidAmount] = useState("");
  const account = useActiveAccount();
  const { mutateAsync: sendTransaction, isPending } = useSendTransaction();
  
  // Get listingId from auction data
  const listingId = nft.auction?.listingId || nft.listingId;

  // Get live auction prices from API data
  const minBid = nft?.auction?.minBid || "0";
  const buyoutPrice = nft?.auction?.buyoutPrice || "—";

  const handleBid = async () => {
    if (!account) return;
    if (!bidAmount || Number(bidAmount) <= 0) return;
    if (!listingId) return;
    
    try {
      const contract = getContract({
        client,
        address: process.env.NEXT_PUBLIC_MARKETPLACE_ADDRESS!,
        chain: base
      });
      
      const bidAmountWei = BigInt(Math.floor(Number(bidAmount) * 1e18));
      
      const transaction = bidInAuction({
        contract,
        auctionId: BigInt(listingId!),
        bidAmountWei: bidAmountWei
      });
      
      await sendTransaction(transaction);
      setBidAmount("");
    } catch (error) {
      console.error("Bid failed:", error);
    }
  };

  const handleBuyout = async () => {
    if (!account) return;
    if (!listingId) return;
    
    try {
      const contract = getContract({
        client,
        address: process.env.NEXT_PUBLIC_MARKETPLACE_ADDRESS!,
        chain: base
      });
      
      const transaction = buyoutAuction({
        contract,
        auctionId: BigInt(listingId!)
      });
      
      await sendTransaction(transaction);
    } catch (error) {
      console.error("Buyout failed:", error);
    }
  };

  return (
    <div className="bg-white border rounded-lg overflow-hidden flex flex-col shadow">
      <div className="aspect-square w-full overflow-hidden">
        <img
          src={nft.metadata?.image}
          alt={nft.metadata?.name || `NFT #${nft.tokenId}`}
          className="w-full h-full object-cover"
        />
      </div>
      <div className="p-4 flex-1">
        <h2 className="font-semibold text-gray-900">
          {nft.metadata?.name || `NFT #${nft.tokenId}`}
        </h2>
        {/* Show auction details */}
        {nft.auction && (
          <div className="mt-2 text-sm text-gray-700">
            <div>
              Min Bid: <b className="text-gray-900">{minBid} ETH</b>
            </div>
            <div>
              Buyout: <b className="text-gray-900">{buyoutPrice} ETH</b>
            </div>
            <div>
              Bids: <b className="text-gray-900">{nft.auction.bidCount}</b>
            </div>
            <div>
              Ends: <b className="text-gray-900">{nft.auction.timeRemainingFormatted}</b>
            </div>
            {nft.auction.rank && (
              <div>
                Rank: <b className="text-gray-900">{nft.auction.rank} of 7777</b>
              </div>
            )}
            {nft.auction.tier && (
              <div>
                Tier: <b className="text-gray-900">{nft.auction.tier}</b>
              </div>
            )}
          </div>
        )}
      </div>
      <div className="p-4 bg-gray-50 flex flex-col gap-2">
        <input
          type="number"
          step="0.000001"
          placeholder={`Min: ${minBid}`}
          value={bidAmount}
          min={minBid}
          className="input input-bordered w-full text-gray-900"
          onChange={(e) => setBidAmount(e.target.value)}
        />
        <button
          className="btn btn-primary text-white"
          disabled={!bidAmount || isPending || !account}
          onClick={handleBid}
        >
          {isPending ? "Placing..." : "Place Bid"}
        </button>
        <button
          className="btn btn-secondary text-gray-900"
          disabled={isPending || !account}
          onClick={handleBuyout}
        >
          {isPending ? "Buying..." : "Buyout"}
        </button>
      </div>
    </div>
  );
}