export interface NFT {
  id: number
  token_id: number
  name: string
  image_url: string
  rarity_rank: number
  rarity_score: number
  floor_price: number
  last_sale_price: number
  last_sale_currency: string
  top_offer: number
  owner_address: string
  listed_at: string
  sha256_hash: string
  ipfs_hash: string
  initial_sequence_index: number
}

export interface Auction {
  auctionId: bigint
  tokenId: bigint
  quantity: bigint
  minimumBidAmount: bigint
  buyoutBidAmount: bigint
  timeBufferInSeconds: bigint
  bidBufferBps: bigint
  startTimestamp: bigint
  endTimestamp: bigint
  auctionCreator: string
  assetContract: string
  currency: string
  tokenType: string
  status: number // 0: inactive, 1: active, 2: ended, 3: cancelled
}

export interface Bid {
  id: number
  auction_id: number
  bidder_address: string
  bid_amount: number
  bid_time: string
}

export type ViewMode = "grid-large" | "grid-medium" | "grid-small" | "list-compact" | "list-detailed"

export interface ProvenanceRecord {
  initial_sequence_index: number
  assigned_token_id: number
  sha256_hash: string
  ipfs_hash: string
}

export interface NFTCardData {
  tokenId: string;
  name: string;
  image: string;
  rarity: string;
  rank: number;
  rarityPercent: number;
  minBid: string;
  buyNow: string;
  isLive: boolean;
  isSold: boolean;
  isEnded: boolean;
  auction?: Auction;
}