// Consolidated auctions API route
import { NextRequest, NextResponse } from "next/server";
import staticMap from "../../../../docs/auction-map-static.json";
import { parseEventLogs } from "thirdweb/utils";
import { marketplaceV3Abi } from "thirdweb/extensions/marketplace";

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
    
    // Manual hex parsing with correct field mapping based on your analysis
    const items = (insight.data || []).map((event: any, index: number) => {
      // Extract from raw hex data
      const data = event.data;
      if (!data || data.length < 2) {
        return { listingId: 0, tokenId: 0, endSec: 0, startSec: 0, reservePrice: "0", buyoutPrice: "0", bidCount: 0, blockNumber: event.block_number, transactionHash: event.transaction_hash };
      }
      
      // Extract listingId (first 32 bytes after 0x)
      const listingId = parseInt(data.slice(2, 66), 16);
      
      // Extract tokenId (next 32 bytes) 
      const tokenId = parseInt(data.slice(66, 130), 16);
      
      // The auction tuple starts at offset 130 (after listingId and tokenId)
      // Based on your analysis: (assetContract, tokenId, quantity, currency, minimumBidAmount, buyoutBidAmount, timeBufferInSeconds, bidBufferBps, startTimestamp, endTimestamp)
      const auctionStart = 130;
      
      // Parse auction tuple fields (each is 32 bytes = 64 hex chars)
      // Fields: assetContract(0), tokenId(1), quantity(2), currency(3), minimumBidAmount(4), buyoutBidAmount(5), timeBufferInSeconds(6), bidBufferBps(7), startTimestamp(8), endTimestamp(9)
      // Each field is 32 bytes (64 hex characters), so offsets are: 0, 64, 128, 192, 256, 320, 384, 448, 512, 576
      const minimumBidAmount = parseInt(data.slice(auctionStart + 256, auctionStart + 320), 16); // index 4: 256-320
      const buyoutBidAmount = parseInt(data.slice(auctionStart + 320, auctionStart + 384), 16); // index 5: 320-384
      const startTimestamp = parseInt(data.slice(auctionStart + 512, auctionStart + 576), 16); // index 8: 512-576
      const endTimestamp = parseInt(data.slice(auctionStart + 576, auctionStart + 640), 16); // index 9: 576-640
      
      // Debug: log the extracted values to verify field mapping
      console.log("Debug - Raw values:", {
        minimumBidAmount,
        buyoutBidAmount, 
        startTimestamp,
        endTimestamp
      });
      
      // Debug: log the complete raw event data for analysis
      console.log("=== FULL EVENT DEBUG ===");
      console.log("Event topics:", event.topics);
      console.log("Event data length:", data.length);
      console.log("Full event data:", data);
      console.log("Auction start offset:", auctionStart);
      console.log("Data from auction start:", data.slice(auctionStart));
      console.log("=== FIELD EXTRACTION DEBUG ===");
      console.log("Field 4 (minBid) hex:", data.slice(auctionStart + 256, auctionStart + 320));
      console.log("Field 5 (buyout) hex:", data.slice(auctionStart + 320, auctionStart + 384));
      console.log("Field 8 (start) hex:", data.slice(auctionStart + 512, auctionStart + 576));
      console.log("Field 9 (end) hex:", data.slice(auctionStart + 576, auctionStart + 640));
      console.log("=== END DEBUG ===");
      
      // Convert timestamps to seconds (they should be Unix timestamps)
      const startSec = startTimestamp;
      const endSec = endTimestamp;
      
      // Convert prices to readable format (assuming 18 decimals for ETH)
      const reservePrice = (minimumBidAmount / Math.pow(10, 18)).toString();
      const buyoutPrice = (buyoutBidAmount / Math.pow(10, 18)).toString();
      
      const parsedItem = { 
        listingId, 
        tokenId, 
        endSec, 
        startSec,
        reservePrice,
        buyoutPrice,
        bidCount: 0,
        blockNumber: event.block_number,
        transactionHash: event.transaction_hash
      };
      
      return parsedItem;
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
