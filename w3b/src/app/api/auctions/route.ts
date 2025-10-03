// src/app/api/auctions/route.ts

import { NextRequest, NextResponse } from "next/server";

const INSIGHT = process.env.INSIGHT_CLIENT_ID!;
const CHAIN_ID = process.env.NEXT_PUBLIC_CHAIN_ID!;
const NFT_COLLECTION = process.env.NEXT_PUBLIC_NFT_COLLECTION_ADDRESS!;

export async function GET(req: NextRequest) {
  try {
    // Check if environment variables are set
    if (!INSIGHT || !CHAIN_ID || !NFT_COLLECTION) {
      console.error("Missing environment variables:", {
        INSIGHT: !!INSIGHT,
        CHAIN_ID: !!CHAIN_ID,
        NFT_COLLECTION: !!NFT_COLLECTION
      });
      return NextResponse.json(
        { error: "Server configuration missing. Please check environment variables." },
        { status: 500 }
      );
    }

    const { searchParams } = new URL(req.url);
    const page = Math.max(1, parseInt(searchParams.get("page") ?? "1"));
    const limit = Math.min(100, Math.max(1, parseInt(searchParams.get("limit") ?? "24")));
    const tokenId = searchParams.get("tokenId");
    const contractAddress = searchParams.get("contract") || NFT_COLLECTION;
    const chainId = searchParams.get("chainId") || CHAIN_ID;
    
    // Validate tokenId if provided
    if (tokenId && !/^\d+$/.test(tokenId)) {
      return NextResponse.json(
        { error: "Invalid tokenId format" },
        { status: 400 }
      );
    }

    // Use the correct Insight API format for NFT collection
    // Use the official NFTs endpoint
    let url = `https://${chainId}.insight.thirdweb.com/v1/nfts/${contractAddress}?limit=${limit}&page=${page}`;
    
    if (tokenId) {
      url = `https://${chainId}.insight.thirdweb.com/v1/nfts/${contractAddress}/${tokenId}`;
    }

    console.log("🔍 Fetching real NFTs from collection:", url);
    console.log("📊 Environment check:", {
      INSIGHT: INSIGHT ? "✅ Set" : "❌ Missing",
      CHAIN_ID: CHAIN_ID ? "✅ Set" : "❌ Missing", 
      NFT_COLLECTION: NFT_COLLECTION ? "✅ Set" : "❌ Missing"
    });

    const res = await fetch(url, {
      headers: { "x-client-id": INSIGHT },
      cache: "no-store",
    });

    if (!res.ok) {
      const errorText = await res.text();
      console.error("❌ Insight API error:", res.status, res.statusText);
      console.error("❌ Error response:", errorText);
      return NextResponse.json(
        { error: `Insight API error: ${res.status} ${res.statusText}`, details: errorText },
        { status: res.status }
      );
    }

    const data = await res.json();
    
    // Process the NFTs collections response
    const rawNfts = tokenId ? [data] : (data?.nfts || data?.data || []);
    
    // Map the response to our expected format
    const nfts = rawNfts.map((nft: any) => {
      // Convert IPFS URLs to HTTP URLs for Next.js Image component
      const convertIpfsUrl = (url: string) => {
        if (!url) return url;
        if (url.startsWith('ipfs://')) {
          const ipfsHash = url.replace('ipfs://', '');
          return `https://ipfs.io/ipfs/${ipfsHash}`;
        }
        return url;
      };

      const imageUrl = nft.image_url || nft.extra_metadata?.image_url;
      console.log("Original image URL:", imageUrl);
      console.log("Converted image URL:", convertIpfsUrl(imageUrl));

      return {
        tokenId: nft.token_id || nft.tokenId,
        metadata: {
          name: nft.name || nft.extra_metadata?.name,
          image: convertIpfsUrl(imageUrl),
          description: nft.description || nft.extra_metadata?.description,
          attributes: nft.extra_metadata?.attributes || []
        },
        owner: nft.owner,
        tokenURI: nft.metadata_url,
        collection: nft.collection,
        contract: nft.contract
      };
    });
    
    console.log("✅ Real NFT data returned:", {
      nftsCount: nfts.length,
      totalCount: data?.totalCount || data?.count || nfts.length,
      page: data?.page || page,
      sampleNft: nfts[0] // Log first NFT to see structure
    });

    return NextResponse.json({
      events: nfts,
      totalCount: data?.totalCount || data?.count || nfts.length,
      page: data?.page || page
    }, {
      headers: {
        "Cache-Control": "s-maxage=10, stale-while-revalidate=30",
        "X-Content-Type-Options": "nosniff",
        "X-Frame-Options": "DENY",
        "X-XSS-Protection": "1; mode=block",
        "Referrer-Policy": "strict-origin-when-cross-origin",
      },
    });
  } catch (error) {
    console.error("API error:", error);
    
    // Return specific error messages based on error type
    if (error instanceof TypeError && error.message.includes('fetch')) {
      return NextResponse.json(
        { error: "Network error: Unable to connect to Insight API" },
        { status: 503 }
      );
    }
    
    if (error instanceof Error) {
      return NextResponse.json(
        { error: `Server error: ${error.message}` },
        { status: 500 }
      );
    }
    
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
