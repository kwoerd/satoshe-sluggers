// src/components/Favorites.tsx

"use client";

import { useState, useEffect } from "react";
import { NFTCard } from "./NftCard";

export default function Favorites() {
  const [favorites, setFavorites] = useState<string[]>([]);

  useEffect(() => {
    const favs = JSON.parse(localStorage.getItem("favorites") || "[]");
    setFavorites(favs);
  }, []);

  if (!favorites.length) return <p>No favorites yet.</p>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {favorites.map((id) => (
        <NFTCard key={id} nft={{ tokenId: id }} />
      ))}
    </div>
  );
}
