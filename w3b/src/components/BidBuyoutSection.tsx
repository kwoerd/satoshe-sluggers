// src/components/BidBuyoutSection.tsx

"use client";

import { useState } from "react";
import { useActiveAccount } from "thirdweb/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export function BidBuyoutSection({
  auctionId,
  minBid,
  buyoutPrice,
}: {
  auctionId: bigint;
  minBid?: string;
  buyoutPrice?: string;
}) {
  const account = useActiveAccount();
  const queryClient = useQueryClient();
  const [bidAmount, setBidAmount] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleBid = async () => {
    if (!account) {
      toast.error("Please connect your wallet");
      return;
    }

    if (!bidAmount || Number(bidAmount) <= 0) {
      toast.error("Please enter a valid bid amount");
      return;
    }

    if (minBid && Number(bidAmount) < Number(minBid)) {
      toast.error(`Bid must be at least ${minBid} ETH`);
      return;
    }

    setIsLoading(true);
    
    try {
      // Convert ETH to wei for the transaction
      const bidAmountWei = BigInt(Math.floor(Number(bidAmount) * 1e18));
      
      // Create the transaction data for placing a bid
      const transactionData = {
        to: process.env.NEXT_PUBLIC_MARKETPLACE_ADDRESS!,
        data: `0x${auctionId.toString(16).padStart(64, '0')}${bidAmountWei.toString(16).padStart(64, '0')}`,
        value: bidAmountWei.toString(),
      };

      // For now, we'll use a placeholder transaction
      // In production, this would use the actual thirdweb v5 marketplace contract
      toast.loading("Placing bid...", { id: "bid" });
      
      // Simulate transaction (replace with real thirdweb v5 implementation)
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // 🔄 Immediately refresh auction data after success
      queryClient.invalidateQueries({ queryKey: ["auctions"] });
      queryClient.invalidateQueries({ queryKey: ["bids"] });
      setBidAmount(""); // reset input
      
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

    if (!buyoutPrice) {
      toast.error("No buyout price available");
      return;
    }

    setIsLoading(true);
    
    try {
      // Convert ETH to wei for the transaction
      const buyoutPriceWei = BigInt(Math.floor(Number(buyoutPrice) * 1e18));
      
      // Create the transaction data for buyout
      const transactionData = {
        to: process.env.NEXT_PUBLIC_MARKETPLACE_ADDRESS!,
        data: `0x${auctionId.toString(16).padStart(64, '0')}`,
        value: buyoutPriceWei.toString(),
      };

      // For now, we'll use a placeholder transaction
      // In production, this would use the actual thirdweb v5 marketplace contract
      toast.loading("Processing buyout...", { id: "buyout" });
      
      // Simulate transaction (replace with real thirdweb v5 implementation)
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // 🔄 Immediately refresh auction data after success
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
          // Only allow positive numbers with up to 3 decimal places
          if (value === "" || /^\d*\.?\d{0,3}$/.test(value)) {
            setBidAmount(value);
          }
        }}
        placeholder={`Min bid: ${minBid ?? "—"} ETH`}
        disabled={!account || isLoading}
        className="w-full"
      />
      <div className="flex gap-2">
        <Button 
          disabled={!account || isLoading || !bidAmount} 
          onClick={handleBid}
          className="flex-1"
        >
          {isLoading ? "Placing Bid..." : `Place Bid${minBid ? ` (Min: ${minBid} ETH)` : ""}`}
        </Button>
        <Button
          variant="secondary"
          disabled={!account || isLoading || !buyoutPrice}
          onClick={handleBuyout}
          className="flex-1"
        >
          {isLoading ? "Processing..." : (buyoutPrice ? `Buyout ${buyoutPrice} ETH` : "No Buyout")}
        </Button>
      </div>
    </div>
  );
}
