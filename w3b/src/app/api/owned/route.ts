// src/app/api/owned/route.ts

import { NextRequest, NextResponse } from "next/server";

const INSIGHT = process.env.INSIGHT_CLIENT_ID!;
const CHAIN_ID = process.env.NEXT_PUBLIC_CHAIN_ID!;
const NFT_COLLECTION = process.env.NEXT_PUBLIC_NFT_COLLECTION_ADDRESS!;

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const wallet = searchParams.get("wallet");
  const limit = searchParams.get("limit") ?? "50";

  if (!wallet) {
    return NextResponse.json({ error: "Wallet address required" }, { status: 400 });
  }

  const url = `https://${CHAIN_ID}.insight.thirdweb.com/v1/tokens/${NFT_COLLECTION}/owner/${wallet}?limit=${limit}`;

  const res = await fetch(url, {
    headers: { "x-client-id": INSIGHT },
    cache: "no-store",
  });

  const data = await res.json();

  return NextResponse.json(data, {
    headers: {
      "Cache-Control": "s-maxage=30, stale-while-revalidate=60",
    },
  });
}
