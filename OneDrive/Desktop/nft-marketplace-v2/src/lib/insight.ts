// nft-marketplace/src/lib/insight.ts
const BASE = process.env.INSIGHT_BASE_URL || "https://insight.thirdweb.com";
const CLIENT_ID = process.env.NEXT_PUBLIC_INSIGHT_CLIENT_ID!;
const CHAIN_ID = process.env.NEXT_PUBLIC_CHAIN_ID || "8453";
const MARKETPLACE = process.env.NEXT_PUBLIC_MARKETPLACE_ADDRESS!;
const COLLECTION = process.env.NEXT_PUBLIC_NFT_COLLECTION_ADDRESS!;

export const insight = {
  englishAuctionsUrl: (count = 1000, start = 0) =>
    `${BASE}/marketplace/${CHAIN_ID}/${MARKETPLACE}/english-auctions?client_id=${CLIENT_ID}&decoded=true&count=${count}&start=${start}`,

  nftsUrl: (limit: number, page: number) =>
    `${BASE}/v1/nfts/${COLLECTION}?chain_id=${CHAIN_ID}&limit=${limit}&page=${page}&include_owners=false&resolve_metadata_links=true`,

  ownedUrl: (owner: string) =>
    `${BASE}/v1/nfts?contract_address=${COLLECTION}&owner_address=${owner}&chain_id=${CHAIN_ID}&resolve_metadata_links=true`,
};
