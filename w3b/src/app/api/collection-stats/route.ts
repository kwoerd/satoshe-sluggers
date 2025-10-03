// src/app/api/collection-stats/route.ts

import { NextResponse } from "next/server";

export async function GET() {
  try {
    // Static collection stats for Satoshe Sluggers
    const stats = {
      name: "Satoshe Sluggers",
      description: "Women's Baseball Card Collection",
      total_supply: 7777,
      unique_owner_count: 0, // Will be calculated when needed
      floor_price: 0.00777, // Ground Ball tier price
      volume: 0,
      edition: 1,
      rarity_tiers: 12
    };

    return NextResponse.json(stats, {
      headers: {
        "Cache-Control": "s-maxage=60, stale-while-revalidate=120",
        "X-Content-Type-Options": "nosniff",
        "X-Frame-Options": "DENY",
        "X-XSS-Protection": "1; mode=block",
        "Referrer-Policy": "strict-origin-when-cross-origin",
      },
    });
  } catch (error) {
    console.error("API error fetching collection stats:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}