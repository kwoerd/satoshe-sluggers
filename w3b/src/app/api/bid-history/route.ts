// src/app/api/bid-history/route.ts

import { NextRequest, NextResponse } from "next/server";

const INSIGHT = process.env.INSIGHT_CLIENT_ID!;
const CHAIN_ID = process.env.NEXT_PUBLIC_CHAIN_ID!;
const MARKET = process.env.NEXT_PUBLIC_MARKETPLACE_ADDRESS!;

const BID_PLACED_SIG = "BidPlaced(uint256,address,uint256)";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const tokenId = searchParams.get("tokenId");

  if (!tokenId) {
    return NextResponse.json({ error: "Token ID required" }, { status: 400 });
  }

  const url = `https://${CHAIN_ID}.insight.thirdweb.com/v1/events/${MARKET}/${BID_PLACED_SIG}?filter.tokenId=${tokenId}`;

  const res = await fetch(url, {
    headers: { "x-client-id": INSIGHT },
    cache: "no-store",
  });

  return NextResponse.json(await res.json(), {
    headers: {
      "Cache-Control": "s-maxage=15, stale-while-revalidate=30",
    },
  });
}
