// hooks/useBatchedPurchase.ts
"use client";

import { useState } from "react";
import { useSendBatchTransaction } from "thirdweb/react";
import { marketplace } from "@/lib/contracts";
import { buyFromListing } from "thirdweb/extensions/marketplace";
import { useActiveAccount } from "thirdweb/react";
import { CartItem } from "./useCart";
import { triggerPurchaseConfetti } from "@/lib/confetti";

export function useBatchedPurchase() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [purchasedItems, setPurchasedItems] = useState<CartItem[]>([]);
  const [gasEstimate, setGasEstimate] = useState<string | null>(null);
  const account = useActiveAccount();
  
  const { mutate: sendBatchTransaction, isPending, isSuccess, isError, error: batchError } = useSendBatchTransaction();

  const purchaseAll = async (items: CartItem[]) => {
    if (!account) {
      throw new Error("No wallet connected");
    }

    if (items.length === 0) {
      throw new Error("No items to purchase");
    }

    // Cap batch size at 5 NFTs as recommended by Thirdweb
    if (items.length > 5) {
      throw new Error("Maximum 5 NFTs per batch purchase");
    }

    setIsProcessing(true);
    setError(null);
    setPurchasedItems([]);

    try {
      // Create batched transactions for all NFT purchases
      const transactions = items.map((item) => {
        return buyFromListing({
          contract: marketplace,
          listingId: BigInt(item.tokenId),
          quantity: 1n,
          recipient: account.address,
        });
      });

      // Note: Gas estimation for batch transactions is complex
      // For now, we'll skip detailed gas estimation and show a note
      setGasEstimate("Estimated (varies by network)");

      // Send all transactions in a single atomic batch
      sendBatchTransaction(transactions, {
        onSuccess: () => {
          handleBatchSuccess();
        },
        onError: (error) => {
          handleBatchError(error);
        },
      });

    } catch (error) {
      console.error("Batch purchase error:", error);
      setError(error instanceof Error ? error.message : "Batch purchase failed");
      setIsProcessing(false);
      throw error;
    }
  };

  // Handle successful batch purchase
  const handleBatchSuccess = () => {
    triggerPurchaseConfetti();
    setIsProcessing(false);
    setError(null);
    setPurchasedItems([]); // Clear purchased items
  };

  // Handle batch purchase error
  const handleBatchError = (error: Error) => {
    console.error("Batch purchase failed:", error);
    setError(error.message || "Batch purchase failed");
    setIsProcessing(false);
  };

  return {
    purchaseAll,
    isProcessing: isProcessing || isPending,
    isPending,
    isSuccess,
    isError,
    gasEstimate,
    error: error || (batchError ? batchError.message : null),
    purchasedItems,
    setPurchasedItems,
  };
}
