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

    const res = await fetch(url, {
      method: "GET",
      headers: { "x-client-id": CLIENT_ID }
    });

    if (!res.ok) {
      const errorText = await res.text();
      console.error("Insight API failed:", res.status, errorText);
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
    
    // Debug: log the actual response structure
    console.log("🔍 Insight API response structure:", {
      hasData: !!insight.data,
      dataLength: insight.data?.length,
      firstEventKeys: insight.data?.[0] ? Object.keys(insight.data[0]) : null,
      firstEventDecoded: insight.data?.[0]?.decoded ? Object.keys(insight.data[0].decoded) : null
    });
    
    // Debug: log the first event to see the actual structure
    if (insight.data?.[0]) {
      console.log("🔍 First event structure:", JSON.stringify(insight.data[0], null, 2));
    }
    
    // Use the already-decoded values from Insight API - no manual hex parsing needed!
    const items = (insight.data || []).map((event: any) => {
      // Access the decoded auction data using the correct structure
      const auction = event.decoded?.non_indexed_params?.auction;
      
      if (!auction) {
        console.log("❌ No decoded auction data found. Event keys:", Object.keys(event));
        console.log("🔍 Event decoded structure:", event.decoded);
        console.log("🔍 Event non_indexed_params:", event.decoded?.non_indexed_params);
        return { 
          listingId: 0, 
          tokenId: 0, 
          endSec: 0, 
          startSec: 0, 
          reservePrice: "0", 
          buyoutPrice: "0", 
          bidCount: 0, 
          blockNumber: event.block_number, 
          transactionHash: event.transaction_hash 
        };
      }
      
      // Extract values directly from decoded fields using the correct paths
      const listingId = Number(auction.auctionId || 0);
      const tokenId = Number(auction.tokenId || 0);
      const startTimestamp = Number(auction.startTimestamp || 0);
      const endTimestamp = Number(auction.endTimestamp || 0);
      const minimumBidAmount = auction.minimumBidAmount || "0";
      const buyoutBidAmount = auction.buyoutBidAmount || "0";
      
      // Convert prices from wei to ETH (18 decimals)
      const reservePrice = (Number(minimumBidAmount) / Math.pow(10, 18)).toString();
      const buyoutPrice = (Number(buyoutBidAmount) / Math.pow(10, 18)).toString();
      
      console.log("✅ SUCCESS - Using decoded values:", {
        listingId,
        tokenId,
        startTimestamp,
        endTimestamp,
        minimumBidAmount,
        buyoutBidAmount,
        reservePrice,
        buyoutPrice
      });
      
      return {
        listingId,
        tokenId,
        endSec: endTimestamp,
        startSec: startTimestamp,
        reservePrice,
        buyoutPrice,
        bidCount: 0,
        blockNumber: event.block_number,
        transactionHash: event.transaction_hash
      };
    });

    // Check if we actually got meaningful data from Insight
    const hasRealData = items.length > 0 && items.some((item: any) => 
      (item.listingId && item.listingId > 0) || 
      (item.tokenId && item.tokenId > 0) || 
      (item.endSec && item.endSec > 0) || 
      (item.reservePrice && item.reservePrice !== "0") || 
      (item.buyoutPrice && item.buyoutPrice !== "0")
    );
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
