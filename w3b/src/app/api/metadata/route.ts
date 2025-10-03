// src/app/api/metadata/route.ts

import { NextRequest, NextResponse } from "next/server";

const INSIGHT = process.env.INSIGHT_CLIENT_ID!;
const CHAIN_ID = process.env.NEXT_PUBLIC_CHAIN_ID!;

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const contract = searchParams.get("contract")!;
  const tokenId  = searchParams.get("tokenId")!;

  const url = `https://${CHAIN_ID}.insight.thirdweb.com/v1/tokens/${contract}/${tokenId}/metadata`;
  const res = await fetch(url, {
    headers: { "x-client-id": INSIGHT },
    cache: "no-store",
  });

  return NextResponse.json(await res.json(), {
    headers: {
      "Cache-Control": "s-maxage=60, stale-while-revalidate=300",
    },
  });
}
