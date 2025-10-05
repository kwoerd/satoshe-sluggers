// app/api/auctions/route.ts
import { NextRequest, NextResponse } from "next/server";

const INSIGHT = process.env.NEXT_PUBLIC_INSIGHT_CLIENT_ID!;
const CHAIN_ID = process.env.NEXT_PUBLIC_CHAIN_ID!;
const MARKET = process.env.NEXT_PUBLIC_MARKETPLACE_ADDRESS!;

// NOTE: Replace the event signature if your contract differs
const AUCTION_CREATED_SIG = "AuctionCreated(uint256,address,uint256,uint256,uint256)";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const page  = searchParams.get("page")  ?? "1";
  const limit = searchParams.get("limit") ?? "24";
  const sort  = searchParams.get("sort")  ?? "buyoutPrice:asc";
  // const q     = searchParams.get("q");              // name search (optional)
  const minP  = searchParams.get("minPrice");       // filters (optional)
  const maxP  = searchParams.get("maxPrice");

  // Base URL (events endpoint)
  let url = `https://${CHAIN_ID}.insight.thirdweb.com/v1/events/${MARKET}/${AUCTION_CREATED_SIG}?limit=${limit}&page=${page}&sort=${encodeURIComponent(sort)}`;

  // Add filters as needed (depends on your event fields/indexes)
  // Example: price range (if exposed on the event)
  if (minP) url += `&filter=buyoutPrice>=${minP}`;
  if (maxP) url += `&filter=buyoutPrice<=${maxP}`;

  // (Optional) you can do name search after metadata fetch on the server if Insight doesn’t index names the way you need.

  const res = await fetch(url, { headers: { "x-client-id": INSIGHT } });
  const data = await res.json();

  return NextResponse.json(data, { headers: { "Cache-Control": "s-maxage=10, stale-while-revalidate=30" } });
}
