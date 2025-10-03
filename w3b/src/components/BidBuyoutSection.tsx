// src/components/BidBuyoutSection.tsx

"use client";

import { useState } from "react";
import { useActiveAccount, useSendTransaction } from "thirdweb/react";
import { getContract } from "thirdweb";
import { bidInAuction, buyoutAuction } from "thirdweb/extensions/marketplace";
import { client, base } from "@/utils/thirdweb";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export function BidBuyoutSection({
  listingId,
  minBid,
  buyoutPrice,
}: {
  listingId: bigint;
  minBid: string;
  buyoutPrice: string;
}) {
  const account = useActiveAccount();
  const queryClient = useQueryClient();
  const [bidAmount, setBidAmount] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Get marketplace contract - only when needed for transactions
  const getContractForTransaction = () => getContract({
    client,
    address: process.env.NEXT_PUBLIC_MARKETPLACE_ADDRESS!,
    chain: base
  });

  const { mutateAsync: sendTransaction, isPending } = useSendTransaction();

  const handleBid = async () => {
    if (!account) {
      toast.error("Please connect your wallet");
      return;
    }

    if (!bidAmount || Number(bidAmount) <= 0) {
      toast.error("Please enter a valid bid amount");
      return;
    }

    setIsLoading(true);
    
    try {
      const contract = getContractForTransaction();
      const bidAmountWei = BigInt(Math.floor(Number(bidAmount) * 1e18));
      
      toast.loading("Placing bid...", { id: "bid" });
      
      const transaction = bidInAuction({
        contract,
        auctionId: listingId,
        bidAmountWei: bidAmountWei
      });
      
      await sendTransaction(transaction);
      
      // Refresh data after successful transaction
      queryClient.invalidateQueries({ queryKey: ["auctions"] });
      queryClient.invalidateQueries({ queryKey: ["bids"] });
      setBidAmount("");
      
      toast.success("Bid placed successfully!", { id: "bid" });
    } catch (error) {
      console.error("Bid failed:", error);
      const errorMessage = error instanceof Error ? error.message : "Failed to place bid";
      toast.error(errorMessage, { id: "bid" });
    } finally {
      setIsLoading(false);
    }
  };

  const handleBuyout = async () => {
    if (!account) {
      toast.error("Please connect your wallet");
      return;
    }

    setIsLoading(true);
    
    try {
      const contract = getContractForTransaction();
      
      toast.loading("Processing buyout...", { id: "buyout" });
      
      const transaction = buyoutAuction({
        contract,
        auctionId: listingId
      });
      
      await sendTransaction(transaction);
      
      // Refresh data after successful transaction
      queryClient.invalidateQueries({ queryKey: ["auctions"] });
      queryClient.invalidateQueries({ queryKey: ["bids"] });
      
      toast.success("Buyout successful!", { id: "buyout" });
    } catch (error) {
      console.error("Buyout failed:", error);
      const errorMessage = error instanceof Error ? error.message : "Failed to complete buyout";
      toast.error(errorMessage, { id: "buyout" });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-2">
      <Input
        type="number"
        step="0.001"
        min="0"
        value={bidAmount}
        onChange={(e) => {
          const value = e.target.value;
          if (value === "" || /^\d*\.?\d{0,3}$/.test(value)) {
            setBidAmount(value);
          }
        }}
        placeholder={`Min bid: ${minBid} ETH`}
        disabled={!account || isLoading || isPending}
        className="w-full"
      />
      <div className="flex gap-2">
        <Button 
          disabled={!account || isLoading || isPending || !bidAmount} 
          onClick={handleBid}
          className="flex-1"
        >
          {isLoading || isPending ? "Placing Bid..." : "Place Bid"}
        </Button>
        <Button
          variant="secondary"
          disabled={!account || isLoading || isPending}
          onClick={handleBuyout}
          className="flex-1"
        >
          {isLoading || isPending ? "Processing..." : `Buyout ${buyoutPrice} ETH`}
        </Button>
      </div>
    </div>
  );
}