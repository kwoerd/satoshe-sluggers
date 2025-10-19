// lib/simple-data-service.ts
// Simplified data service - single source of truth for all NFT data

export interface NFTData {
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
    occurrence?: number;
    rarity?: number;
    percentage?: number;
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

// Cache for metadata
let metadataCache: NFTData[] | null = null;

// Load all metadata once and cache it
export async function loadAllNFTs(): Promise<NFTData[]> {
  if (metadataCache) {
    return metadataCache;
  }

  try {
    console.log('Loading metadata from /data/complete_metadata.json');
    const response = await fetch('/data/complete_metadata.json');
    if (!response.ok) {
      throw new Error(`Failed to load metadata: ${response.statusText}`);
    }
    const data = await response.json();
    console.log('Metadata loaded, first item:', data[0]);
    metadataCache = data as NFTData[];
    console.log(`Cached ${metadataCache.length} NFTs`);
    return metadataCache;
  } catch (error) {
    console.error('Error loading metadata:', error);
    return [];
  }
}

// Get NFT by token ID
export async function getNFTByTokenId(tokenId: number): Promise<NFTData | null> {
  console.log(`Loading NFT data for token ID: ${tokenId}`);
  const allNFTs = await loadAllNFTs();
  console.log(`Total NFTs loaded: ${allNFTs.length}`);
  const foundNFT = allNFTs.find(nft => nft.token_id === tokenId);
  console.log(`Found NFT:`, foundNFT ? 'Yes' : 'No');
  if (foundNFT) {
    console.log(`NFT attributes:`, foundNFT.attributes);
  }
  return foundNFT || null;
}

// Get NFTs with pagination
export async function getNFTs(page: number = 1, limit: number = 50): Promise<{
  nfts: NFTData[];
  total: number;
  page: number;
  totalPages: number;
}> {
  const allNFTs = await loadAllNFTs();
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  
  return {
    nfts: allNFTs.slice(startIndex, endIndex),
    total: allNFTs.length,
    page,
    totalPages: Math.ceil(allNFTs.length / limit)
  };
}

// Search NFTs
export async function searchNFTs(query: string, mode: "exact" | "contains" = "contains"): Promise<NFTData[]> {
  const allNFTs = await loadAllNFTs();
  
  if (!query.trim()) {
    return allNFTs;
  }

  return allNFTs.filter(nft => {
    const searchText = `${nft.name} ${nft.description} ${nft.series}`.toLowerCase();
    const searchQuery = query.toLowerCase();
    
    if (mode === "exact") {
      return searchText === searchQuery;
    } else {
      return searchText.includes(searchQuery);
    }
  });
}

// Filter NFTs by traits
export async function filterNFTs(filters: {
  rarity?: string[];
  background?: string[];
  skinTone?: string[];
  shirt?: string[];
  hair?: Record<string, string[]>;
  eyewear?: string[];
  headwear?: Record<string, string[]>;
}): Promise<NFTData[]> {
  const allNFTs = await loadAllNFTs();
  
  return allNFTs.filter(nft => {
    // Rarity filter
    if (filters.rarity && filters.rarity.length > 0) {
      const rarityTier = nft.rarity_tier.replace(" (Ultra-Legendary)", "");
      if (!filters.rarity.includes(rarityTier)) {
        return false;
      }
    }

    // Attribute filters
    for (const [traitType, values] of Object.entries(filters)) {
      if (traitType === 'rarity' || !values || values.length === 0) continue;
      
      const attribute = nft.attributes.find(attr => 
        attr.trait_type.toLowerCase() === traitType.toLowerCase()
      );
      
      if (!attribute) return false;
      
      if (traitType === 'hair' || traitType === 'headwear') {
        // Handle subcategories
        const subcategoryValues = values as Record<string, string[]>;
        const hasMatch = Object.entries(subcategoryValues).some(([subcat, colors]) => {
          return attribute.value.includes(subcat) && colors.some(color => attribute.value.includes(color));
        });
        if (!hasMatch) return false;
      } else {
        // Handle simple attributes
        const simpleValues = values as string[];
        if (!simpleValues.includes(attribute.value)) {
          return false;
        }
      }
    }

    return true;
  });
}

// Get trait counts for sidebar
export function getTraitCounts(nfts: NFTData[]): Record<string, Record<string, number>> {
  const counts: Record<string, Record<string, number>> = {};

  nfts.forEach(nft => {
    nft.attributes.forEach(attr => {
      const traitType = attr.trait_type.toLowerCase();
      
      if (!counts[traitType]) {
        counts[traitType] = {};
      }
      
      // Handle subcategories (hair, headwear)
      if (traitType === 'hair' || traitType === 'headwear') {
        const parts = attr.value.split(' ');
        if (parts.length >= 2) {
          const subcategory = parts[0];
          const color = parts[1];
          const fullValue = `${subcategory} ${color}`;
          
          counts[traitType][fullValue] = (counts[traitType][fullValue] || 0) + 1;
        }
      } else {
        // Handle simple attributes
        counts[traitType][attr.value] = (counts[traitType][attr.value] || 0) + 1;
      }
    });
  });

  return counts;
}

// Clear cache (useful for development)
export function clearCache(): void {
  metadataCache = null;
}
