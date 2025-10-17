// scripts/split-metadata.js
const fs = require('fs');
const path = require('path');

const CHUNK_SIZE = 1000; // NFTs per chunk
const INPUT_FILE = 'public/data/complete_metadata.json';
const OUTPUT_DIR = 'public/data/metadata-chunks';

async function splitMetadata() {
  try {
    console.log('📖 Reading complete metadata file...');
    const fileContent = fs.readFileSync(INPUT_FILE, 'utf8');
    // Remove BOM if present
    const cleanContent = fileContent.replace(/^\uFEFF/, '');
    const metadata = JSON.parse(cleanContent);
    const totalNFTs = metadata.length;
    const totalChunks = Math.ceil(totalNFTs / CHUNK_SIZE);
    
    console.log(`📊 Found ${totalNFTs} NFTs, splitting into ${totalChunks} chunks of ${CHUNK_SIZE} each`);

    // Create output directory
    if (!fs.existsSync(OUTPUT_DIR)) {
      fs.mkdirSync(OUTPUT_DIR, { recursive: true });
    }

    // Split into chunks
    for (let i = 0; i < totalChunks; i++) {
      const startIndex = i * CHUNK_SIZE;
      const endIndex = Math.min(startIndex + CHUNK_SIZE, totalNFTs);
      const chunk = metadata.slice(startIndex, endIndex);
      
      const filename = `metadata-${i}.json`;
      const filepath = path.join(OUTPUT_DIR, filename);
      
      fs.writeFileSync(filepath, JSON.stringify(chunk, null, 2));
      console.log(`✅ Created ${filename} (NFTs ${startIndex}-${endIndex-1})`);
    }

    // Create metadata info file
    const metadataInfo = {
      totalNFTs,
      totalChunks,
      chunkSize: CHUNK_SIZE,
      lastChunkSize: totalNFTs % CHUNK_SIZE || CHUNK_SIZE,
      createdAt: new Date().toISOString(),
      version: '1.0.0'
    };

    fs.writeFileSync(
      path.join(OUTPUT_DIR, 'metadata-info.json'), 
      JSON.stringify(metadataInfo, null, 2)
    );

    console.log('📋 Created metadata-info.json');
    console.log('🎉 Metadata splitting complete!');
    console.log(`📁 Output directory: ${OUTPUT_DIR}`);

  } catch (error) {
    console.error('❌ Error splitting metadata:', error);
    process.exit(1);
  }
}

splitMetadata();
