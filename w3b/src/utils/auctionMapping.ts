// src/utils/auctionMapping.ts

import fs from 'fs';
import path from 'path';

interface AuctionMapping {
  tokenId: number;
  listingId: number;
  endSec: number;
  bidCount: number;
  status: string;
}

let auctionMap: Map<number, AuctionMapping> | null = null;

export function loadAuctionMapping(): Map<number, AuctionMapping> {
  if (auctionMap) {
    return auctionMap;
  }

  try {
    const filePath = path.join(process.cwd(), 'docs', 'auction-map.json');
    const fileContent = fs.readFileSync(filePath, 'utf8');
    const mappings: AuctionMapping[] = JSON.parse(fileContent);
    
    auctionMap = new Map();
    mappings.forEach(mapping => {
      auctionMap!.set(mapping.tokenId, mapping);
    });
    
    console.log(`✅ Loaded ${mappings.length} auction mappings`);
    return auctionMap;
  } catch (error) {
    console.error('❌ Failed to load auction mapping:', error);
    return new Map();
  }
}

export function getListingId(tokenId: number): number | null {
  const mapping = loadAuctionMapping();
  return mapping.get(tokenId)?.listingId || null;
}

export function getAuctionData(tokenId: number): AuctionMapping | null {
  const mapping = loadAuctionMapping();
  return mapping.get(tokenId) || null;
}
