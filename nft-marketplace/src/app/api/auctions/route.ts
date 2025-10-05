// Consolidated auctions API route
import { NextRequest, NextResponse } from "next/server";
import staticMap from "../../../../docs/auction-map-static.json";

const BASE = process.env.INSIGHT_BASE_URL || "https://insight.thirdweb.com";
const MARKETPLACE = process.env.NEXT_PUBLIC_MARKETPLACE_ADDRESS!;
const CLIENT_ID = process.env.NEXT_PUBLIC_INSIGHT_CLIENT_ID!;
const CHAIN_ID = process.env.NEXT_PUBLIC_CHAIN_ID || "8453";

// Event signatures for different auction types
const NEW_AUCTION_SIG = "NewAuction(address,uint256,address,(uint256,uint256,uint256,uint256,uint256,uint64,uint64,uint64,uint64,address,address,address,uint8,uint8))";
const AUCTION_CREATED_SIG = "AuctionCreated(uint256,address,uint256,uint256,uint256)";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const page = searchParams.get("page") || "1";
  const limit = searchParams.get("limit") || "25"; // Default to 25 as requested
  const sort = searchParams.get("sort") || "buyoutPrice:asc";
  const type = searchParams.get("type") || "live"; // live, created, or all
  const minP = searchParams.get("minPrice");
  const maxP = searchParams.get("maxPrice");

  try {
    let url: string;
    let eventSig: string;

    // Choose event signature based on type
    switch (type) {
      case "live":
        eventSig = NEW_AUCTION_SIG;
        break;
      case "created":
        eventSig = AUCTION_CREATED_SIG;
        break;
      default:
        eventSig = NEW_AUCTION_SIG;
    }

    // Use raw events and decode manually (like working auction-map route)
    url = `${BASE}/v1/events/${MARKETPLACE}/${eventSig}?chain_id=${CHAIN_ID}&limit=${limit}`;
    
    if (sort) url += `&sort=${encodeURIComponent(sort)}`;
    if (minP) url += `&filter=buyoutPrice>=${minP}`;
    if (maxP) url += `&filter=buyoutPrice<=${maxP}`;

    console.log("🔍 Fetching Insight URL:", url);
    console.log("🔑 Client ID:", CLIENT_ID);
    console.log("🏪 Marketplace:", MARKETPLACE);

    const res = await fetch(url, {
      method: "GET",
      headers: { "x-client-id": CLIENT_ID }
    });

    console.log("📡 Insight response status:", res.status);

    if (!res.ok) {
      const errorText = await res.text();
      console.error("❌ Insight fetch failed:", res.status, errorText);
      return NextResponse.json({ 
        source: "static-json", 
        items: staticMap,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          hasMore: false
        },
        error: `Insight API failed: ${res.status} ${errorText}`
      });
    }

    const insight = await res.json();
    console.log("✅ Insight API success! Raw response:", JSON.stringify(insight, null, 2));
    
    // Debug the actual structure
    console.log("🔍 Response structure analysis:");
    console.log("- insight.data:", insight.data?.length || 0, "items");
    console.log("- First item structure:", insight.data?.[0] ? Object.keys(insight.data[0]) : "No data");
    if (insight.data?.[0]) {
      console.log("- First item sample:", insight.data[0]);
    }
    
    // Parse raw events response (like working auction-map route)
    const items = (insight.data || []).map((event: any, index: number) => {
      console.log(`🔍 Processing raw event ${index}:`, JSON.stringify(event, null, 2));
      
      // Extract from raw hex data (same as auction-map route)
      // The data field contains the hex-encoded event parameters
      const data = event.data;
      if (!data || data.length < 2) {
        console.log(`⚠️ No data for event ${index}`);
        return { listingId: 0, tokenId: 0, endSec: 0, startSec: 0, reservePrice: "0", buyoutPrice: "0", bidCount: 0, blockNumber: event.block_number, transactionHash: event.transaction_hash };
      }
      
      // Parse hex data manually (this is the key!)
      // The data contains: listingId, tokenId, auction data, etc.
      const listingId = parseInt(data.slice(2, 66), 16); // First 32 bytes
      const tokenId = parseInt(data.slice(66, 130), 16); // Next 32 bytes
      
      // For now, return basic data - we can enhance this later
      const parsedItem = { 
        listingId, 
        tokenId, 
        endSec: 0, // TODO: Parse from hex data
        startSec: 0, // TODO: Parse from hex data
        reservePrice: "0", // TODO: Parse from hex data
        buyoutPrice: "0", // TODO: Parse from hex data
        bidCount: 0,
        blockNumber: event.block_number,
        transactionHash: event.transaction_hash
      };
      
      console.log(`- Parsed raw event ${index}:`, parsedItem);
      return parsedItem;
    });

    console.log("📊 Final parsed items:", items.length, "auctions found");
    console.log("📊 Sample parsed item:", items[0]);

    // Check if we actually got meaningful data from Insight
    const hasRealData = items.length > 0 && items.some((item: any) => 
      (item.listingId && item.listingId > 0) || 
      (item.tokenId && item.tokenId > 0) || 
      (item.endSec && item.endSec > 0) || 
      (item.reservePrice && item.reservePrice !== "0") || 
      (item.buyoutPrice && item.buyoutPrice !== "0")
    );

    console.log("🔍 Data quality check:", {
      hasRealData,
      sampleItem: items[0],
      allZeros: items.every((item: any) => 
        item.listingId === 0 && 
        item.tokenId === 0 && 
        item.endSec === 0 && 
        item.reservePrice === "0" && 
        item.buyoutPrice === "0"
      )
    });

    // Return Insight data even if empty (like auction-map route does)
    console.log("✅ Returning Insight data:", items.length, "items");
    return NextResponse.json({ 
      source: "insight", 
      total: items.length, 
      items,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        hasMore: items.length === parseInt(limit)
      }
    }, { 
      headers: { 
        "Cache-Control": "no-cache, no-store, must-revalidate",
        "Pragma": "no-cache",
        "Expires": "0"
      } 
    });

  } catch (err) {
    console.error("Auctions route error:", err);
    return NextResponse.json({ 
      source: "static-json", 
      items: staticMap,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        hasMore: false
      }
    });
  }
}
