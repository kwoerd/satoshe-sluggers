// src/app/api/auction-map/route.ts
import { NextResponse } from "next/server";
import staticMap from "../../../../docs/auction-map-static.json";

const BASE_URL = process.env.INSIGHT_BASE_URL || "https://insight.thirdweb.com";
const MARKETPLACE = process.env.NEXT_PUBLIC_MARKETPLACE_ADDRESS!;
const CLIENT_ID = process.env.NEXT_PUBLIC_INSIGHT_CLIENT_ID!;
const CHAIN_ID = 8453;

const SIG_CREATED =
  "NewAuction(address,uint256,address,(uint256,uint256,uint256,uint256,uint256,uint64,uint64,uint64,uint64,address,address,address,uint8,uint8))";
const SIG_BID =
  "NewBid(uint256,address,address,uint256,(uint256,uint256,uint256,uint256,uint256,uint64,uint64,uint64,uint64,address,address,address,uint8,uint8))";
const SIG_CLOSED =
  "AuctionClosed(uint256,address,address,uint256,address,address)";

export async function GET() {
  try {
    const headers = { "x-client-id": CLIENT_ID };
    const url = (sig: string) =>
      `${BASE_URL}/v1/events/${MARKETPLACE}/${sig}?chain_id=${CHAIN_ID}&limit=1000&decoded=true`;

    const [rCreated, rBids, rClosed] = await Promise.all([
      fetch(url(SIG_CREATED), { headers }),
      fetch(url(SIG_BID), { headers }),
      fetch(url(SIG_CLOSED), { headers }),
    ]);

    if (!rCreated.ok) {
      const txt = await rCreated.text();
      console.error("Insight created fetch failed:", rCreated.status, txt);
      // fallback
      return NextResponse.json({ source: "static-json", items: staticMap }, { status: 200 });
    }

    const created = await rCreated.json();
    const bids = rBids.ok ? await rBids.json() : { data: [] };
    const closed = rClosed.ok ? await rClosed.json() : { data: [] };

    const closedSet = new Set(
      (closed.data || []).map((e: any) => {
        const id = e?.decoded?.args?.listingId ?? e?.args?.listingId;
        return id != null ? String(id) : null;
      }).filter((v: string | null) => v != null) as string[]
    );

    const bidCounts = new Map<string, number>();
    for (const b of bids.data || []) {
      const id = String(b?.decoded?.args?.listingId ?? b?.args?.listingId);
      if (!id) continue;
      bidCounts.set(id, (bidCounts.get(id) || 0) + 1);
    }

    const items = (created.data || [])
      .map((a: any) => {
        const args = a.decoded?.args ?? a.args ?? {};
        const listingId = Number(args.listingId ?? 0);
        const tokenId = Number(args.auction?.tokenId ?? 0);
        const endSec = Number(args.auction?.endTimestamp ?? 0);
        const bidCount = bidCounts.get(String(listingId)) || 0;
        return { tokenId, listingId, bidCount, endSec };
      })
      .filter((x: { listingId: number }) => x.listingId >= 7)
      .filter((x: { listingId: number }) => !closedSet.has(String(x.listingId)));

    return NextResponse.json({ source: "insight", total: items.length, items }, { status: 200 });
  } catch (err) {
    console.error("Auction map error (caught):", err);
    return NextResponse.json(
      { source: "static-json", items: staticMap },
      { status: 200 }
    );
  }
}



/*⚙️ How It Works
Calls Insight’s decoded event API using your NEXT_PUBLIC_INSIGHT_CLIENT_ID.
Returns human-readable event fields directly (no ABI parsing needed).
Filters out corrupted or closed listings (listingId < 7 or closed).
Falls back to your docs/auction-map-static.json if Insight fails.
Returns a clean items array for your frontend to map auctions.*/