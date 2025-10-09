import { THIRDWEB_CLIENT_ID } from "./thirdweb";

const INSIGHT_BASE_URL = "https://8453.insight.thirdweb.com/v1";
const MARKETPLACE_CONTRACT =
  process.env.NEXT_PUBLIC_MARKETPLACE_ADDRESS ?? "0xYourMarketplaceAddress";

// You may need to use the correct event signature as defined in your contract!
const NEW_BID_EVENT = "NewBid(uint256,uint256,address,uint256)";

export interface InsightBidEvent {
  transactionHash: string;
  blockNumber: number;
  logIndex: number;
  decoded: {
    auctionId: string;
    tokenId: string;
    bidder: string;
    bidAmount: string;
  };
}

// Fetches all NewBid events by user from past 30 days (limit 100)
export async function fetchUserBidEvents(
  userAddress: string,
): Promise<InsightBidEvent[]> {
  try {
    const THIRTY_DAYS_AGO = Math.floor(Date.now() / 1000) - 30 * 24 * 60 * 60;

    // Optionally, convert THIRTY_DAYS_AGO to a block number for highest accuracy
    // For now, use time filtering supported by Insight

    const query = new URLSearchParams({
      "filters[bidder]": userAddress.toLowerCase(),
      sort_order: "desc",
      limit: "100",
      date_from: new Date(THIRTY_DAYS_AGO * 1000)
        .toISOString()
        .slice(0, 19)
        .replace("T", " "),
    });

    const response = await fetch(
      `${INSIGHT_BASE_URL}/events/${MARKETPLACE_CONTRACT}/${NEW_BID_EVENT}?${query.toString()}`,
      {
        headers: {
          "x-client-id": THIRDWEB_CLIENT_ID!,
        },
      },
    );

    if (!response.ok) {
      throw new Error(`Insight API error: ${response.status}`);
    }

    const data = await response.json();
    // Official results should be in `data.events`
    return data.events ?? [];
  } catch (error) {
    console.error("Error fetching user bid events:", error);
    return [];
  }
}

// Group user bids by auctionId, keeping only their latest one per auction
export async function getCurrentWinningBids(userAddress: string) {
  const userBids = await fetchUserBidEvents(userAddress);
  if (userBids.length === 0) return [];

  const bidsByAuction = new Map<string, InsightBidEvent>();
  for (const bid of userBids) {
    const auctionId = bid.decoded.auctionId;
    const existingBid = bidsByAuction.get(auctionId);

    if (
      !existingBid ||
      bid.blockNumber > existingBid.blockNumber ||
      (bid.blockNumber === existingBid.blockNumber &&
        bid.logIndex > existingBid.logIndex)
    ) {
      bidsByAuction.set(auctionId, bid);
    }
  }

  // You might want to query the auction's current top bid/winner status from a batched on-chain fetch as well.
  return Array.from(bidsByAuction.values()).map((bid) => ({
    auctionId: bid.decoded.auctionId,
    tokenId: bid.decoded.tokenId,
    bidAmount: bid.decoded.bidAmount,
    transactionHash: bid.transactionHash,
    blockNumber: bid.blockNumber,
  }));
}
