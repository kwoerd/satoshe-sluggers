import { useState, useEffect } from "react";

interface FavoriteNFT {
  tokenId: string;
  name: string;
  image: string;
  rarity: string;
  rank: string | number;
  rarityPercent: string | number;
}

const FAVORITES_KEY = "satoshe-sluggers-favorites";

export function useFavorites() {
  const [favorites, setFavorites] = useState<Record<string, FavoriteNFT>>({});
  const [isConnected, setIsConnected] = useState(false);

  // Load favorites from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(FAVORITES_KEY);
      if (stored) {
        setFavorites(JSON.parse(stored));
      }
    } catch (error) {
      console.error("Failed to load favorites:", error);
    }
  }, []);

  // Save favorites to localStorage whenever favorites change
  useEffect(() => {
    try {
      localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
    } catch (error) {
      console.error("Failed to save favorites:", error);
    }
  }, [favorites]);

  const isFavorited = (tokenId: string): boolean => {
    return !!favorites[tokenId];
  };

  const toggleFavorite = (nft: FavoriteNFT) => {
    setFavorites(prev => {
      const newFavorites = { ...prev };
      if (newFavorites[nft.tokenId]) {
        delete newFavorites[nft.tokenId];
      } else {
        newFavorites[nft.tokenId] = nft;
      }
      return newFavorites;
    });
  };

  const getFavoritesList = (): FavoriteNFT[] => {
    return Object.values(favorites);
  };

  const clearFavorites = () => {
    setFavorites({});
  };

  return {
    favorites,
    isFavorited,
    toggleFavorite,
    getFavoritesList,
    clearFavorites,
    isConnected,
  };
}
