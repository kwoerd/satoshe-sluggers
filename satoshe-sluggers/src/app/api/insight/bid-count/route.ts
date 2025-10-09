import { NextRequest, NextResponse } from "next/server";

const API_KEY = process.env.NEXT_PUBLIC_THIRDWEB_CLIENT_ID!;
const BASE_CHAIN_ID = "8453";

// Count BidPlaced and BidCancelled for a given contract/tokenId
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const contract = searchParams.get('contract');
    const tokenId = searchParams.get('tokenId');

    if (!contract || !tokenId) {
      return NextResponse.json({ error: 'Missing contract or tokenId' }, { status: 400 });
    }

        // Count NewBid events for this auction
        const resp = await fetch(
          `https://${BASE_CHAIN_ID}.insight.thirdweb.com/v1/events/${contract}/NewBid(address,address,uint256,tuple)?aggregate=count()&filters[auctionId]=${tokenId}`,
          { headers: { "x-client-id": API_KEY } }
        );
        
        if (!resp.ok) {
          throw new Error(`API request failed: ${resp.status} ${resp.statusText}`);
        }
        
        const contentType = resp.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) {
          const text = await resp.text();
          console.error('Expected JSON but got:', contentType, text.substring(0, 200));
          throw new Error('API returned non-JSON response');
        }
        
        const placed = await resp.json();

        // Response: total number of bids
        const count = placed?.aggregations?.[0]?.count || 0;
    
    return NextResponse.json({ count });
  } catch (error) {
    console.error('Error fetching bid count:', error);
    return NextResponse.json({ error: 'Failed to fetch bid count' }, { status: 500 });
  }
}
