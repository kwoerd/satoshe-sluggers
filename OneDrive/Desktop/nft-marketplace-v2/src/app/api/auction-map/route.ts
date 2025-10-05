// nft-marketplace/src/app/api/auction-map/route.ts
import { NextResponse } from "next/server";
import auctionMap from "../../../../docs/auction-map-static.json";
import { insight } from "@/lib/insight";

export async function GET() {
  const url = insight.englishAuctionsUrl(1000, 0);

  try {
    const res = await fetch(url, { method: "GET" });

    if (!res.ok) {
      console.warn("Insight API failed, using static fallback:", res.status);
      return NextResponse.json({
        source: "static-json",
        total: (auctionMap as any)?.items?.length || 0,
        items: (auctionMap as any)?.items || [],
      });
    }

    const data = await res.json();
    // Expecting { meta, data: [...] } per Insight docs
    const items = (data.data || []).map((row: any) => {
      const args = row.decoded?.args ?? row.args ?? {};
      return {
        listingId: Number(args.listingId ?? 0),
        tokenId: Number(args.auction?.tokenId ?? 0),
        endSec: Number(args.auction?.endTimestamp ?? 0),
        bidCount: 0, // we can enrich later
      };
    });

    return NextResponse.json({
      source: "insight",
      total: items.length,
      items,
    });
  } catch (err) {
    console.error("auction-map route error:", err);
    return NextResponse.json({
      source: "static-json",
      total: (auctionMap as any)?.items?.length || 0,
      items: (auctionMap as any)?.items || [],
    });
  }
}
