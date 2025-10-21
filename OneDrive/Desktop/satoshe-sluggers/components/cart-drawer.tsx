// components/cart-drawer.tsx
"use client";

import { useState } from "react";
import { X, ShoppingCart, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/hooks/useCart";
import { useBatchedPurchase } from "@/hooks/useBatchedPurchase";
import { useRouter } from "next/navigation";
import Image from "next/image";

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
  const { items, removeFromCart, clearCart } = useCart();
  const { purchaseAll, isProcessing, isSuccess, gasEstimate, error } = useBatchedPurchase();
  const router = useRouter();
  const [isConfirming, setIsConfirming] = useState(false);

  // Calculate total price
  const totalPrice = items.reduce((sum, item) => sum + parseFloat(item.price), 0);
  const totalPriceEth = totalPrice.toFixed(4);

  const handlePurchaseAll = async () => {
    if (items.length === 0) return;

    setIsConfirming(true);
    try {
      await purchaseAll(items);
      
      // Clear cart after successful purchase
      clearCart();
      
      // Redirect to profile page as recommended by Thirdweb
      router.push("/my-nfts?purchased=true");
      
    } catch (error) {
      console.error("Purchase failed:", error);
      // Error is handled by the hook
    } finally {
      setIsConfirming(false);
    }
  };

  // Handle successful purchase
  if (isSuccess) {
    clearCart();
    router.push("/my-nfts?purchased=true");
  }

  const handleRemoveItem = (itemId: string) => {
    removeFromCart(itemId);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Drawer */}
      <div className="absolute right-0 top-0 h-full w-full max-w-md bg-neutral-900 border-l border-neutral-700 shadow-xl">
        <div className="flex h-full flex-col">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-neutral-700 p-6">
            <div className="flex items-center gap-3">
              <ShoppingCart className="h-6 w-6 text-[#ff0099]" />
              <h2 className="text-xl font-bold text-[#FFFBEB]">Cart</h2>
              <span className="rounded-full bg-[#ff0099] px-2 py-1 text-xs font-bold text-white">
                {items.length}
              </span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="text-neutral-400 hover:text-white"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* Cart Items */}
          <div className="flex-1 overflow-y-auto p-6">
            {items.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center">
                <ShoppingCart className="h-16 w-16 text-neutral-600 mb-4" />
                <h3 className="text-lg font-semibold text-neutral-400 mb-2">
                  Your cart is empty
                </h3>
                <p className="text-sm text-neutral-500 mb-6">
                  Add some NFTs to get started
                </p>
                <Button onClick={onClose} className="bg-[#ff0099] hover:bg-[#ff0099]/90">
                  Continue Shopping
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center gap-4 rounded-lg border border-neutral-700 bg-neutral-800 p-4"
                  >
                    {/* NFT Image */}
                    <div className="relative h-16 w-16 flex-shrink-0">
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className="rounded object-cover"
                      />
                    </div>

                    {/* NFT Details */}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-[#FFFBEB] truncate">
                        {item.name}
                      </h3>
                      <p className="text-sm text-neutral-400">
                        Rank #{item.rank} • {item.rarity}
                      </p>
                      <p className="text-sm font-semibold text-blue-400">
                        {item.price} ETH
                      </p>
                    </div>

                    {/* Remove Button */}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveItem(item.id)}
                      className="text-neutral-400 hover:text-red-400"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          {items.length > 0 && (
            <div className="border-t border-neutral-700 p-6">
              {/* Total */}
              <div className="mb-4 flex items-center justify-between">
                <span className="text-lg font-semibold text-[#FFFBEB]">
                  Total ({items.length} items)
                </span>
                <span className="text-xl font-bold text-blue-400">
                  {totalPriceEth} ETH
                </span>
              </div>

              {/* Gas Estimation */}
              {gasEstimate && (
                <div className="mb-4 flex items-center justify-between text-sm">
                  <span className="text-neutral-400">Estimated Gas Fee:</span>
                  <span className="text-yellow-400">{gasEstimate} ETH</span>
                </div>
              )}

              {/* Error Display */}
              {error && (
                <div className="mb-4 rounded-lg bg-red-900/20 border border-red-700 p-3">
                  <p className="text-sm text-red-400">{error}</p>
                </div>
              )}

              {/* Purchase Button */}
              <Button
                onClick={handlePurchaseAll}
                disabled={isProcessing || isConfirming}
                className="w-full bg-[#ff0099] hover:bg-[#ff0099]/90 text-white font-bold py-3"
              >
                {isProcessing || isConfirming ? (
                  <div className="flex items-center gap-2">
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    {isConfirming ? "Confirming..." : "Processing..."}
                  </div>
                ) : (
                  `Buy All (${items.length} NFTs)`
                )}
              </Button>

              {/* Continue Shopping */}
              <Button
                variant="outline"
                onClick={onClose}
                className="w-full mt-3 border-neutral-600 text-neutral-300 hover:bg-neutral-800"
              >
                Continue Shopping
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
