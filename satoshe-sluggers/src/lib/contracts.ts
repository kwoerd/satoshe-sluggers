import { getContract } from "thirdweb";
import { client } from "./thirdweb";
import { base } from "thirdweb/chains";

export const nftCollection = getContract({
  client,
  address: process.env.NEXT_PUBLIC_NFT_COLLECTION_ADDRESS!,
  chain: base,
});

export const marketplace = getContract({
  client,
  address: process.env.NEXT_PUBLIC_MARKETPLACE_ADDRESS!,
  chain: base,
});