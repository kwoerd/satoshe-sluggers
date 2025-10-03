// src/app/api/auctions/route.ts

import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

// Helper functions for auction data
function formatTimeRemaining(seconds: number): string {
  if (seconds <= 0) return "Ended";

  const days = Math.floor(seconds / 86400);
  const hours = Math.floor((seconds % 86400) / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);

  if (days > 0) {
    return `${days}d ${hours}h ${minutes}m`;
  } else if (hours > 0) {
    return `${hours}h ${minutes}m`;
  } else {
    return `${minutes}m`;
  }
}

// Load pricing data from price_by_tier.txt
function getPricingByTier() {
  try {
    const filePath = path.join(process.cwd(), 'docs', 'price_by_tier.txt');
    const fileContents = fs.readFileSync(filePath, 'utf8');
    const lines = fileContents.split('\n').filter(line => line.trim());
    
    const pricing: { [key: string]: { reserve: number; buyout: number } } = {};
    
    // Skip header line, process data lines
    for (let i = 1; i < lines.length; i++) {
      const parts = lines[i].split('\t');
      if (parts.length >= 3) {
        const tier = parts[0].trim();
        const reserve = parseFloat(parts[1]);
        const buyout = parseFloat(parts[2]);
        pricing[tier] = { reserve, buyout };
      }
    }
    
    return pricing;
  } catch (error) {
    console.error("Error reading price_by_tier.txt:", error);
    return {};
  }
}

// Load auction mapping data
function getAuctionMap() {
  try {
    const filePath = path.join(process.cwd(), 'docs', 'auction-map.json');
    const fileContents = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(fileContents);
  } catch (error) {
    console.error("Error reading auction-map.json:", error);
    return [];
  }
}

// Load combined metadata
function getCombinedMetadata() {
  try {
    const filePath = path.join(process.cwd(), 'docs', 'combined_metadata.json');
    const fileContents = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(fileContents);
  } catch (error) {
    console.error("Error reading combined_metadata.json:", error);
    return [];
  }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const page = Math.max(1, parseInt(searchParams.get("page") ?? "1"));
    const limit = Math.min(100, Math.max(1, parseInt(searchParams.get("limit") ?? "24")));
    const tokenId = searchParams.get("tokenId");

    // Load all data
    const auctionMap = getAuctionMap();
    const combinedMetadata = getCombinedMetadata();
    const pricingByTier = getPricingByTier();

    // Create lookup maps for faster access
    const auctionLookup = new Map();
    auctionMap.forEach((item: any) => { // eslint-disable-line @typescript-eslint/no-explicit-any
      auctionLookup.set(item.tokenId, item);
    });

    const metadataLookup = new Map();
    combinedMetadata.forEach((item: any) => { // eslint-disable-line @typescript-eslint/no-explicit-any
      metadataLookup.set(item.token_id, item);
    });

    let nfts;

    if (tokenId) {
      // Single NFT request
      const tokenIdNum = parseInt(tokenId);
      const auctionData = auctionLookup.get(tokenIdNum);
      const metadata = metadataLookup.get(tokenIdNum);
      
      if (!metadata) {
        return NextResponse.json(
          { error: "NFT not found" },
          { status: 404 }
        );
      }

      nfts = [{
        tokenId: tokenIdNum.toString(),
        listingId: auctionData?.listingId || null,
        metadata: {
          name: metadata.name,
          image: metadata.image_url,
          description: metadata.description,
          attributes: metadata.attributes || []
        },
        auction: auctionData ? {
          listingId: auctionData.listingId,
          endTime: auctionData.endSec,
          bidCount: auctionData.bidCount,
          status: auctionData.status,
          timeRemaining: Math.max(0, auctionData.endSec - Math.floor(Date.now() / 1000)),
          timeRemainingFormatted: formatTimeRemaining(Math.max(0, auctionData.endSec - Math.floor(Date.now() / 1000))),
          minBid: pricingByTier[metadata.rarity_tier]?.reserve?.toString() || "0.00777",
          buyoutPrice: pricingByTier[metadata.rarity_tier]?.buyout?.toString() || "0.015",
          rank: metadata.rank,
          rarity: metadata.rarity_percent?.toString() + "%",
          tier: metadata.rarity_tier
        } : null
      }];
    } else {
      // Paginated request
      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + limit;
      
      nfts = combinedMetadata
        .slice(startIndex, endIndex)
        .map((metadata: any) => { // eslint-disable-line @typescript-eslint/no-explicit-any
          const auctionData = auctionLookup.get(metadata.token_id);
          
          return {
            tokenId: metadata.token_id.toString(),
            listingId: auctionData?.listingId || null,
            metadata: {
              name: metadata.name,
              image: metadata.image_url,
              description: metadata.description,
              attributes: metadata.attributes || []
            },
            auction: auctionData ? {
              listingId: auctionData.listingId,
              endTime: auctionData.endSec,
              bidCount: auctionData.bidCount,
              status: auctionData.status,
              timeRemaining: Math.max(0, auctionData.endSec - Math.floor(Date.now() / 1000)),
              timeRemainingFormatted: formatTimeRemaining(Math.max(0, auctionData.endSec - Math.floor(Date.now() / 1000))),
              minBid: pricingByTier[metadata.rarity_tier]?.reserve?.toString() || "0.00777",
              buyoutPrice: pricingByTier[metadata.rarity_tier]?.buyout?.toString() || "0.015",
              rank: metadata.rank,
              rarity: metadata.rarity_percent?.toString() + "%",
              tier: metadata.rarity_tier
            } : null
          };
        });
    }

    return NextResponse.json({
      events: nfts,
      totalCount: combinedMetadata.length,
      page: page
    }, {
      headers: {
        "Cache-Control": "s-maxage=10, stale-while-revalidate=30",
        "X-Content-Type-Options": "nosniff",
        "X-Frame-Options": "DENY",
        "X-XSS-Protection": "1; mode=block",
        "Referrer-Policy": "strict-origin-when-cross-origin",
      },
    });
  } catch (error) {
    console.error("API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}