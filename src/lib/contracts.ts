import { defineChain } from "thirdweb/chains";
import { getContract } from "thirdweb";
import { client } from "./thirdweb";

// Define the Base chain
export const base = defineChain({
  id: 8453,
  name: "Base",
  rpc: process.env.NEXT_PUBLIC_RPC_URL || "https://8453.rpc.thirdweb.com",
});

// Contract addresses from environment variables
const NFT_COLLECTION_ADDRESS = process.env.NEXT_PUBLIC_NFT_COLLECTION_ADDRESS!;
const MARKETPLACE_ADDRESS = process.env.NEXT_PUBLIC_MARKETPLACE_ADDRESS!;

// Create contract instances
export const nftCollection = getContract({
  client,
  chain: base,
  address: NFT_COLLECTION_ADDRESS,
});

export const marketplace = getContract({
  client,
  chain: base,
  address: MARKETPLACE_ADDRESS,
});
