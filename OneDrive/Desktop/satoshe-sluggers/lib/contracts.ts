// lib/contracts.ts - Smart Contract Configuration
import { getContract } from "thirdweb";
import { base } from "thirdweb/chains";
import { client } from "./thirdweb";

// NFT Collection Contract (ERC-721 Drop)
export const nftCollection = getContract({
  address: process.env.NEXT_PUBLIC_NFT_COLLECTION_ADDRESS!,
  chain: base,
  client,
});

// Marketplace Contract (v3 with Direct Listings)
export const marketplace = getContract({
  address: process.env.NEXT_PUBLIC_MARKETPLACE_ADDRESS!,
  chain: base,
  client,
  abi: [
    // Basic marketplace ABI for direct listings
    {
      "inputs": [
        {"internalType": "uint256", "name": "_listingId", "type": "uint256"},
        {"internalType": "address", "name": "_buyFor", "type": "address"},
        {"internalType": "uint256", "name": "_quantityToBuy", "type": "uint256"},
        {"internalType": "address", "name": "_currency", "type": "address"},
        {"internalType": "uint256", "name": "_totalPrice", "type": "uint256"}
      ],
      "name": "buyFromListing",
      "outputs": [],
      "stateMutability": "payable",
      "type": "function"
    }
  ]
});

// Collection configuration
export const MAX_NFTS = 3000; // Temporary limit while uploads complete
export const TOTAL_COLLECTION_SIZE = 7777; // Full collection size

// RPC Rate Limiting Configuration
export const RPC_RATE_LIMIT = 225; // Max 225 calls/second (safe buffer under 250 limit)

// Validate required environment variables
if (!process.env.NEXT_PUBLIC_NFT_COLLECTION_ADDRESS) {
  throw new Error(
    "❌ Missing NEXT_PUBLIC_NFT_COLLECTION_ADDRESS environment variable"
  );
}

if (!process.env.NEXT_PUBLIC_MARKETPLACE_ADDRESS) {
  throw new Error(
    "❌ Missing NEXT_PUBLIC_MARKETPLACE_ADDRESS environment variable"
  );
}

