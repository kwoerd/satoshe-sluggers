// Lightweight data service using complete metadata as single source of truth
export interface CompleteNFTData {
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
  attributes: Array<{
    trait_type: string;
    value: string;
    occurrence: number;
    rarity: number;
  }>;
  artist: string;
  platform: string;
  compiler: string;
  copyright: string;
  date: number;
  merged_data: {
    nft: number;
    token_id: number;
    listing_id: number;
    metadata_cid: string;
    media_cid: string;
    metadata_url: string;
    media_url: string;
    price_eth: number;
  };
}

// Cache for the complete metadata
let completeMetadataCache: CompleteNFTData[] | null = null;

// Load complete metadata once and cache it
export async function loadCompleteMetadata(): Promise<CompleteNFTData[]> {
  if (completeMetadataCache) {
    return completeMetadataCache;
  }

  try {
    const response = await fetch('/data/complete_metadata.json');
    completeMetadataCache = await response.json();
    return completeMetadataCache;
  } catch (error) {
    console.error('Error loading complete metadata:', error);
    return [];
  }
}

// Get NFT by token ID
export async function getNFTByTokenId(tokenId: string): Promise<CompleteNFTData | null> {
  const metadata = await loadCompleteMetadata();
  return metadata.find(nft => nft.token_id.toString() === tokenId) || null;
}

// Get all NFTs with pagination
export async function getAllNFTs(page: number = 1, limit: number = 20): Promise<{
  nfts: CompleteNFTData[];
  total: number;
  hasMore: boolean;
}> {
  const metadata = await loadCompleteMetadata();
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  
  return {
    nfts: metadata.slice(startIndex, endIndex),
    total: metadata.length,
    hasMore: endIndex < metadata.length
  };
}

// Search NFTs by name or attributes
export async function searchNFTs(query: string, filters: Record<string, string[]> = {}): Promise<CompleteNFTData[]> {
  const metadata = await loadCompleteMetadata();
  
  let results = metadata;
  
  // Text search
  if (query) {
    const searchTerm = query.toLowerCase();
    results = results.filter(nft => 
      nft.name.toLowerCase().includes(searchTerm) ||
      nft.description.toLowerCase().includes(searchTerm) ||
      nft.rarity_tier.toLowerCase().includes(searchTerm)
    );
  }
  
  // Filter by attributes
  Object.entries(filters).forEach(([traitType, values]) => {
    if (values.length > 0) {
      results = results.filter(nft => {
        const attribute = nft.attributes.find(attr => attr.trait_type === traitType);
        return attribute && values.includes(attribute.value);
      });
    }
  });
  
  return results;
}

// Get trait counts for filtering
export async function getTraitCounts(): Promise<Record<string, Record<string, number>>> {
  const metadata = await loadCompleteMetadata();
  const counts: Record<string, Record<string, number>> = {};
  
  metadata.forEach(nft => {
    nft.attributes.forEach(attr => {
      if (!counts[attr.trait_type]) {
        counts[attr.trait_type] = {};
      }
      counts[attr.trait_type][attr.value] = (counts[attr.trait_type][attr.value] || 0) + 1;
    });
  });
  
  return counts;
}

// Get rarity tiers with counts
export async function getRarityTiers(): Promise<Array<{tier: string; count: number; color: string}>> {
  const metadata = await loadCompleteMetadata();
  const tierCounts: Record<string, number> = {};
  
  metadata.forEach(nft => {
    tierCounts[nft.rarity_tier] = (tierCounts[nft.rarity_tier] || 0) + 1;
  });
  
  const colorMap: Record<string, string> = {
    'Ground Ball': 'text-neutral-400',
    'Single': 'text-green-400',
    'Double': 'text-blue-400',
    'Triple': 'text-purple-400',
    'Home Run': 'text-orange-400',
    'Grand Slam': 'text-red-400',
    'Walk-Off Home Run': 'text-yellow-400',
    'Grand Slam (Ultra-Legendary)': 'text-pink-400'
  };
  
  return Object.entries(tierCounts).map(([tier, count]) => ({
    tier,
    count,
    color: colorMap[tier] || 'text-neutral-400'
  }));
}

// Convert to legacy format for compatibility
export function convertToLegacyFormat(nft: CompleteNFTData) {
  return {
    id: nft.token_id.toString(),
    tokenId: nft.token_id.toString(),
    name: nft.name,
    image: nft.merged_data.media_url,
    rank: nft.rank,
    rarity: nft.rarity_tier,
    rarityPercent: nft.rarity_percent,
    price: nft.merged_data.price_eth,
    priceWei: (nft.merged_data.price_eth * 1e18).toString(),
    isForSale: nft.merged_data.price_eth > 0,
    attributes: nft.attributes,
    description: nft.description,
    artist: nft.artist,
    platform: nft.platform,
    series: nft.series,
    rarityScore: nft.rarity_score
  };
}
