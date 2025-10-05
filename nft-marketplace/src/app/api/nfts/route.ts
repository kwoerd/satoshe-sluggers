import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const limit = searchParams.get("limit") || "50";
  const page = searchParams.get("page") || "1";

  const contract = process.env.NEXT_PUBLIC_NFT_COLLECTION_ADDRESS!;
  const chainId = 8453;
  const baseUrl = process.env.INSIGHT_BASE_URL || "https://insight.thirdweb.com";
  const clientId = process.env.NEXT_PUBLIC_INSIGHT_CLIENT_ID!;

  const url = `${baseUrl}/v1/nfts?contract_address=${contract}&chain_id=${chainId}&limit=${limit}&page=${page}&resolve_metadata_links=true`;

  const res = await fetch(url, {
    headers: { "x-client-id": clientId },
  });

  if (!res.ok) {
    return NextResponse.json({ error: "Insight API failed" }, { status: res.status });
  }

  const data = await res.json();
  return NextResponse.json(data);
}
