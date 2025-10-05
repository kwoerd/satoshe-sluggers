// nft-marketplace/src/app/api/my-nfts/route.ts
import { NextResponse } from "next/server";
import { insight } from "@/lib/insight";

const GATEWAY = "https://ipfs.thirdwebcdn.com/ipfs";
function ipfsToHttp(url?: string | null) {
  if (!url) return null;
  if (/^https?:\/\//i.test(url)) {
    const m = url.match(/\/ipfs\/([^/?#]+)(.*)?$/i);
    if (m) return `${GATEWAY}/${m[1]}${m[2] || ""}`;
    return url;
  }
  if (url.startsWith("ipfs://")) {
    const rest = url.slice(7).replace(/^ipfs\//i, "");
    return `${GATEWAY}/${rest}`;
  }
  if (/^[A-Za-z0-9]{46,}$/.test(url)) return `${GATEWAY}/${url}`;
  return url;
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const owner = searchParams.get("owner");

  if (!owner) {
    return NextResponse.json(
      { error: "Missing owner" },
      { status: 400 }
    );
  }

  const url = insight.ownedUrl(owner);

  try {
    const res = await fetch(url, { method: "GET" });
    if (!res.ok) {
      const txt = await res.text();
      console.warn("Insight owned NFTs failed:", res.status, txt);
      return NextResponse.json({ source: "insight", items: [] }, { status: 200 });
    }

    const data = await res.json();
    const items = (data.data || data.items || []).map((n: Record<string, unknown>) => {
      const extraMetadata = n.extra_metadata as Record<string, unknown> | undefined;
      const img = (n.image_url as string) ||
        (extraMetadata?.image as string) ||
        (extraMetadata?.image_url as string) ||
        null;

      const metadata = n.metadata as Record<string, unknown> | undefined;
      return {
        token_id: n.token_id ?? n.tokenId ?? null,
        name: n.name ?? metadata?.name ?? `#${n.token_id ?? ""}`,
        image_url: ipfsToHttp(img) || "/placeholder-nft.webp",
        attributes: extraMetadata?.attributes || metadata?.attributes || [],
      };
    });

    return NextResponse.json({ source: "insight", items });
  } catch (err) {
    console.error("my-nfts route error:", err);
    return NextResponse.json({ source: "insight", items: [] }, { status: 200 });
  }
}
