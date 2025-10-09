// lib/nft-utils.ts
import { NFT_COLLECTION_ADDRESS, MARKETPLACE_ADDRESS } from "../lib/constants";
import { getContract } from "thirdweb";
import { base } from "thirdweb/chains";
import { client } from "../lib/thirdweb";

// Define types based on your metadata structure
export interface NFTAttribute {
  trait_type: string;
  value: string;
  occurrence: number;
  rarity: number;
}

export interface NFTMetadata {
  name: string;
  description: string;
  token_id: number;
  card_number: number;
  collection_number: number;
  edition: number;
  series: string;
  rarity_score: number;
  rank: number;
  rarity_percent: number;
  rarity_tier: string;
  attributes: NFTAttribute[];
  image?: string;
}

export interface NFTURLData {
  tokenId: number;
  "Metadata URL": string;
  "Media Image URL": string;
}

// Function to load NFT URLs from the JSON file
export async function loadNFTUrls(): Promise<NFTURLData[]> {
  try {
    const response = await fetch('/docs/nft_urls.json');
    if (!response.ok) {
      throw new Error('Failed to load NFT URLs');
    }
    return response.json();
  } catch (error) {
    console.error('Error loading NFT URLs:', error);
    return [];
  }
}

// Function to load NFT metadata from the JSON file
export async function loadNFTMetadata(): Promise<NFTMetadata[]> {
  try {
    const response = await fetch('/docs/combined_metadata.json');
    if (!response.ok) {
      throw new Error('Failed to load NFT metadata');
    }
    return response.json();
  } catch (error) {
    console.error('Error loading NFT metadata:', error);
    return [];
  }
}

// Function to get NFT contract
export function getNFTContract() {
  return getContract({
    client,
    address: NFT_COLLECTION_ADDRESS,
    chain: base,
  });
}

// Function to get marketplace contract
export function getMarketplaceContract() {
  return getContract({
    client,
    address: MARKETPLACE_ADDRESS,
    chain: base,
  });
}

// Function to get NFT image URL by token ID
export async function getNFTImageUrl(tokenId: number): Promise<string> {
  try {
    const urls = await loadNFTUrls();
    const nftUrl = urls.find(url => url.tokenId === tokenId);
    return nftUrl ? nftUrl["Media Image URL"] : '/placeholder-nft.webp';
  } catch (error) {
    console.error('Error getting NFT image URL:', error);
    return '/placeholder-nft.webp';
  }
}

// Function to get NFT metadata by token ID
export async function getNFTMetadataById(tokenId: number): Promise<NFTMetadata | null> {
  try {
    const metadata = await loadNFTMetadata();
    return metadata.find(nft => nft.token_id === tokenId) || null;
  } catch (error) {
    console.error('Error getting NFT metadata:', error);
    return null;
  }
}