"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import NFTPagination from "@/components/ui/pagination";
import { useActiveAccount } from "thirdweb/react";
import NFTCard from "./nft-card";

// Utility to convert wei to ETH
function fromWei(wei: string | number | bigint): string {
  try {
    const value = BigInt(wei);
    const eth = Number(value) / 1e18;
    return eth.toLocaleString(undefined, { maximumFractionDigits: 6 });
  } catch {
    return "0";
  }
}

const FALLBACK_IMAGE = "/media/nfts/placeholder-nft.webp";
const METADATA_URL = "/data/token_pricing_mappings.json";
const IPFS_URLS_URL = "/data/ipfs_urls.json";

type NFTGridItem = {
  id: string;
  tokenId: string;
  name: string;
  image: string;
  priceWei: string | number | bigint;
  priceEth: number;
  rank: number | string;
  rarity: string;
  rarityPercent: string | number;
  isForSale: boolean;
  listingId: number;
  background?: string;
  skinTone?: string;
  shirt?: string;
  eyewear?: string;
  hair?: string;
  headwear?: string;
};

// Helper to extract attribute value from metadata
function getAttribute(meta: any, traitType: string) {
  return meta?.attributes?.find((attr: any) => attr.trait_type === traitType)?.value;
}

// Helper to get all unique values for a trait type from metadata
function getUniqueTraitValues(metadata: any[], traitType: string) {
  const values = new Set<string>();
  metadata.forEach((meta: any) => {
    const value = getAttribute(meta, traitType);
    if (value) values.add(value);
  });
  return Array.from(values).sort();
}

// After filtering, compute dynamic trait counts for every filterable option
function computeTraitCounts(nfts: NFTGridItem[], categories: string[]) {
  const counts: Record<string, Record<string, number>> = {};
  categories.forEach(category => {
    counts[category] = {};
    nfts.forEach(nft => {
      const value = (nft as any)[category];
      if (value) {
        if (!counts[category][value]) counts[category][value] = 0;
        counts[category][value]++;
      }
    });
  });
  return counts;
}

interface NFTGridProps {
  searchTerm: string;
  searchMode: "exact" | "contains";
  selectedFilters: any;
  onFilteredCountChange?: (count: number) => void;
  onTraitCountsChange?: (counts: Record<string, Record<string, number>>) => void;
}

// Set the total number of NFTs in your collection
const TOTAL_NFTS = 7777;

export default function NFTGrid({ searchTerm, searchMode, selectedFilters, onFilteredCountChange, onTraitCountsChange }: NFTGridProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(12);
  const [sortBy, setSortBy] = useState("default");
  const [nfts, setNfts] = useState<NFTGridItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [allMetadata, setAllMetadata] = useState<any[]>([]);
  const [imageUrlMap, setImageUrlMap] = useState<{ [tokenId: string]: string }>({});
  const [isMetadataLoaded, setIsMetadataLoaded] = useState(false);

  const account = useActiveAccount();

  useEffect(() => {
    // Load both metadata and IPFS URLs
    Promise.all([
      fetch(METADATA_URL).then(r => r.json()),
      fetch(IPFS_URLS_URL).then(r => r.json())
    ])
      .then(([metadataData, ipfsData]) => {
        // Use all metadata from token_pricing_mappings.json
        const allMetadataItems = metadataData || [];
        setAllMetadata(allMetadataItems);

        // Create image URL map from IPFS data
        const map: { [tokenId: string]: string } = {};
        ipfsData.forEach((item: any) => {
          if (item.TokenID !== undefined && item["Media URL"]) {
            map[item.TokenID.toString()] = item["Media URL"];
          }
        });
        
        // Fallback to placeholder for any missing images
        allMetadataItems.forEach((item: any) => {
          if (item.token_id !== undefined && !map[item.token_id.toString()]) {
            map[item.token_id.toString()] = FALLBACK_IMAGE;
          }
        });
        
        setImageUrlMap(map);
        setIsMetadataLoaded(true);
      })
      .catch((error) => {
        console.error("Error loading metadata:", error);
        setAllMetadata([]);
        setImageUrlMap({});
        setIsMetadataLoaded(true);
      });
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [itemsPerPage, searchTerm, selectedFilters]);

  // Load NFTs when essential data changes
  useEffect(() => {
    // Only load if we have all required data
    if (!isMetadataLoaded || !imageUrlMap || Object.keys(imageUrlMap).length === 0) {
      return;
    }

    setIsLoading(true);

    try {
      // Map ALL metadata for NFTs - show entire collection (7777 NFTs)
      const mappedNFTs: NFTGridItem[] = allMetadata
        .map((meta: any) => {
          const tokenId = meta.token_id?.toString() || "";
          
          // Use image URL from complete_metadata.json merged_data.media_url
          const imageUrl = imageUrlMap[tokenId] || FALLBACK_IMAGE;

          // Extract static content from token_pricing_mappings.json
          const name = meta.name || `Satoshe Slugger #${parseInt(tokenId) + 1}`;
          const rank = "—"; // Not available in this file
          const rarityPercent = "—"; // Not available in this file
          const rarity = meta.rarity_tier ?? "Unknown";
          
          // Extract pricing data from token_pricing_mappings.json
          const priceEth = meta.price_eth || 0;
          const listingId = 0; // No listing ID in this file
          const priceWei = (priceEth * 1e18).toString(); // Convert ETH to wei

          return {
            id: tokenId,
            tokenId,
            name,
            image: imageUrl,
            priceWei,
            priceEth,
            rank,
            rarity,
            rarityPercent,
            isForSale: priceEth > 0, // Only show as for sale if there's a price
            listingId,
            // Extract attribute values from metadata for filtering
            background: getAttribute(meta, "Background"),
            skinTone: getAttribute(meta, "Skin Tone"),
            shirt: getAttribute(meta, "Shirt"),
            eyewear: getAttribute(meta, "Eyewear"),
            hair: getAttribute(meta, "Hair"),
            headwear: getAttribute(meta, "Headwear"),
          };
        });
        
      setNfts(mappedNFTs);
      setIsLoading(false);
    } catch (error) {
      console.error("Error loading NFTs:", error);
      setNfts([]);
      setIsLoading(false);
    }
  }, [isMetadataLoaded, imageUrlMap, allMetadata]);

  // Before sorting and paginating, filter nfts:
  const filteredNFTs = nfts.filter(nft => {
    // Search by name or tokenId based on search mode
    let matchesSearch = false;
    
    if (searchMode === "exact") {
      // Exact mode: match exact token ID, NFT number, or exact name
      const nftNumber = (parseInt(nft.tokenId) + 1).toString(); // NFT number is token ID + 1
      matchesSearch = 
        nft.tokenId.toString() === searchTerm ||
        nftNumber === searchTerm ||
        nft.name.toLowerCase() === searchTerm.toLowerCase();
    } else {
      // Contains mode: match partial token ID or name (original behavior)
      matchesSearch =
        nft.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        nft.tokenId.toString().includes(searchTerm);
    }

    // Rarity filter
    const matchesRarity =
      !selectedFilters.rarity ||
      selectedFilters.rarity.length === 0 ||
      selectedFilters.rarity.includes(nft.rarity);

    // Background filter
    const matchesBackground =
      !selectedFilters.background ||
      selectedFilters.background.length === 0 ||
      selectedFilters.background.includes(nft.background);

    // Skin Tone filter
    const matchesSkinTone =
      !selectedFilters.skinTone ||
      selectedFilters.skinTone.length === 0 ||
      selectedFilters.skinTone.includes(nft.skinTone);

    // Shirt filter
    const matchesShirt =
      !selectedFilters.shirt ||
      selectedFilters.shirt.length === 0 ||
      selectedFilters.shirt.includes(nft.shirt);

    // Eyewear filter
    const matchesEyewear =
      !selectedFilters.eyewear ||
      selectedFilters.eyewear.length === 0 ||
      selectedFilters.eyewear.includes(nft.eyewear);

    // Hair filter (subcategory + color logic)
    const hairFilters = selectedFilters.hair || {};
    const hairSubcats = Object.keys(hairFilters);
    const matchesHair =
      hairSubcats.length === 0 ||
      hairSubcats.some(subcat => {
        const colors = hairFilters[subcat];
        const nftHair = nft.hair ? String(nft.hair) : "";
        if (!nftHair) return false;
        if (!colors || colors.length === 0) {
          // Match any variant of the subcategory (e.g., 'Ponytail ...')
          return nftHair.startsWith(subcat);
        } else {
          return (colors as string[]).some((color: string) => nftHair === `${subcat} ${color}`);
        }
      });

    // Headwear filter (subcategory + color logic)
    const headwearFilters = selectedFilters.headwear || {};
    const headwearSubcats = Object.keys(headwearFilters);
    const matchesHeadwear =
      headwearSubcats.length === 0 ||
      headwearSubcats.some(subcat => {
        const colors = headwearFilters[subcat];
        const nftHeadwear = nft.headwear ? String(nft.headwear) : "";
        if (!nftHeadwear) return false;
        if (!colors || colors.length === 0) {
          return nftHeadwear.startsWith(subcat);
        } else {
          return (colors as string[]).some((color: string) => nftHeadwear === `${subcat} ${color}`);
        }
      });

    return (
      matchesSearch &&
      matchesRarity &&
      matchesBackground &&
      matchesSkinTone &&
      matchesShirt &&
      matchesEyewear &&
      matchesHair &&
      matchesHeadwear
    );
  });

  // Then sort and paginate filteredNFTs
  const sortedNFTs = [...filteredNFTs].sort((a, b) => {
    switch (sortBy) {
      case "rank-asc":
        return Number(a.rank) - Number(b.rank);
      case "rank-desc":
        return Number(b.rank) - Number(a.rank);
      case "price-asc":
        return Number(a.priceWei) - Number(b.priceWei);
      case "price-desc":
        return Number(b.priceWei) - Number(a.priceWei);
      default:
        return 0;
    }
  });

  // Apply proper pagination to the sorted and filtered results
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = itemsPerPage === 100000 ? sortedNFTs.length : startIndex + itemsPerPage;
  const paginatedNFTs = sortedNFTs.slice(startIndex, endIndex);

  // Calculate total pages based on filtered results
  const totalFilteredPages = itemsPerPage === 100000
    ? 1 // When "View All" is selected, always show 1 page
    : Math.ceil(sortedNFTs.length / itemsPerPage) || 1;

  // Reset to page 1 if current page exceeds total pages
  useEffect(() => {
    if (currentPage > totalFilteredPages) {
      setCurrentPage(1);
    }
  }, [currentPage, totalFilteredPages]);

  // After filteredNFTs is computed:
  const traitCounts = useMemo(() => {
    return computeTraitCounts(filteredNFTs, ["background", "skinTone", "shirt", "eyewear", "hair", "headwear", "rarity"]);
  }, [filteredNFTs]);

  // Use refs to track previous values and prevent unnecessary updates
  const prevFilteredCountRef = useRef<number>(0);
  const prevTraitCountsRef = useRef<Record<string, Record<string, number>>>({});

  // Notify parent of filtered count changes
  useEffect(() => {
    if (onFilteredCountChange && filteredNFTs.length !== prevFilteredCountRef.current) {
      prevFilteredCountRef.current = filteredNFTs.length;
      onFilteredCountChange(filteredNFTs.length);
    }
  }, [filteredNFTs.length, onFilteredCountChange]);

  // Notify parent of trait counts changes
  useEffect(() => {
    if (onTraitCountsChange) {
      // Deep comparison to check if trait counts actually changed
      const traitCountsString = JSON.stringify(traitCounts);
      const prevTraitCountsString = JSON.stringify(prevTraitCountsRef.current);

      if (traitCountsString !== prevTraitCountsString) {
        prevTraitCountsRef.current = traitCounts;
        onTraitCountsChange(traitCounts);
      }
    }
  }, [traitCounts, onTraitCountsChange]);

  if (isLoading) {
    // Show pulsating placeholder NFTs while loading
    return (
      <div className="w-full max-w-full">
        <div className="mb-6">
          <div className="mb-4">
            <h2 className="text-lg font-medium text-off-white">NFT Collection</h2>
            <div className="text-sm font-medium text-brand-pink mt-1">Loading...</div>
          </div>
        </div>
        <div className="mt-8 mb-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6 justify-between">
          {Array.from({ length: 12 }).map((_, index) => (
            <div key={index} className="bg-neutral-800 rounded p-4 animate-pulse">
              <div className="aspect-square bg-neutral-700 rounded mb-3"></div>
              <div className="h-4 bg-neutral-700 rounded mb-2"></div>
              <div className="h-3 bg-neutral-700 rounded mb-1"></div>
              <div className="h-3 bg-neutral-700 rounded w-2/3"></div>
            </div>
          ))}
        </div>
        <NFTPagination
          currentPage={currentPage}
          totalPages={1}
          totalItems={0}
          itemsPerPage={itemsPerPage}
          onPageChange={setCurrentPage}
        />
      </div>
    );
  }

  return (
    <div className="w-full max-w-full">
      <div className="mb-6">
        <div className="mb-4">
              <h2 className="text-lg font-medium text-off-white">
                NFT Collection
              </h2>
          <div className="mt-1">
            <div className="text-xs font-medium" style={{ color: "#10b981" }}>
              {filteredNFTs.length} NFTs
            </div>
          </div>
        </div>
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
          <div></div>
          <div className="flex flex-col sm:flex-row gap-2 w-full lg:w-auto">
            <div className="flex items-center gap-2">
                  <span className="text-sm w-16 flex-shrink-0 sm:w-16 text-off-white">
                    Sort by:
                  </span>
              <Select
                value={sortBy}
                onValueChange={(value: string) => {
                  setSortBy(value);
                }}
              >
                <SelectTrigger className="w-[180px] h-9 text-sm rounded text-off-white">
                  <SelectValue placeholder="Default" />
                </SelectTrigger>
                <SelectContent className="text-sm rounded">
                  <SelectItem value="default">Default</SelectItem>
                  <SelectItem value="price-asc">Price: Low to High</SelectItem>
                  <SelectItem value="price-desc">Price: High to Low</SelectItem>
                  <SelectItem value="rank-asc">Rank: Low to High</SelectItem>
                  <SelectItem value="rank-desc">Rank: High to Low</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center gap-2">
                  <span className="text-sm w-12 flex-shrink-0 sm:w-12 text-off-white">
                    Show:
                  </span>
              <Select
                value={itemsPerPage.toString()}
                onValueChange={(val: string) => {
                  const newValue = Number.parseInt(val);
                  setItemsPerPage(newValue);
                }}
              >
                <SelectTrigger className="w-[110px] h-9 text-sm rounded text-off-white">
                  <SelectValue placeholder="12 items" />
                </SelectTrigger>
                <SelectContent className="text-sm rounded">
                  <SelectItem value="12">12 items</SelectItem>
                  <SelectItem value="25">25 items</SelectItem>
                  <SelectItem value="50">50 items</SelectItem>
                  <SelectItem value="100">100 items</SelectItem>
                  <SelectItem value="250">250 items</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </div>
      
      {/* Only render the grid if there are NFTs, otherwise show empty state */}
      {paginatedNFTs.length > 0 ? (
        <div className="mt-8 mb-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6 justify-between">
          {paginatedNFTs.map((nft) => {
            const priceFormatted = nft.priceEth > 0 ? `${nft.priceEth} ETH` : "--";

            return (
              <div key={nft.id}>
                <NFTCard
                  image={nft.image}
                  name={nft.name}
                  rank={nft.rank}
                  rarity={nft.rarity}
                  rarityPercent={nft.rarityPercent}
                  price={priceFormatted}
                  tokenId={nft.tokenId}
                  listingId={nft.listingId}
                  isForSale={nft.isForSale}
                />
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="text-lg mb-2 text-off-white">No NFTs found</div>
          <div className="text-neutral-500 text-sm">
            {searchTerm
              ? `No NFTs match "${searchTerm}"`
              : "Try adjusting your filters or check back later"}
          </div>
        </div>
      )}
      
      <NFTPagination
        key={`pagination-${filteredNFTs.length}`}
        currentPage={currentPage}
        totalPages={totalFilteredPages}
        totalItems={filteredNFTs.length}
        itemsPerPage={itemsPerPage}
        onPageChange={setCurrentPage}
      />
    </div>
  );
}

function displayPrice(val: string | number | bigint) {
  if (!val || val === "0") {
    return "--";
  }
  if ((typeof val === "string" && /^\d{12,}$/.test(val)) || typeof val === "bigint") {
    try {
      const eth = Number(BigInt(val)) / 1e18;
      if (eth > 10000) {
        return "--";
      }
      return eth + " ETH";
    } catch {
      return "--";
    }
  }
  if (typeof val === "number" && val < 1e6) {
    return val + " ETH";
  }
  if (typeof val === "string" && /^\d*\.?\d+$/.test(val)) {
    return val + " ETH";
  }
  return "--";
}
