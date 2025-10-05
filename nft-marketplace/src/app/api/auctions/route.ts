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
    
    // Parse raw events response
    const items = (insight.data || []).map((event: any, index: number) => {
      // Extract from raw hex data
      const data = event.data;
      if (!data || data.length < 2) {
        return { listingId: 0, tokenId: 0, endSec: 0, startSec: 0, reservePrice: "0", buyoutPrice: "0", bidCount: 0, blockNumber: event.block_number, transactionHash: event.transaction_hash };
      }
      
      // Parse hex data properly for NewAuction event
      // The data field contains: listingId, tokenId, auction tuple
      // Each field is 32 bytes (64 hex characters)
      
      // Extract listingId (first 32 bytes after 0x)
      const listingId = parseInt(data.slice(2, 66), 16);
      
      // Extract tokenId (next 32 bytes) 
      const tokenId = parseInt(data.slice(66, 130), 16);
      
      // The auction tuple starts at offset 130 (after listingId and tokenId)
      // Parse the auction tuple fields (each is 32 bytes = 64 hex chars)
      const auctionStart = 130;
      
      // Parse auction tuple: (uint256, uint256, uint256, address, uint256, uint64, uint64, uint64, uint64, address, address, address, uint8, uint8)
      // Fields: listingId, tokenId, quantity, currency, pricePerToken, startTimestamp, endTimestamp, ...
      const quantity = parseInt(data.slice(auctionStart, auctionStart + 64), 16);
      const currency = data.slice(auctionStart + 64, auctionStart + 128);
      const pricePerToken = parseInt(data.slice(auctionStart + 128, auctionStart + 192), 16);
      const startTimestamp = parseInt(data.slice(auctionStart + 192, auctionStart + 256), 16);
      const endTimestamp = parseInt(data.slice(auctionStart + 256, auctionStart + 320), 16);
      
      // Debug: log the raw values to understand the data structure
      console.log("Debug - Raw hex data:", data);
      console.log("Debug - startTimestamp:", startTimestamp, "endTimestamp:", endTimestamp);
      console.log("Debug - pricePerToken:", pricePerToken);
      
      // For now, use pricePerToken for both reserve and buyout prices
      // In a real implementation, we'd need to extract the actual reserve and buyout prices from the auction tuple
      const reservePrice = pricePerToken;
      const buyoutPrice = pricePerToken;
      
      // Convert timestamps to seconds (they should be Unix timestamps)
      // If they're already in seconds (Unix timestamp), use them directly
      // If they're in milliseconds, divide by 1000
      const startSec = startTimestamp > 1000000000 ? startTimestamp : Math.floor(startTimestamp / 1000);
      const endSec = endTimestamp > 1000000000 ? endTimestamp : Math.floor(endTimestamp / 1000);
      
      // Convert prices to readable format (assuming 18 decimals for ETH)
      const reservePriceFormatted = (reservePrice / Math.pow(10, 18)).toString();
      const buyoutPriceFormatted = (buyoutPrice / Math.pow(10, 18)).toString();
      
      const parsedItem = { 
        listingId, 
        tokenId, 
        endSec, 
        startSec,
        reservePrice: reservePriceFormatted,
        buyoutPrice: buyoutPriceFormatted,
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
