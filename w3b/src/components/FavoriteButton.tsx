// src/components/FavoriteButton.tsx

"use client";
import { useActiveAccount } from "thirdweb/react";
import { Button } from "@/components/ui/button";
import { toggleFavorite, getFavorites } from "@/utils/favorites";
import { useState, useEffect } from "react";

export function FavoriteButton({ nftId }: { nftId: string }) {
  const account = useActiveAccount();
  const [favorites, setFavorites] = useState<string[]>([]);

  useEffect(() => {
    setFavorites(getFavorites());
  }, []);

  const isFav = favorites.includes(nftId);

  const handleToggle = () => {
    const updated = toggleFavorite(nftId, account);
    setFavorites(updated);
  };

  return (
    <Button variant="ghost" onClick={handleToggle}>
      {isFav ? "★ Favorited" : "☆ Favorite"}
    </Button>
  );
}
