import { NextRequest, NextResponse } from "next/server";

const INSIGHT = process.env.NEXT_PUBLIC_INSIGHT_CLIENT_ID!;
const CHAIN_ID = process.env.NEXT_PUBLIC_CHAIN_ID!;
const MARKET = process.env.NEXT_PUBLIC_MARKETPLACE_ADDRESS!;

// Replace with your actual auction event signature
const AUCTION_CREATED_SIG = "AuctionCreated(uint256,address,uint256,uint256,uint256)";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const page  = searchParams.get("page") ?? "1";
  const limit = searchParams.get("limit") ?? "24";
  const sort  = searchParams.get("sort") ?? "buyoutPrice:asc";

  const url = `https://${CHAIN_ID}.insight.thirdweb.com/v1/events/${MARKET}/${AUCTION_CREATED_SIG}?limit=${limit}&page=${page}&sort=${encodeURIComponent(sort)}`;

  const res = await fetch(url, {
    headers: { "x-client-id": INSIGHT },
    cache: "no-store", // ensures fresh data
  });

  const data = await res.json();

  return NextResponse.json(data, {
    headers: {
      "Cache-Control": "s-maxage=10, stale-while-revalidate=30",
    },
  });
}
