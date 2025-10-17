// lib/indexed-data-service.ts
export interface MetadataIndex {
  version: string;
  createdAt: string;
  totalNFTs: number;
  totalChunks: number;
  chunkSize: number;
  lastChunkSize: number;
  nfts: Array<{
    tokenId: number;
    name: string;
    cardNumber: number;
    collectionNumber: number;
    edition: number;
    series: string;
    rarityScore: number;
    priceEth: number;
    isForSale: boolean;
    chunkIndex: number;
    localIndex: number;
    globalIndex: number;
    background?: string;
    skinTone?: string;
    shirt?: string;
    eyewear?: string;
    hair?: string;
    headwear?: string;
  }>;
  lookups: {
    byTokenId: Record<number, number>;
    byCardNumber: Record<number, number>;
    byRarityScore: Record<number, number[]>;
    byPrice: Record<number, number[]>;
    byTrait: {
      background: Record<string, number[]>;
      skinTone: Record<string, number[]>;
      shirt: Record<string, number[]>;
      eyewear: Record<string, number[]>;
      hair: Record<string, number[]>;
      headwear: Record<string, number[]>;
    };
  };
}

export interface ChunkedMetadataItem {
  name: string;
  description: string;
  token_id: number;
  card_number: number;
  collection_number: number;
  edition: number;
  series: string;
  rarity_score: number;
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
  attributes: Array<{
    trait_type: string;
    value: string;
  }>;
}

class IndexedDataService {
  private index: MetadataIndex | null = null;
  private loadedChunks: Map<number, ChunkedMetadataItem[]> = new Map();
  private loadingChunks: Set<number> = new Set();

  async getIndex(): Promise<MetadataIndex> {
    if (this.index) {
      return this.index;
    }

    try {
      const response = await fetch('/data/metadata-chunks/metadata-index.json');
      if (!response.ok) {
        throw new Error(`Failed to fetch metadata index: ${response.statusText}`);
      }
      this.index = await response.json();
      return this.index!;
    } catch (error) {
      console.error('Error fetching metadata index:', error);
      throw error;
    }
  }

  async loadChunk(chunkIndex: number): Promise<ChunkedMetadataItem[]> {
    // Return cached chunk if already loaded
    if (this.loadedChunks.has(chunkIndex)) {
      return this.loadedChunks.get(chunkIndex)!;
    }

    // Prevent duplicate loading
    if (this.loadingChunks.has(chunkIndex)) {
      return new Promise((resolve) => {
        const checkLoaded = () => {
          if (this.loadedChunks.has(chunkIndex)) {
            resolve(this.loadedChunks.get(chunkIndex)!);
          } else {
            setTimeout(checkLoaded, 100);
          }
        };
        checkLoaded();
      });
    }

    this.loadingChunks.add(chunkIndex);

    try {
      const response = await fetch(`/data/metadata-chunks/metadata-${chunkIndex}.json`);
      if (!response.ok) {
        throw new Error(`Failed to fetch chunk ${chunkIndex}: ${response.statusText}`);
      }
      
      const chunk = await response.json();
      this.loadedChunks.set(chunkIndex, chunk);
      this.loadingChunks.delete(chunkIndex);
      
      return chunk;
    } catch (error) {
      this.loadingChunks.delete(chunkIndex);
      console.error(`Error loading chunk ${chunkIndex}:`, error);
      throw error;
    }
  }

  // Fast search using index
  async searchByTokenId(tokenId: number): Promise<ChunkedMetadataItem | null> {
    const index = await this.getIndex();
    const nftIndex = index.lookups.byTokenId[tokenId];
    
    if (nftIndex === undefined) {
      return null;
    }

    const nftInfo = index.nfts[nftIndex];
    const chunk = await this.loadChunk(nftInfo.chunkIndex);
    return chunk[nftInfo.localIndex];
  }

  // Fast search by card number
  async searchByCardNumber(cardNumber: number): Promise<ChunkedMetadataItem | null> {
    const index = await this.getIndex();
    const nftIndex = index.lookups.byCardNumber[cardNumber];
    
    if (nftIndex === undefined) {
      return null;
    }

    const nftInfo = index.nfts[nftIndex];
    const chunk = await this.loadChunk(nftInfo.chunkIndex);
    return chunk[nftInfo.localIndex];
  }

  // Fast search by rarity range
  async searchByRarityRange(minRarity: number, maxRarity: number): Promise<ChunkedMetadataItem[]> {
    const index = await this.getIndex();
    const results: ChunkedMetadataItem[] = [];
    const processedChunks = new Set<number>();

    // Find all rarity ranges that overlap with our search range
    for (let range = Math.floor(minRarity / 100) * 100; range <= maxRarity; range += 100) {
      const nftIndices = index.lookups.byRarityScore[range] || [];
      
      for (const nftIndex of nftIndices) {
        const nftInfo = index.nfts[nftIndex];
        
        if (nftInfo.rarityScore >= minRarity && nftInfo.rarityScore <= maxRarity) {
          if (!processedChunks.has(nftInfo.chunkIndex)) {
            await this.loadChunk(nftInfo.chunkIndex);
            processedChunks.add(nftInfo.chunkIndex);
          }
          
          const chunk = this.loadedChunks.get(nftInfo.chunkIndex)!;
          results.push(chunk[nftInfo.localIndex]);
        }
      }
    }

    return results;
  }

  // Fast search by price range
  async searchByPriceRange(minPrice: number, maxPrice: number): Promise<ChunkedMetadataItem[]> {
    const index = await this.getIndex();
    const results: ChunkedMetadataItem[] = [];
    const processedChunks = new Set<number>();

    // Find all price ranges that overlap with our search range
    for (let range = Math.floor(minPrice / 0.1) * 0.1; range <= maxPrice; range += 0.1) {
      const nftIndices = index.lookups.byPrice[range] || [];
      
      for (const nftIndex of nftIndices) {
        const nftInfo = index.nfts[nftIndex];
        
        if (nftInfo.priceEth >= minPrice && nftInfo.priceEth <= maxPrice) {
          if (!processedChunks.has(nftInfo.chunkIndex)) {
            await this.loadChunk(nftInfo.chunkIndex);
            processedChunks.add(nftInfo.chunkIndex);
          }
          
          const chunk = this.loadedChunks.get(nftInfo.chunkIndex)!;
          results.push(chunk[nftInfo.localIndex]);
        }
      }
    }

    return results;
  }

  // Fast search by trait
  async searchByTrait(traitType: string, traitValue: string): Promise<ChunkedMetadataItem[]> {
    const index = await this.getIndex();
    const results: ChunkedMetadataItem[] = [];
    const processedChunks = new Set<number>();

    const nftIndices = index.lookups.byTrait[traitType as keyof typeof index.lookups.byTrait]?.[traitValue] || [];
    
    for (const nftIndex of nftIndices) {
      const nftInfo = index.nfts[nftIndex];
      
      if (!processedChunks.has(nftInfo.chunkIndex)) {
        await this.loadChunk(nftInfo.chunkIndex);
        processedChunks.add(nftInfo.chunkIndex);
      }
      
      const chunk = this.loadedChunks.get(nftInfo.chunkIndex)!;
      results.push(chunk[nftInfo.localIndex]);
    }

    return results;
  }

  // Get paginated data using index
  async getPaginatedMetadata(page: number, itemsPerPage: number): Promise<{
    data: ChunkedMetadataItem[];
    totalItems: number;
    totalPages: number;
    currentPage: number;
  }> {
    const index = await this.getIndex();
    const totalItems = index.totalNFTs;
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const startIndex = page * itemsPerPage;
    const endIndex = Math.min(startIndex + itemsPerPage, totalItems);
    
    const results: ChunkedMetadataItem[] = [];
    const processedChunks = new Set<number>();

    // Get NFT info for the requested range
    const nftInfos = index.nfts.slice(startIndex, endIndex);
    
    for (const nftInfo of nftInfos) {
      if (!processedChunks.has(nftInfo.chunkIndex)) {
        await this.loadChunk(nftInfo.chunkIndex);
        processedChunks.add(nftInfo.chunkIndex);
      }
      
      const chunk = this.loadedChunks.get(nftInfo.chunkIndex)!;
      results.push(chunk[nftInfo.localIndex]);
    }
    
    return {
      data: results,
      totalItems,
      totalPages,
      currentPage: page
    };
  }

  // Get all metadata (loads all chunks)
  async loadAllMetadata(): Promise<ChunkedMetadataItem[]> {
    const index = await this.getIndex();
    const allChunkIndices = Array.from({ length: index.totalChunks }, (_, i) => i);
    
    const loadPromises = allChunkIndices.map(index => this.loadChunk(index));
    const chunks = await Promise.all(loadPromises);
    return chunks.flat();
  }

  // Clear cache
  clearCache(): void {
    this.loadedChunks.clear();
    this.loadingChunks.clear();
  }

  // Get cache info
  getCacheInfo(): { loadedChunks: number[]; loadingChunks: number[] } {
    return {
      loadedChunks: Array.from(this.loadedChunks.keys()),
      loadingChunks: Array.from(this.loadingChunks)
    };
  }
}

// Export singleton instance
export const indexedDataService = new IndexedDataService();
