// src/components/AuctionPricing.tsx

"use client";

interface AuctionPricingProps {
  minBid: string | null;
  buyoutPrice: string | null;
  children: (pricing: {
    minBid: string | null;
    buyoutPrice: string | null;
    isLoading: boolean;
  }) => React.ReactNode;
}

export function AuctionPricing({ minBid, buyoutPrice, children }: AuctionPricingProps) {
  // NO RPC CALLS - All data comes from Insight API
  // This component just passes through the pricing data from Insight API
  
  return (
    <>
      {children({
        minBid,
        buyoutPrice,
        isLoading: false // No loading since data comes from Insight API
      })}
    </>
  );
}
