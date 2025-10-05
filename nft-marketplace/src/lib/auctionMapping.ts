import auctionMapData from "../auction-map.json";

/**
 * Get the listing ID associated with a given NFT tokenId.
 * Falls back gracefully if the token isn't found.
 */
export function getListingIdByTokenId(tokenId: number): number | null {
  const entry = auctionMapData.find((item) => item.tokenId === tokenId);
  return entry ? entry.listingId : null;
}

/**
 * Optionally: Get the full auction metadata for a token.
 */
export function getAuctionMetadataByTokenId(tokenId: number) {
  return auctionMapData.find((item) => item.tokenId === tokenId) || null;
}

/**
 * List all token→listing pairs, for debugging or indexing.
 */
export function getAllAuctionMappings() {
  return auctionMapData.map(({ tokenId, listingId }) => ({
    tokenId,
    listingId,
  }));
}
