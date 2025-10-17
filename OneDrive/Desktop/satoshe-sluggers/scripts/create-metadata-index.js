// scripts/create-metadata-index.js
const fs = require('fs');
const path = require('path');

const CHUNKS_DIR = 'public/data/metadata-chunks';
const OUTPUT_DIR = 'public/data/metadata-chunks';

async function createMetadataIndex() {
  try {
    console.log('📖 Reading metadata chunks to create index...');

    // Read metadata info
    const infoPath = path.join(CHUNKS_DIR, 'metadata-info.json');
    const info = JSON.parse(fs.readFileSync(infoPath, 'utf8'));

    const index = {
      version: '1.0.0',
      createdAt: new Date().toISOString(),
      totalNFTs: info.totalNFTs,
      totalChunks: info.totalChunks,
      chunkSize: info.chunkSize,
      lastChunkSize: info.lastChunkSize,
      nfts: []
    };

    // Process each chunk to create index entries
    for (let i = 0; i < info.totalChunks; i++) {
      const chunkPath = path.join(CHUNKS_DIR, `metadata-${i}.json`);
      
      if (!fs.existsSync(chunkPath)) {
        console.warn(`⚠️  Chunk ${i} not found, skipping...`);
        continue;
      }

      console.log(`📊 Processing chunk ${i}...`);
      const chunkData = JSON.parse(fs.readFileSync(chunkPath, 'utf8'));
      
      chunkData.forEach((nft, localIndex) => {
        const globalIndex = (i * info.chunkSize) + localIndex;
        
        index.nfts.push({
          tokenId: nft.token_id,
          name: nft.name,
          cardNumber: nft.card_number,
          collectionNumber: nft.collection_number,
          edition: nft.edition,
          series: nft.series,
          rarityScore: nft.rarity_score,
          priceEth: nft.merged_data?.price_eth || 0,
          isForSale: (nft.merged_data?.price_eth || 0) > 0,
          chunkIndex: i,
          localIndex: localIndex,
          globalIndex: globalIndex,
          // Quick access to key attributes
          background: nft.attributes?.find(attr => attr.trait_type === 'Background')?.value,
          skinTone: nft.attributes?.find(attr => attr.trait_type === 'Skin Tone')?.value,
          shirt: nft.attributes?.find(attr => attr.trait_type === 'Shirt')?.value,
          eyewear: nft.attributes?.find(attr => attr.trait_type === 'Eyewear')?.value,
          hair: nft.attributes?.find(attr => attr.trait_type === 'Hair')?.value,
          headwear: nft.attributes?.find(attr => attr.trait_type === 'Headwear')?.value,
        });
      });
    }

    // Sort by token ID for fast lookups
    index.nfts.sort((a, b) => a.tokenId - b.tokenId);

    // Create lookup maps for performance
    index.lookups = {
      byTokenId: {},
      byCardNumber: {},
      byRarityScore: {},
      byPrice: {},
      byTrait: {
        background: {},
        skinTone: {},
        shirt: {},
        eyewear: {},
        hair: {},
        headwear: {}
      }
    };

    // Build lookup maps
    index.nfts.forEach((nft, nftIndex) => {
      // Token ID lookup
      index.lookups.byTokenId[nft.tokenId] = nftIndex;
      
      // Card number lookup
      if (nft.cardNumber) {
        index.lookups.byCardNumber[nft.cardNumber] = nftIndex;
      }
      
      // Rarity score lookup (grouped by ranges)
      const rarityRange = Math.floor(nft.rarityScore / 100) * 100;
      if (!index.lookups.byRarityScore[rarityRange]) {
        index.lookups.byRarityScore[rarityRange] = [];
      }
      index.lookups.byRarityScore[rarityRange].push(nftIndex);
      
      // Price lookup (grouped by ranges)
      const priceRange = Math.floor(nft.priceEth / 0.1) * 0.1;
      if (!index.lookups.byPrice[priceRange]) {
        index.lookups.byPrice[priceRange] = [];
      }
      index.lookups.byPrice[priceRange].push(nftIndex);
      
      // Trait lookups
      ['background', 'skinTone', 'shirt', 'eyewear', 'hair', 'headwear'].forEach(trait => {
        const value = nft[trait];
        if (value) {
          if (!index.lookups.byTrait[trait][value]) {
            index.lookups.byTrait[trait][value] = [];
          }
          index.lookups.byTrait[trait][value].push(nftIndex);
        }
      });
    });

    // Write index file
    const indexPath = path.join(OUTPUT_DIR, 'metadata-index.json');
    fs.writeFileSync(indexPath, JSON.stringify(index, null, 2));

    console.log('✅ Created metadata-index.json');
    console.log(`📊 Index contains ${index.nfts.length} NFT entries`);
    console.log(`📁 File size: ${(fs.statSync(indexPath).size / 1024 / 1024).toFixed(2)}MB`);
    console.log(`🎯 Lookup maps created for fast searching`);

  } catch (error) {
    console.error('❌ Error creating metadata index:', error);
    process.exit(1);
  }
}

createMetadataIndex();
