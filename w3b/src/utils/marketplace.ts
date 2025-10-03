// src/utils/marketplace.ts

// DISABLED: All marketplace contract calls disabled to prevent RPC calls
// The app should work 100% with Insight API only

// Function to get auction details from marketplace contract
export async function getAuctionDetails(listingId: bigint) {
  // DISABLED: No RPC calls allowed
  console.log("Marketplace contract calls disabled to prevent rate limiting");
  
  return {
    minBid: null,
    buyoutPrice: null,
  };
}