// lib/chunked-data-service.ts
export interface MetadataInfo {
  totalNFTs: number;
  totalChunks: number;
  chunkSize: number;
  lastChunkSize: number;
  createdAt: string;
  version: string;
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

class ChunkedDataService {
  private metadataInfo: MetadataInfo | null = null;
  private loadedChunks: Map<number, ChunkedMetadataItem[]> = new Map();
  private loadingChunks: Set<number> = new Set();

  async getMetadataInfo(): Promise<MetadataInfo> {
    if (this.metadataInfo) {
      return this.metadataInfo;
    }

    try {
      const response = await fetch('/data/metadata-chunks/metadata-info.json');
      if (!response.ok) {
        throw new Error(`Failed to fetch metadata info: ${response.statusText}`);
      }
      const info = await response.json();
      this.metadataInfo = info;
      return info;
    } catch (error) {
      console.error('Error fetching metadata info:', error);
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
      // Wait for the ongoing load to complete
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

  async loadChunks(chunkIndices: number[]): Promise<ChunkedMetadataItem[]> {
    const loadPromises = chunkIndices.map(index => this.loadChunk(index));
    const chunks = await Promise.all(loadPromises);
    return chunks.flat();
  }

  async loadAllMetadata(): Promise<ChunkedMetadataItem[]> {
    const info = await this.getMetadataInfo();
    const allChunkIndices = Array.from({ length: info.totalChunks }, (_, i) => i);
    return this.loadChunks(allChunkIndices);
  }

  async loadMetadataRange(startIndex: number, endIndex: number): Promise<ChunkedMetadataItem[]> {
    const info = await this.getMetadataInfo();
    const startChunk = Math.floor(startIndex / info.chunkSize);
    const endChunk = Math.floor((endIndex - 1) / info.chunkSize);
    
    const chunkIndices = Array.from({ length: endChunk - startChunk + 1 }, (_, i) => startChunk + i);
    const allData = await this.loadChunks(chunkIndices);
    
    // Slice to get the exact range
    const startOffset = startIndex % info.chunkSize;
    
    return allData.slice(startOffset, startOffset + (endIndex - startIndex));
  }

  // Get paginated data
  async getPaginatedMetadata(page: number, itemsPerPage: number): Promise<{
    data: ChunkedMetadataItem[];
    totalItems: number;
    totalPages: number;
    currentPage: number;
  }> {
    const info = await this.getMetadataInfo();
    const totalItems = info.totalNFTs;
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const startIndex = page * itemsPerPage;
    const endIndex = Math.min(startIndex + itemsPerPage, totalItems);
    
    const data = await this.loadMetadataRange(startIndex, endIndex);
    
    return {
      data,
      totalItems,
      totalPages,
      currentPage: page
    };
  }

  // Search within loaded chunks
  searchLoadedMetadata(query: string, searchMode: 'exact' | 'contains' = 'contains'): ChunkedMetadataItem[] {
    const allLoadedData: ChunkedMetadataItem[] = [];
    this.loadedChunks.forEach(chunk => {
      allLoadedData.push(...chunk);
    });

    if (!query.trim()) {
      return allLoadedData;
    }

    const searchTerm = query.toLowerCase();
    return allLoadedData.filter(item => {
      const name = item.name.toLowerCase();
      const description = item.description.toLowerCase();
      
      if (searchMode === 'exact') {
        return name === searchTerm || description === searchTerm;
      } else {
        return name.includes(searchTerm) || description.includes(searchTerm);
      }
    });
  }

  // Clear cache to free memory
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
export const chunkedDataService = new ChunkedDataService();
