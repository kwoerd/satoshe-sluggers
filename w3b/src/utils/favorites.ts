// src/utils/favorites.ts

export function getFavorites(): string[] {
  return JSON.parse(localStorage.getItem("favorites") || "[]");
}

export function toggleFavorite(id: string, account: unknown): string[] {
  if (!account) {
    alert("Please connect your wallet to favorite NFTs.");
    return getFavorites();
  }

  const favs = new Set(getFavorites());
  if (favs.has(id)) {
    favs.delete(id);
  } else {
    favs.add(id);
  }
  localStorage.setItem("favorites", JSON.stringify([...favs]));
  return [...favs];
}
