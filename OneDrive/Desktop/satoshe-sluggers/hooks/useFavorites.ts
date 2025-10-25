// hooks/useFavorites.ts
import { useState, useEffect, useRef } from 'react';
import { useActiveAccount } from 'thirdweb/react';

export interface FavoriteNFT {
  tokenId: string;
  name: string;
  image: string;
  rarity: string;
  rank: string | number;
  rarityPercent: string | number;
  addedAt: number;
}

export function useFavorites() {
  const account = useActiveAccount();
  const [favorites, setFavorites] = useState<FavoriteNFT[]>([]);
  const prevAddressRef = useRef<string | null>(null);

  // Get storage key for current wallet
  const getStorageKey = (address: string) => {
    return `nft_favorites_${address.toLowerCase()}`;
  };

  // Load favorites from localStorage when account changes
  useEffect(() => {
    const currentAddress = account?.address || null;
    
    // Only update if address actually changed
    if (currentAddress === prevAddressRef.current) {
      return;
    }
    
    prevAddressRef.current = currentAddress;
    
    if (!currentAddress) {
      setFavorites([]);
      return;
    }

    const storageKey = getStorageKey(currentAddress);
    try {
      const stored = localStorage.getItem(storageKey);
      if (stored) {
        const parsedFavorites = JSON.parse(stored);
        setFavorites(parsedFavorites);
      } else {
        setFavorites([]);
      }
    } catch {
      // Error loading favorites from localStorage - continue with empty array
      setFavorites([]);
    }
  }, [account?.address]);

  // Save favorites to localStorage
  const saveFavorites = (newFavorites: FavoriteNFT[]) => {
    if (!account?.address) return;

    const storageKey = getStorageKey(account.address);
    try {
      localStorage.setItem(storageKey, JSON.stringify(newFavorites));
      setFavorites(newFavorites);
    } catch {
      // Error saving favorites to localStorage - continue silently
    }
  };

  // Add NFT to favorites
  const addToFavorites = (nft: Omit<FavoriteNFT, 'addedAt'>) => {
    if (!account?.address) return false;

    const newFavorite: FavoriteNFT = {
      ...nft,
      addedAt: Date.now(),
    };

    const updatedFavorites = [...favorites, newFavorite];
    saveFavorites(updatedFavorites);
    return true;
  };

  // Remove NFT from favorites
  const removeFromFavorites = (tokenId: string) => {
    const updatedFavorites = favorites.filter(fav => fav.tokenId !== tokenId);
    saveFavorites(updatedFavorites);
  };

  // Check if NFT is favorited
  const isFavorited = (tokenId: string) => {
    return favorites.some(fav => fav.tokenId === tokenId);
  };

  // Toggle favorite status
  const toggleFavorite = (nft: Omit<FavoriteNFT, 'addedAt'>) => {
    if (!account?.address) return false;

    if (isFavorited(nft.tokenId)) {
      removeFromFavorites(nft.tokenId);
      return false;
    } else {
      addToFavorites(nft);
      return true;
    }
  };

  return {
    favorites,
    addToFavorites,
    removeFromFavorites,
    isFavorited,
    toggleFavorite,
    isConnected: !!account?.address,
  };
}

