// lib/contracts.ts
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
  // Using the official Thirdweb marketplace ABI
  abi: [
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
    },
    {
      "inputs": [
        {"internalType": "uint256", "name": "_listingId", "type": "uint256"}
      ],
      "name": "getListing",
      "outputs": [
        {
          "components": [
            {"internalType": "uint256", "name": "listingId", "type": "uint256"},
            {"internalType": "address", "name": "tokenOwner", "type": "address"},
            {"internalType": "address", "name": "assetContract", "type": "address"},
            {"internalType": "uint256", "name": "tokenId", "type": "uint256"},
            {"internalType": "uint256", "name": "startTime", "type": "uint256"},
            {"internalType": "uint256", "name": "endTime", "type": "uint256"},
            {"internalType": "uint256", "name": "quantity", "type": "uint256"},
            {"internalType": "address", "name": "currency", "type": "address"},
            {"internalType": "uint256", "name": "reservePricePerToken", "type": "uint256"},
            {"internalType": "uint256", "name": "buyoutPricePerToken", "type": "uint256"},
            {"internalType": "uint8", "name": "tokenType", "type": "uint8"},
            {"internalType": "uint8", "name": "listingType", "type": "uint8"},
            {"internalType": "bool", "name": "reserved", "type": "bool"}
          ],
          "internalType": "struct IMarketplace.Listing",
          "name": "listing",
          "type": "tuple"
        }
      ],
      "stateMutability": "view",
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

