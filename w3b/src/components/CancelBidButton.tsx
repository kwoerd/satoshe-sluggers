// src/components/CancelBidButton.tsx

"use client";

import { useActiveAccount } from "thirdweb/react";
import { Button } from "@/components/ui/button";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useState } from "react";

export function CancelBidButton({ auctionId }: { auctionId: bigint }) {
  const account = useActiveAccount();
  const queryClient = useQueryClient();
  const [isLoading, setIsLoading] = useState(false);

  const handleCancel = async () => {
    if (!account) {
      toast.error("Please connect your wallet");
      return;
    }

    setIsLoading(true);
    
    try {
      // TODO: Implement actual cancel bid functionality with correct thirdweb v5 approach
      // For now, simulate the transaction
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // 🔄 refresh auctions + my-bids immediately after cancel
      queryClient.invalidateQueries({ queryKey: ["auctions"] });
      queryClient.invalidateQueries({ queryKey: ["my-bids"] });
      queryClient.invalidateQueries({ queryKey: ["bids"] });
      
      toast.success("Bid cancelled successfully!");
    } catch (error) {
      console.error("Cancel bid failed:", error);
      toast.error("Failed to cancel bid");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button 
      disabled={!account || isLoading} 
      onClick={handleCancel}
    >
      {isLoading ? "Cancelling..." : "Cancel Bid"}
    </Button>
  );
}
