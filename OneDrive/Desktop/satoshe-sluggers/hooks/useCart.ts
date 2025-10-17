// hooks/useCart.ts
"use client";

import { useState, useEffect } from "react";

export interface CartItem {
  id: string;
  tokenId: string;
  name: string;
  image: string;
  price: string;
  priceWei: string;
  rarity: string;
  rank: string;
  rarityPercent: string;
}

interface CartState {
  items: CartItem[];
  isOpen: boolean;
}

export function useCart() {
  const [cart, setCart] = useState<CartState>({
    items: [],
    isOpen: false,
  });

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('nft-cart');
    if (savedCart) {
      try {
        const parsedCart = JSON.parse(savedCart);
        setCart(prev => ({ ...prev, items: parsedCart }));
      } catch (error) {
        console.error('Failed to load cart from localStorage:', error);
      }
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('nft-cart', JSON.stringify(cart.items));
  }, [cart.items]);

  const addToCart = (item: CartItem) => {
    setCart(prev => ({
      ...prev,
      items: [...prev.items, item]
    }));
  };

  const removeFromCart = (tokenId: string) => {
    setCart(prev => ({
      ...prev,
      items: prev.items.filter(item => item.tokenId !== tokenId)
    }));
  };

  const clearCart = () => {
    setCart(prev => ({
      ...prev,
      items: []
    }));
  };

  const toggleCart = () => {
    setCart(prev => ({
      ...prev,
      isOpen: !prev.isOpen
    }));
  };

  const closeCart = () => {
    setCart(prev => ({
      ...prev,
      isOpen: false
    }));
  };

  const isInCart = (tokenId: string) => {
    return cart.items.some(item => item.tokenId === tokenId);
  };

  const getTotalPrice = () => {
    return cart.items.reduce((total, item) => {
      const price = parseFloat(item.price) || 0;
      return total + price;
    }, 0);
  };

  const getTotalPriceWei = () => {
    return cart.items.reduce((total, item) => {
      const priceWei = BigInt(item.priceWei || "0");
      return total + priceWei;
    }, BigInt(0));
  };

  return {
    items: cart.items,
    isOpen: cart.isOpen,
    itemCount: cart.items.length,
    totalPrice: getTotalPrice(),
    totalPriceWei: getTotalPriceWei(),
    addToCart,
    removeFromCart,
    clearCart,
    toggleCart,
    closeCart,
    isInCart,
  };
}
