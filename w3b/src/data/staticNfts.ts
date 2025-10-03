// src/data/staticNfts.ts
// Curated sample of NFTs for fast loading and demo purposes

export interface StaticNFT {
  tokenId: string;
  listingId: number | null;
  metadata: {
    name: string;
    image: string;
    description: string;
    attributes: Array<{
      trait_type: string;
      value: string;
      occurrence?: number;
      rarity?: number;
    }>;
  };
  auction: {
    listingId: number;
    endTime: number;
    bidCount: number;
    status: string;
    timeRemaining: number;
    timeRemainingFormatted: string;
    minBid: string;
    buyoutPrice: string;
    rank: number;
    rarity: string;
    tier: string;
  } | null;
}

// Sample NFTs representing different tiers and rarities
export const STATIC_NFTS: StaticNFT[] = [
  {
    tokenId: "0",
    listingId: 7782,
    metadata: {
      name: "Satoshe Slugger #1",
      image: "https://ipfs.io/ipfs/QmYourImageHash1",
      description: "Women's Baseball Card",
      attributes: [
        { trait_type: "Background", value: "Light Blue", occurrence: 843, rarity: 10.84 },
        { trait_type: "Skin Tone", value: "Fair", occurrence: 1205, rarity: 15.49 },
        { trait_type: "Hair", value: "Blonde", occurrence: 892, rarity: 11.46 }
      ]
    },
    auction: {
      listingId: 7782,
      endTime: 1760383970,
      bidCount: 0,
      status: "active",
      timeRemaining: 2000000,
      timeRemainingFormatted: "23d 8h 18m",
      minBid: "0.00777",
      buyoutPrice: "0.015",
      rank: 7272,
      rarity: "93.506%",
      tier: "Ground Ball"
    }
  },
  {
    tokenId: "1",
    listingId: 7,
    metadata: {
      name: "Satoshe Slugger #2",
      image: "https://ipfs.io/ipfs/QmYourImageHash2",
      description: "Women's Baseball Card",
      attributes: [
        { trait_type: "Background", value: "Dark Blue", occurrence: 234, rarity: 3.01 },
        { trait_type: "Skin Tone", value: "Medium", occurrence: 567, rarity: 7.28 },
        { trait_type: "Hair", value: "Brunette", occurrence: 1203, rarity: 15.47 }
      ]
    },
    auction: {
      listingId: 7,
      endTime: 1761529423,
      bidCount: 2,
      status: "active",
      timeRemaining: 2100000,
      timeRemainingFormatted: "24d 5h 30m",
      minBid: "0.025",
      buyoutPrice: "0.05",
      rank: 1234,
      rarity: "15.87%",
      tier: "Base Hit"
    }
  },
  {
    tokenId: "5",
    listingId: 12,
    metadata: {
      name: "Satoshe Slugger #6",
      image: "https://ipfs.io/ipfs/QmYourImageHash3",
      description: "Women's Baseball Card",
      attributes: [
        { trait_type: "Background", value: "Red", occurrence: 89, rarity: 1.14 },
        { trait_type: "Skin Tone", value: "Dark", occurrence: 234, rarity: 3.01 },
        { trait_type: "Hair", value: "Black", occurrence: 456, rarity: 5.86 }
      ]
    },
    auction: {
      listingId: 12,
      endTime: 1762000000,
      bidCount: 5,
      status: "active",
      timeRemaining: 2500000,
      timeRemainingFormatted: "28d 22h 45m",
      minBid: "0.5",
      buyoutPrice: "1",
      rank: 89,
      rarity: "1.14%",
      tier: "Triple"
    }
  },
  {
    tokenId: "9",
    listingId: 15,
    metadata: {
      name: "Satoshe Slugger #10",
      image: "https://ipfs.io/ipfs/QmYourImageHash4",
      description: "Women's Baseball Card",
      attributes: [
        { trait_type: "Background", value: "Gold", occurrence: 23, rarity: 0.30 },
        { trait_type: "Skin Tone", value: "Fair", occurrence: 1205, rarity: 15.49 },
        { trait_type: "Hair", value: "Red", occurrence: 67, rarity: 0.86 }
      ]
    },
    auction: {
      listingId: 15,
      endTime: 1762500000,
      bidCount: 12,
      status: "active",
      timeRemaining: 3000000,
      timeRemainingFormatted: "34d 17h 20m",
      minBid: "2",
      buyoutPrice: "3",
      rank: 23,
      rarity: "0.30%",
      tier: "Home Run"
    }
  },
  {
    tokenId: "11",
    listingId: 18,
    metadata: {
      name: "Satoshe Slugger #12",
      image: "https://ipfs.io/ipfs/QmYourImageHash5",
      description: "Women's Baseball Card",
      attributes: [
        { trait_type: "Background", value: "Purple", occurrence: 45, rarity: 0.58 },
        { trait_type: "Skin Tone", value: "Medium", occurrence: 567, rarity: 7.28 },
        { trait_type: "Hair", value: "Blonde", occurrence: 892, rarity: 11.46 }
      ]
    },
    auction: {
      listingId: 18,
      endTime: 1763000000,
      bidCount: 8,
      status: "active",
      timeRemaining: 3500000,
      timeRemainingFormatted: "40d 12h 15m",
      minBid: "0.1",
      buyoutPrice: "0.25",
      rank: 456,
      rarity: "5.86%",
      tier: "Stand-Up Double"
    }
  },
  {
    tokenId: "120",
    listingId: 25,
    metadata: {
      name: "Satoshe Slugger #121",
      image: "https://ipfs.io/ipfs/QmYourImageHash6",
      description: "Women's Baseball Card",
      attributes: [
        { trait_type: "Background", value: "Green", occurrence: 156, rarity: 2.00 },
        { trait_type: "Skin Tone", value: "Dark", occurrence: 234, rarity: 3.01 },
        { trait_type: "Hair", value: "Brunette", occurrence: 1203, rarity: 15.47 }
      ]
    },
    auction: {
      listingId: 25,
      endTime: 1763500000,
      bidCount: 3,
      status: "active",
      timeRemaining: 4000000,
      timeRemainingFormatted: "46d 7h 30m",
      minBid: "0.25",
      buyoutPrice: "0.5",
      rank: 156,
      rarity: "2.00%",
      tier: "Line Drive"
    }
  },
  {
    tokenId: "634",
    listingId: 30,
    metadata: {
      name: "Satoshe Slugger #635",
      image: "https://ipfs.io/ipfs/QmYourImageHash7",
      description: "Women's Baseball Card",
      attributes: [
        { trait_type: "Background", value: "Silver", occurrence: 12, rarity: 0.15 },
        { trait_type: "Skin Tone", value: "Fair", occurrence: 1205, rarity: 15.49 },
        { trait_type: "Hair", value: "Black", occurrence: 456, rarity: 5.86 }
      ]
    },
    auction: {
      listingId: 30,
      endTime: 1764000000,
      bidCount: 15,
      status: "active",
      timeRemaining: 4500000,
      timeRemainingFormatted: "52d 2h 45m",
      minBid: "4.5",
      buyoutPrice: "6.75",
      rank: 12,
      rarity: "0.15%",
      tier: "Walk-Off Home Run"
    }
  },
  {
    tokenId: "7776",
    listingId: 35,
    metadata: {
      name: "Satoshe Slugger #7777",
      image: "https://ipfs.io/ipfs/QmYourImageHash8",
      description: "Women's Baseball Card - Final Edition",
      attributes: [
        { trait_type: "Background", value: "Diamond", occurrence: 1, rarity: 0.01 },
        { trait_type: "Skin Tone", value: "Perfect", occurrence: 1, rarity: 0.01 },
        { trait_type: "Hair", value: "Legendary", occurrence: 1, rarity: 0.01 }
      ]
    },
    auction: {
      listingId: 35,
      endTime: 1764500000,
      bidCount: 25,
      status: "active",
      timeRemaining: 5000000,
      timeRemainingFormatted: "57d 20h 0m",
      minBid: "6.75",
      buyoutPrice: "10",
      rank: 1,
      rarity: "0.01%",
      tier: "Grand Slam"
    }
  }
];

// Collection stats for static mode
export const STATIC_COLLECTION_STATS = {
  name: "Satoshe Sluggers",
  description: "Women's Baseball Card Collection",
  total_supply: 7777,
  unique_owner_count: 0,
  floor_price: 0.00777,
  volume: 0,
  edition: 1,
  rarity_tiers: 12
};
