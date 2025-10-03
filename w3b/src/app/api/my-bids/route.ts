// src/app/api/my-bids/route.ts

import { NextRequest, NextResponse } from "next/server";

const INSIGHT = process.env.INSIGHT_CLIENT_ID!;
const CHAIN_ID = process.env.NEXT_PUBLIC_CHAIN_ID!;
const MARKET = process.env.NEXT_PUBLIC_MARKETPLACE_ADDRESS!;

// BidPlaced event signature
const BID_PLACED_SIG = "BidPlaced(uint256,address,uint256)";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const wallet = searchParams.get("wallet");

  if (!wallet) {
    return NextResponse.json({ error: "Wallet address required" }, { status: 400 });
  }

  const url = `https://${CHAIN_ID}.insight.thirdweb.com/v1/events/${MARKET}/${BID_PLACED_SIG}?filter.account=${wallet}`;

  const res = await fetch(url, {
    headers: { "x-client-id": INSIGHT },
    cache: "no-store",
  });

  const data = await res.json();

  return NextResponse.json(data, {
    headers: {
      "Cache-Control": "s-maxage=10, stale-while-revalidate=30",
    },
  });
}
