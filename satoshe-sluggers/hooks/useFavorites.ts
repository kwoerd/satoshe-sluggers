import { useState, useEffect } from 'react';
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

  // Get storage key for current wallet
  const getStorageKey = () => {
    if (!account?.address) return null;
    return `nft_favorites_${account.address.toLowerCase()}`;
  };

  // Load favorites from localStorage
  useEffect(() => {
    const storageKey = getStorageKey();
    if (!storageKey) {
      setFavorites([]);
      return;
    }

    try {
      const stored = localStorage.getItem(storageKey);
      if (stored) {
        const parsedFavorites = JSON.parse(stored);
        setFavorites(parsedFavorites);
      } else {
        setFavorites([]);
      }
    } catch (error) {
      console.error('Error loading favorites:', error);
      setFavorites([]);
    }
  }, [account?.address]);

  // Save favorites to localStorage
  const saveFavorites = (newFavorites: FavoriteNFT[]) => {
    const storageKey = getStorageKey();
    if (!storageKey) return;

    try {
      localStorage.setItem(storageKey, JSON.stringify(newFavorites));
      setFavorites(newFavorites);
    } catch (error) {
      console.error('Error saving favorites:', error);
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
