// components/cart-icon.tsx
"use client";

import { ShoppingCart } from "lucide-react";
import { useCart } from "@/hooks/useCart";
import { Button } from "@/components/ui/button";

interface CartIconProps {
  onClick: () => void;
}

export default function CartIcon({ onClick }: CartIconProps) {
  const { itemCount } = useCart();

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={onClick}
      className="relative p-2 hover:bg-neutral-800 rounded-sm transition-colors"
    >
      <ShoppingCart className="w-5 h-5 text-neutral-400 hover:text-white" />
      {itemCount > 0 && (
        <span className="absolute -top-1 -right-1 bg-[#ff0099] text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium">
          {itemCount > 99 ? '99+' : itemCount}
        </span>
      )}
    </Button>
  );
}
