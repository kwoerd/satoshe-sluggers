// hooks/useBatchedPurchase.ts
// hooks/useBatchedPurchase.ts
"use client";

import { useState } from "react";
import { useSendCalls, useWaitForCallsReceipt } from "thirdweb/react";
import { marketplace } from "@/lib/contracts";
import { buyFromListing } from "thirdweb/extensions/marketplace";
import { useActiveAccount } from "thirdweb/react";
import { CartItem } from "./useCart";

export function useBatchedPurchase() {
  const [isProcessing, setIsProcessing] = useState(false);
  const account = useActiveAccount();
  const { mutate: sendCalls, isPending, data } = useSendCalls();
  const { data: receipt, isLoading: isConfirming } = useWaitForCallsReceipt(data);

  const purchaseAll = async (items: CartItem[]) => {
    if (!account) {
      throw new Error("No wallet connected");
    }

    if (items.length === 0) {
      throw new Error("No items to purchase");
    }

    setIsProcessing(true);

    try {
      // Create batched calls for all NFT purchases
      const calls = items.map((item) => {
        return buyFromListing({
          contract: marketplace,
          listingId: BigInt(item.tokenId),
          quantity: 1n,
          recipient: account.address,
        });
      });

      // Send all calls in a single transaction
      sendCalls({
        calls,
      });

    } catch (error) {
      
      setIsProcessing(false);
      throw error;
    }
  };

  return {
    purchaseAll,
    isProcessing: isProcessing || isPending || isConfirming,
    isPending,
    isConfirming,
    receipt,
    error: null, // Could add error state if needed
  };
}
