// Test data service for the 10 test NFTs with real marketplace listings
export interface TestNFTData {
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
  image: string;
  listing_id: number;
  price_eth: number;
}

// Test NFTs with real listing IDs from marketplace contract 0xCEf0B3219c6C3e9e79FcF30071FfDC731F1cc7c2
const testNFTs: TestNFTData[] = [
  {
    name: "TEST - Satoshe Slugger #1",
    description: "Women's Baseball Card",
    token_id: 0,
    card_number: 1,
    collection_number: 11,
    edition: 1,
    series: "Round the Bases Series",
    rarity_score: 0.766,
    rank: 7272,
    rarity_percent: 93.506,
    rarity_tier: "Ground Ball",
    attributes: [
      {
        trait_type: "Background",
        value: "Light Blue",
        occurrence: 843,
        rarity: 10.84
      },
      {
        trait_type: "Skin Tone",
        value: "Darkest",
        occurrence: 1267,
        rarity: 16.292
      },
      {
        trait_type: "Shirt",
        value: "Red",
        occurrence: 1134,
        rarity: 14.581
      },
      {
        trait_type: "Hair",
        value: "Ponytail Black",
        occurrence: 206,
        rarity: 2.649
      },
      {
        trait_type: "Eyewear",
        value: "Eyeblack",
        occurrence: 6358,
        rarity: 81.754
      },
      {
        trait_type: "Headwear",
        value: "Batters Helmet Black",
        occurrence: 506,
        rarity: 6.506
      }
    ],
    artist: "Kristen Woerdeman",
    platform: "Retinal Delights",
    compiler: "HashLips Art Engine",
    copyright: "2025 © Retinal Delights, Inc.",
    date: 1739243562369,
    image: "/test-nfts/placeholder-nft-0.webp",
    listing_id: 7812,
    price_eth: 0.00001
  },
  {
    name: "TEST - Satoshe Slugger #2",
    description: "Women's Baseball Card",
    token_id: 1,
    card_number: 2,
    collection_number: 12,
    edition: 1,
    series: "Round the Bases Series",
    rarity_score: 0.8,
    rank: 7000,
    rarity_percent: 90.0,
    rarity_tier: "Ground Ball",
    attributes: [
      {
        trait_type: "Background",
        value: "Dark Blue",
        occurrence: 500,
        rarity: 6.4
      },
      {
        trait_type: "Skin Tone",
        value: "Medium",
        occurrence: 2000,
        rarity: 25.7
      },
      {
        trait_type: "Shirt",
        value: "Blue",
        occurrence: 800,
        rarity: 10.3
      },
      {
        trait_type: "Hair",
        value: "Short Brown",
        occurrence: 300,
        rarity: 3.9
      },
      {
        trait_type: "Eyewear",
        value: "None",
        occurrence: 1000,
        rarity: 12.9
      },
      {
        trait_type: "Headwear",
        value: "Cap Red",
        occurrence: 400,
        rarity: 5.1
      }
    ],
    artist: "Kristen Woerdeman",
    platform: "Retinal Delights",
    compiler: "HashLips Art Engine",
    copyright: "2025 © Retinal Delights, Inc.",
    date: 1739243562369,
    image: "/test-nfts/placeholder-nft-1.webp",
    listing_id: 7813,
    price_eth: 0.000001
  },
  {
    name: "TEST - Satoshe Slugger #3",
    description: "Women's Baseball Card",
    token_id: 2,
    card_number: 3,
    collection_number: 13,
    edition: 1,
    series: "Round the Bases Series",
    rarity_score: 0.9,
    rank: 5000,
    rarity_percent: 64.3,
    rarity_tier: "Single",
    attributes: [
      {
        trait_type: "Background",
        value: "Green",
        occurrence: 300,
        rarity: 3.9
      },
      {
        trait_type: "Skin Tone",
        value: "Light",
        occurrence: 1500,
        rarity: 19.3
      },
      {
        trait_type: "Shirt",
        value: "White",
        occurrence: 2000,
        rarity: 25.7
      },
      {
        trait_type: "Hair",
        value: "Long Blonde",
        occurrence: 150,
        rarity: 1.9
      },
      {
        trait_type: "Eyewear",
        value: "Sunglasses",
        occurrence: 200,
        rarity: 2.6
      },
      {
        trait_type: "Headwear",
        value: "Visor",
        occurrence: 100,
        rarity: 1.3
      }
    ],
    artist: "Kristen Woerdeman",
    platform: "Retinal Delights",
    compiler: "HashLips Art Engine",
    copyright: "2025 © Retinal Delights, Inc.",
    date: 1739243562369,
    image: "/test-nfts/placeholder-nft-2.webp",
    listing_id: 7814,
    price_eth: 0.000001
  },
  {
    name: "TEST - Satoshe Slugger #4",
    description: "Women's Baseball Card",
    token_id: 3,
    card_number: 4,
    collection_number: 14,
    edition: 1,
    series: "Round the Bases Series",
    rarity_score: 0.95,
    rank: 3000,
    rarity_percent: 38.6,
    rarity_tier: "Double",
    attributes: [
      {
        trait_type: "Background",
        value: "Purple",
        occurrence: 200,
        rarity: 2.6
      },
      {
        trait_type: "Skin Tone",
        value: "Medium Dark",
        occurrence: 800,
        rarity: 10.3
      },
      {
        trait_type: "Shirt",
        value: "Purple",
        occurrence: 150,
        rarity: 1.9
      },
      {
        trait_type: "Hair",
        value: "Curly Red",
        occurrence: 80,
        rarity: 1.0
      },
      {
        trait_type: "Eyewear",
        value: "Glasses",
        occurrence: 120,
        rarity: 1.5
      },
      {
        trait_type: "Headwear",
        value: "Helmet Purple",
        occurrence: 60,
        rarity: 0.8
      }
    ],
    artist: "Kristen Woerdeman",
    platform: "Retinal Delights",
    compiler: "HashLips Art Engine",
    copyright: "2025 © Retinal Delights, Inc.",
    date: 1739243562369,
    image: "/test-nfts/placeholder-nft-3.webp",
    listing_id: 7815,
    price_eth: 0.000001
  },
  {
    name: "TEST - Satoshe Slugger #5",
    description: "Women's Baseball Card",
    token_id: 4,
    card_number: 5,
    collection_number: 15,
    edition: 1,
    series: "Round the Bases Series",
    rarity_score: 0.98,
    rank: 1500,
    rarity_percent: 19.3,
    rarity_tier: "Triple",
    attributes: [
      {
        trait_type: "Background",
        value: "Gold",
        occurrence: 100,
        rarity: 1.3
      },
      {
        trait_type: "Skin Tone",
        value: "Darkest",
        occurrence: 500,
        rarity: 6.4
      },
      {
        trait_type: "Shirt",
        value: "Gold",
        occurrence: 80,
        rarity: 1.0
      },
      {
        trait_type: "Hair",
        value: "Afro",
        occurrence: 50,
        rarity: 0.6
      },
      {
        trait_type: "Eyewear",
        value: "None",
        occurrence: 2000,
        rarity: 25.7
      },
      {
        trait_type: "Headwear",
        value: "Crown",
        occurrence: 25,
        rarity: 0.3
      }
    ],
    artist: "Kristen Woerdeman",
    platform: "Retinal Delights",
    compiler: "HashLips Art Engine",
    copyright: "2025 © Retinal Delights, Inc.",
    date: 1739243562369,
    image: "/test-nfts/placeholder-nft-4.webp",
    listing_id: 7816,
    price_eth: 0.000001
  },
  {
    name: "TEST - Satoshe Slugger #6",
    description: "Women's Baseball Card",
    token_id: 5,
    card_number: 6,
    collection_number: 16,
    edition: 1,
    series: "Round the Bases Series",
    rarity_score: 0.99,
    rank: 500,
    rarity_percent: 6.4,
    rarity_tier: "Home Run",
    attributes: [
      {
        trait_type: "Background",
        value: "Rainbow",
        occurrence: 50,
        rarity: 0.6
      },
      {
        trait_type: "Skin Tone",
        value: "Medium Light",
        occurrence: 1000,
        rarity: 12.9
      },
      {
        trait_type: "Shirt",
        value: "Rainbow",
        occurrence: 30,
        rarity: 0.4
      },
      {
        trait_type: "Hair",
        value: "Rainbow",
        occurrence: 20,
        rarity: 0.3
      },
      {
        trait_type: "Eyewear",
        value: "Rainbow Glasses",
        occurrence: 15,
        rarity: 0.2
      },
      {
        trait_type: "Headwear",
        value: "Rainbow Helmet",
        occurrence: 10,
        rarity: 0.1
      }
    ],
    artist: "Kristen Woerdeman",
    platform: "Retinal Delights",
    compiler: "HashLips Art Engine",
    copyright: "2025 © Retinal Delights, Inc.",
    date: 1739243562369,
    image: "/test-nfts/placeholder-nft-5.webp",
    listing_id: 7817,
    price_eth: 0.000001
  },
  {
    name: "TEST - Satoshe Slugger #7",
    description: "Women's Baseball Card",
    token_id: 6,
    card_number: 7,
    collection_number: 17,
    edition: 1,
    series: "Round the Bases Series",
    rarity_score: 0.995,
    rank: 200,
    rarity_percent: 2.6,
    rarity_tier: "Grand Slam",
    attributes: [
      {
        trait_type: "Background",
        value: "Diamond",
        occurrence: 25,
        rarity: 0.3
      },
      {
        trait_type: "Skin Tone",
        value: "Medium",
        occurrence: 2000,
        rarity: 25.7
      },
      {
        trait_type: "Shirt",
        value: "Diamond",
        occurrence: 15,
        rarity: 0.2
      },
      {
        trait_type: "Hair",
        value: "Diamond",
        occurrence: 10,
        rarity: 0.1
      },
      {
        trait_type: "Eyewear",
        value: "Diamond Glasses",
        occurrence: 8,
        rarity: 0.1
      },
      {
        trait_type: "Headwear",
        value: "Diamond Crown",
        occurrence: 5,
        rarity: 0.1
      }
    ],
    artist: "Kristen Woerdeman",
    platform: "Retinal Delights",
    compiler: "HashLips Art Engine",
    copyright: "2025 © Retinal Delights, Inc.",
    date: 1739243562369,
    image: "/test-nfts/placeholder-nft-6.webp",
    listing_id: 7818,
    price_eth: 0.000001
  },
  {
    name: "TEST - Satoshe Slugger #8",
    description: "Women's Baseball Card",
    token_id: 7,
    card_number: 8,
    collection_number: 18,
    edition: 1,
    series: "Round the Bases Series",
    rarity_score: 0.998,
    rank: 100,
    rarity_percent: 1.3,
    rarity_tier: "Walk-Off Home Run",
    attributes: [
      {
        trait_type: "Background",
        value: "Galaxy",
        occurrence: 10,
        rarity: 0.1
      },
      {
        trait_type: "Skin Tone",
        value: "Light",
        occurrence: 1500,
        rarity: 19.3
      },
      {
        trait_type: "Shirt",
        value: "Galaxy",
        occurrence: 5,
        rarity: 0.1
      },
      {
        trait_type: "Hair",
        value: "Galaxy",
        occurrence: 3,
        rarity: 0.0
      },
      {
        trait_type: "Eyewear",
        value: "Galaxy Glasses",
        occurrence: 2,
        rarity: 0.0
      },
      {
        trait_type: "Headwear",
        value: "Galaxy Crown",
        occurrence: 1,
        rarity: 0.0
      }
    ],
    artist: "Kristen Woerdeman",
    platform: "Retinal Delights",
    compiler: "HashLips Art Engine",
    copyright: "2025 © Retinal Delights, Inc.",
    date: 1739243562369,
    image: "/test-nfts/placeholder-nft-7.webp",
    listing_id: 7819,
    price_eth: 0.000001
  },
  {
    name: "TEST - Satoshe Slugger #9",
    description: "Women's Baseball Card",
    token_id: 8,
    card_number: 9,
    collection_number: 19,
    edition: 1,
    series: "Round the Bases Series",
    rarity_score: 0.999,
    rank: 50,
    rarity_percent: 0.6,
    rarity_tier: "Grand Slam (Ultra-Legendary)",
    attributes: [
      {
        trait_type: "Background",
        value: "Universe",
        occurrence: 5,
        rarity: 0.1
      },
      {
        trait_type: "Skin Tone",
        value: "Medium Dark",
        occurrence: 800,
        rarity: 10.3
      },
      {
        trait_type: "Shirt",
        value: "Universe",
        occurrence: 2,
        rarity: 0.0
      },
      {
        trait_type: "Hair",
        value: "Universe",
        occurrence: 1,
        rarity: 0.0
      },
      {
        trait_type: "Eyewear",
        value: "Universe Glasses",
        occurrence: 1,
        rarity: 0.0
      },
      {
        trait_type: "Headwear",
        value: "Universe Crown",
        occurrence: 1,
        rarity: 0.0
      }
    ],
    artist: "Kristen Woerdeman",
    platform: "Retinal Delights",
    compiler: "HashLips Art Engine",
    copyright: "2025 © Retinal Delights, Inc.",
    date: 1739243562369,
    image: "/test-nfts/placeholder-nft-8.webp",
    listing_id: 7820,
    price_eth: 0.000001
  },
  {
    name: "TEST - Satoshe Slugger #10",
    description: "Women's Baseball Card",
    token_id: 9,
    card_number: 10,
    collection_number: 20,
    edition: 1,
    series: "Round the Bases Series",
    rarity_score: 1.0,
    rank: 1,
    rarity_percent: 0.0,
    rarity_tier: "Grand Slam (Ultra-Legendary)",
    attributes: [
      {
        trait_type: "Background",
        value: "Legendary",
        occurrence: 1,
        rarity: 0.0
      },
      {
        trait_type: "Skin Tone",
        value: "Perfect",
        occurrence: 1,
        rarity: 0.0
      },
      {
        trait_type: "Shirt",
        value: "Legendary",
        occurrence: 1,
        rarity: 0.0
      },
      {
        trait_type: "Hair",
        value: "Legendary",
        occurrence: 1,
        rarity: 0.0
      },
      {
        trait_type: "Eyewear",
        value: "Legendary Glasses",
        occurrence: 1,
        rarity: 0.0
      },
      {
        trait_type: "Headwear",
        value: "Legendary Crown",
        occurrence: 1,
        rarity: 0.0
      }
    ],
    artist: "Kristen Woerdeman",
    platform: "Retinal Delights",
    compiler: "HashLips Art Engine",
    copyright: "2025 © Retinal Delights, Inc.",
    date: 1739243562369,
    image: "/test-nfts/placeholder-nft-9.webp",
    listing_id: 7821,
    price_eth: 0.000001
  }
];

// Get all test NFTs
export function getAllTestNFTs(): TestNFTData[] {
  return testNFTs;
}

// Get test NFT by token ID
export function getTestNFTByTokenId(tokenId: string): TestNFTData | null {
  return testNFTs.find(nft => nft.token_id.toString() === tokenId) || null;
}

// Get test NFT by listing ID
export function getTestNFTByListingId(listingId: number): TestNFTData | null {
  return testNFTs.find(nft => nft.listing_id === listingId) || null;
}

// Search test NFTs
export function searchTestNFTs(query: string, filters: Record<string, string[]> = {}): TestNFTData[] {
  let results = testNFTs;
  
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

// Get trait counts for test NFTs
export function getTestTraitCounts(): Record<string, Record<string, number>> {
  const counts: Record<string, Record<string, number>> = {};
  
  testNFTs.forEach(nft => {
    nft.attributes.forEach(attr => {
      if (!counts[attr.trait_type]) {
        counts[attr.trait_type] = {};
      }
      counts[attr.trait_type][attr.value] = (counts[attr.trait_type][attr.value] || 0) + 1;
    });
  });
  
  return counts;
}

// Convert test NFT to legacy format for compatibility
export function convertTestNFTToLegacyFormat(nft: TestNFTData) {
  return {
    id: nft.token_id.toString(),
    tokenId: nft.token_id.toString(),
    listingId: nft.listing_id,
    name: nft.name,
    image: nft.image,
    rank: nft.rank,
    rarity: nft.rarity_tier,
    rarityPercent: nft.rarity_percent,
    price: nft.price_eth,
    priceWei: (nft.price_eth * 1e18).toString(),
    isForSale: nft.price_eth > 0,
    attributes: nft.attributes,
    description: nft.description,
    artist: nft.artist,
    platform: nft.platform,
    series: nft.series,
    rarityScore: nft.rarity_score
  };
}
