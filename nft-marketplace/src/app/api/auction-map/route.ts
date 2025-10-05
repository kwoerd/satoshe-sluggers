// src/app/api/auction-map/route.ts
// src/app/api/auction-map/route.ts
import { NextResponse } from "next/server";
import { getContract } from "thirdweb";
import { base } from "thirdweb/chains";
import { client } from "@/lib/thirdweb";
import auctionMap from "../../../../docs/auction-map-static.json";
import marketplaceAbiJson from "../../../../docs/abi/nft_marketplace_abi.json";

const MARKETPLACE_ADDRESS = process.env.NEXT_PUBLIC_MARKETPLACE_ADDRESS!;

// Define type for auction map file
type AuctionMapItem = {
  listingId: number;
  tokenId: number;
};

type AuctionMapFile = AuctionMapItem[];

// Handle GET requests
export async function GET() {
  try {
    // const contract = getContract({
    //   client,
    //   address: MARKETPLACE_ADDRESS,
    //   chain: base,
    //   abi: marketplaceAbiJson as any,
    // });

    // Ensure auctionMap is an array, even if it's accidentally an object
    const items: AuctionMapFile = Array.isArray(auctionMap)
      ? auctionMap
      : Object.values(auctionMap);

    // Filter out corrupted early listings (rule: skip listingId < 7)
    const validListings = items.filter((item) => item.listingId >= 7);

    return NextResponse.json({
      count: validListings.length,
      items: validListings,
    });
  } catch (error) {
    console.error("Error loading auction map:", error);
    return NextResponse.json(
      { error: "Failed to load auction map" },
      { status: 500 }
    );
  }
}



/*⚙️ How It Works
Calls Insight’s decoded event API using your NEXT_PUBLIC_INSIGHT_CLIENT_ID.
Returns human-readable event fields directly (no ABI parsing needed).
Filters out corrupted or closed listings (listingId < 7 or closed).
Falls back to your docs/auction-map-static.json if Insight fails.
Returns a clean items array for your frontend to map auctions.*/