// hooks/usePurchase.ts
// hooks/usePurchase.ts
"use client";

import { useState } from "react";
import { useSendTransaction } from "thirdweb/react";
import { marketplace } from "@/lib/contracts";
import { buyFromListing } from "thirdweb/extensions/marketplace";
import { useActiveAccount } from "thirdweb/react";
import { triggerPurchaseConfetti } from "@/lib/confetti";

interface PurchaseParams {
  listingId: string;
  price: string; // Price in ETH
  tokenId: string;
  name: string;
}

export function usePurchase() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const account = useActiveAccount();

  const { mutate: sendTransaction, isPending } = useSendTransaction();

  const purchase = async ({ listingId, price }: PurchaseParams) => {
    if (!account) {
      throw new Error("No wallet connected");
    }

    setIsProcessing(true);
    setError(null);

    try {
      // Note: Price conversion handled by the contract

      // Create the buyFromListing transaction
      const transaction = buyFromListing({
        contract: marketplace,
        listingId: BigInt(listingId),
        quantity: 1n,
        recipient: account.address,
      });

      // Send the transaction
      sendTransaction(transaction, {
        onSuccess: () => {
          // Transaction successful
          handleSuccess();
        },
        onError: (error) => {
          
          setError(error.message || "Transaction failed");
          setIsProcessing(false);
        },
      });

    } catch (error) {
      
      setError(error instanceof Error ? error.message : "Purchase failed");
      setIsProcessing(false);
    }
  };

  // Handle transaction success
  const handleSuccess = () => {
    // Trigger confetti celebration
    triggerPurchaseConfetti();
    
    // Reset processing state
    setIsProcessing(false);
    setError(null);
    
    
  };

  return {
    purchase,
    isProcessing: isProcessing || isPending,
    isPending,
    error,
  };
}
