"use client";

// Removed unused useState import
import { X, Trash2, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/hooks/useCart";
import { useBatchedPurchase } from "@/hooks/useBatchedPurchase";
import Image from "next/image";

interface CartModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CartModal({ isOpen, onClose }: CartModalProps) {
  const { 
    items, 
    itemCount, 
    totalPrice, 
    removeFromCart, 
    clearCart 
  } = useCart();
  
  const { purchaseAll, isProcessing, isPending, isConfirming } = useBatchedPurchase();

  const handlePurchaseAll = async () => {
    if (items.length === 0) return;

    try {
      await purchaseAll(items);
    } catch (error) {
      console.error('Failed to purchase NFTs:', error);
      alert('Purchase failed. Please try again.');
    }
  };

  const handleRemoveItem = (tokenId: string) => {
    removeFromCart(tokenId);
  };

  const handleClearCart = () => {
    clearCart();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-neutral-900 border border-neutral-700 rounded-lg max-w-2xl w-full mx-4 max-h-[80vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-neutral-700">
          <div className="flex items-center gap-3">
            <ShoppingBag className="w-6 h-6 text-[#ff0099]" />
            <h2 className="text-xl font-semibold text-white">
              Cart ({itemCount} items)
            </h2>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="text-neutral-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto p-6">
          {items.length === 0 ? (
            <div className="text-center py-12">
              <ShoppingBag className="w-16 h-16 text-neutral-600 mx-auto mb-4" />
              <p className="text-neutral-400 text-lg">Your cart is empty</p>
              <p className="text-neutral-500 text-sm mt-2">
                Add some NFTs to get started
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {items.map((item) => (
                <div
                  key={item.tokenId}
                  className="flex items-center gap-4 p-4 bg-neutral-800 rounded-lg"
                >
                  <Image
                    src={item.image}
                    alt={item.name}
                    width={60}
                    height={60}
                    className="rounded object-cover"
                  />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-white truncate">
                      {item.name}
                    </h3>
                    <p className="text-sm text-neutral-400">
                      Rank: {item.rank} • {item.rarityPercent}%
                    </p>
                    <p className="text-sm text-[#ff0099] font-medium">
                      {item.price} ETH
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleRemoveItem(item.tokenId)}
                    className="text-neutral-400 hover:text-red-400"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t border-neutral-700 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="text-lg font-semibold text-white">
                Total: {totalPrice.toFixed(6)} ETH
              </div>
              <Button
                variant="ghost"
                onClick={handleClearCart}
                className="text-neutral-400 hover:text-red-400"
              >
                Clear Cart
              </Button>
            </div>
            
            <div className="space-y-3">
              <Button
                onClick={handlePurchaseAll}
                disabled={isProcessing}
                className="w-full bg-[#ff0099] hover:bg-[#e6008a] text-white py-3 text-lg font-medium disabled:opacity-50"
              >
                {isProcessing ? (
                  <div className="flex items-center gap-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    {isPending ? 'Sending Transaction...' : 
                     isConfirming ? 'Confirming...' : 
                     'Processing...'}
                  </div>
                ) : (
                  `Purchase All (${itemCount} NFTs) - Single Gas Fee`
                )}
              </Button>
              
              <p className="text-xs text-neutral-500 text-center">
                All NFTs will be purchased in a single transaction, saving you gas fees!
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
