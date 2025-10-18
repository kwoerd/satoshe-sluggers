// scripts/combine-metadata.js
const fs = require('fs');
const path = require('path');

const CHUNKS_DIR = 'public/data/metadata-chunks';
const OUTPUT_FILE = 'public/data/complete_metadata.json';

async function combineMetadata() {
  try {
    console.log('📖 Reading metadata chunks to create complete file...');

    // Read metadata info
    const infoPath = path.join(CHUNKS_DIR, 'metadata-info.json');
    const info = JSON.parse(fs.readFileSync(infoPath, 'utf8'));

    console.log(`📊 Found ${info.totalNFTs} NFTs in ${info.totalChunks} chunks`);

    const allNFTs = [];

    // Combine all chunks
    for (let i = 0; i < info.totalChunks; i++) {
      const chunkPath = path.join(CHUNKS_DIR, `metadata-${i}.json`);
      
      if (!fs.existsSync(chunkPath)) {
        console.warn(`⚠️  Chunk ${i} not found, skipping...`);
        continue;
      }

      console.log(`📊 Processing chunk ${i}...`);
      const chunkData = JSON.parse(fs.readFileSync(chunkPath, 'utf8'));
      allNFTs.push(...chunkData);
    }

    // Write combined metadata
    fs.writeFileSync(OUTPUT_FILE, JSON.stringify(allNFTs, null, 2), 'utf8');

    const fileSize = fs.statSync(OUTPUT_FILE).size / (1024 * 1024); // MB
    console.log(`✅ Created complete_metadata.json`);
    console.log(`📊 Total NFTs: ${allNFTs.length}`);
    console.log(`📁 File size: ${fileSize.toFixed(2)}MB`);
    console.log('🎉 Metadata combination complete!');

  } catch (error) {
    console.error('❌ Error combining metadata:', error);
  }
}

combineMetadata();
