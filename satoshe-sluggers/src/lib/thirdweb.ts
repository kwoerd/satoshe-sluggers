// src/lib/thirdweb.ts
import { getContract } from "thirdweb";
import { base, ethereum } from "thirdweb/chains";
import { createThirdwebClient } from "thirdweb";
import { format } from "date-fns";

// 1) Load your env values (use placeholders only in dev)
const isDev = process.env.NODE_ENV === "development";

export const THIRDWEB_CLIENT_ID =
  process.env.NEXT_PUBLIC_THIRDWEB_CLIENT_ID ||
  (isDev ? "your-dev-client-id" : undefined);

// 2) In prod, fail fast if they're missing
if (!isDev && !THIRDWEB_CLIENT_ID) {
  throw new Error(
    "❌ Missing required Thirdweb env var: NEXT_PUBLIC_THIRDWEB_CLIENT_ID"
  );
}

// 3) Initialize Thirdweb client
export const client = createThirdwebClient({
  clientId: THIRDWEB_CLIENT_ID!,
});

// 4) Supported chains with proper configuration
export const supportedChains = [base, ethereum];

// 5) Your contract addresses (pulled from env or hard-coded fallbacks from README)
export const NFT_CONTRACT_ADDRESS =
  process.env.NEXT_PUBLIC_NFT_COLLECTION_ADDRESS || "0xYourNFTCollectionAddress";

export const MARKETPLACE_CONTRACT_ADDRESS =
  process.env.NEXT_PUBLIC_MARKETPLACE_ADDRESS || "0xYourMarketplaceAddress";

if (!NFT_CONTRACT_ADDRESS || NFT_CONTRACT_ADDRESS === "0xYourDefaultNFTContractAddress") {
  throw new Error("❌ NFT_CONTRACT_ADDRESS is missing or invalid. Set NEXT_PUBLIC_NFT_COLLECTION_ADDRESS in your .env file.");
}
if (!MARKETPLACE_CONTRACT_ADDRESS || MARKETPLACE_CONTRACT_ADDRESS === "0xYourDefaultMarketplaceAddress") {
  throw new Error("❌ MARKETPLACE_ADDRESS is missing or invalid. Set NEXT_PUBLIC_MARKETPLACE_ADDRESS in your .env file.");
}

// All contract read/write should be done in components using useReadContract/useSendTransaction.
// This file only exports contract instances and utility functions.
