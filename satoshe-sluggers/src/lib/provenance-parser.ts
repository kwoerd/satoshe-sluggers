// Provenance Data Parser for Satoshe Sluggers Collection
// Loads real provenance data from /public/provenance/ files

export interface ProvenanceRecord {
  initial_sequence_index: number;
  assigned_token_id: number;
  sha256_hash: string;
  ipfs_hash: string;
}

export interface ProvenanceData {
  merkleRoot: string | null;
  finalProofHash: string | null;
  concatenatedHashString: string | null;
  provenanceRecords: ProvenanceRecord[];
  isLoading: boolean;
  error: string | null;
}

class ProvenanceParser {
  private cache: Map<string, any> = new Map();
  private loadingPromises: Map<string, Promise<any>> = new Map();

  // Load a single file with caching and error handling
  private async loadFile<T>(filename: string, parser: (content: string) => T): Promise<T> {
    // Return cached data if available
    if (this.cache.has(filename)) {
      return this.cache.get(filename);
    }

    // Return existing promise if already loading
    if (this.loadingPromises.has(filename)) {
      return this.loadingPromises.get(filename);
    }

    // Create new loading promise
    const promise = this.loadFileInternal(filename, parser);
    this.loadingPromises.set(filename, promise);

    try {
      const result = await promise;
      this.cache.set(filename, result);
      return result;
    } finally {
      this.loadingPromises.delete(filename);
    }
  }

  private async loadFileInternal<T>(filename: string, parser: (content: string) => T): Promise<T> {
    try {
      const response = await fetch(`/provenance/${filename}`);
      if (!response.ok) {
        throw new Error(`Failed to load ${filename}: ${response.status} ${response.statusText}`);
      }
      const content = await response.text();
      return parser(content);
    } catch (error) {
      console.error(`Error loading ${filename}:`, error);
      throw error;
    }
  }

  // Load merkle root
  async loadMerkleRoot(): Promise<string> {
    return this.loadFile('merkle_root.txt', (content) => content.trim());
  }

  // Load final proof hash
  async loadFinalProofHash(): Promise<string> {
    return this.loadFile('final_proof_hash.txt', (content) => content.trim());
  }

  // Load concatenated hash string (large file - lazy load)
  async loadConcatenatedHashString(): Promise<string> {
    return this.loadFile('sha256_concatenated.txt', (content) => content.trim());
  }

  // Load NFT URLs and parse into provenance records
  async loadProvenanceRecords(): Promise<ProvenanceRecord[]> {
    return this.loadFile('nft_urls.json', (content) => {
      try {
        const data = JSON.parse(content);
        // Convert the nft_urls.json structure to ProvenanceRecord format
        // This assumes the JSON has a structure with token IDs and metadata
        const records: ProvenanceRecord[] = [];
        
        // Parse the structure - this will need to be adjusted based on actual file format
        if (Array.isArray(data)) {
          data.forEach((item: any, index: number) => {
            records.push({
              initial_sequence_index: index,
              assigned_token_id: item.tokenId || index,
              sha256_hash: item.sha256_hash || item.sha256Hash || '',
              ipfs_hash: item.ipfs_hash || item.ipfsHash || item.cid || '',
            });
          });
        } else if (typeof data === 'object') {
          // Handle object structure
          Object.entries(data).forEach(([key, value]: [string, any], index: number) => {
            records.push({
              initial_sequence_index: index,
              assigned_token_id: parseInt(key) || index,
              sha256_hash: value.sha256_hash || value.sha256Hash || '',
              ipfs_hash: value.ipfs_hash || value.ipfsHash || value.cid || '',
            });
          });
        }
        
        return records;
      } catch (error) {
        console.error('Error parsing nft_urls.json:', error);
        return [];
      }
    });
  }

  // Load all provenance data
  async loadAllProvenanceData(): Promise<ProvenanceData> {
    try {
      const [merkleRoot, finalProofHash, concatenatedHashString, provenanceRecords] = await Promise.all([
        this.loadMerkleRoot(),
        this.loadFinalProofHash(),
        this.loadConcatenatedHashString(),
        this.loadProvenanceRecords(),
      ]);

      return {
        merkleRoot,
        finalProofHash,
        concatenatedHashString,
        provenanceRecords,
        isLoading: false,
        error: null,
      };
    } catch (error) {
      console.error('Error loading provenance data:', error);
      return {
        merkleRoot: null,
        finalProofHash: null,
        concatenatedHashString: null,
        provenanceRecords: [],
        isLoading: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  // Clear cache (useful for development)
  clearCache(): void {
    this.cache.clear();
    this.loadingPromises.clear();
  }
}

// Export singleton instance
export const provenanceParser = new ProvenanceParser();

// Export individual loading functions for lazy loading
export const loadMerkleRoot = () => provenanceParser.loadMerkleRoot();
export const loadFinalProofHash = () => provenanceParser.loadFinalProofHash();
export const loadConcatenatedHashString = () => provenanceParser.loadConcatenatedHashString();
export const loadProvenanceRecords = () => provenanceParser.loadProvenanceRecords();
export const loadAllProvenanceData = () => provenanceParser.loadAllProvenanceData();
