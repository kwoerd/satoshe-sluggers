import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const owner = searchParams.get("owner");
  if (!owner) {
    return NextResponse.json({ error: "Missing owner param" }, { status: 400 });
  }

  const contract = process.env.NEXT_PUBLIC_NFT_COLLECTION_ADDRESS!;
  const chainId = 8453;
  const baseUrl = process.env.INSIGHT_BASE_URL || "https://insight.thirdweb.com";
  const clientId = process.env.NEXT_PUBLIC_INSIGHT_CLIENT_ID!;

  const url = `${baseUrl}/v1/nfts?contract_address=${contract}&owner_address=${owner}&chain_id=${chainId}&resolve_metadata_links=true&limit=250`;

  const res = await fetch(url, {
    headers: { "x-client-id": clientId },
  });

  if (!res.ok) {
    return NextResponse.json({ error: "Insight API failed" }, { status: res.status });
  }

  const data = await res.json();
  return NextResponse.json(data);
}
