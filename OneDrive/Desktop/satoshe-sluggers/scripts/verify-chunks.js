// scripts/verify-chunks.js
const fs = require('fs');
const path = require('path');

const CHUNKS_DIR = 'public/data/metadata-chunks';

function verifyChunks() {
  try {
    console.log('🔍 Verifying metadata chunks...\n');

    // Check if chunks directory exists
    if (!fs.existsSync(CHUNKS_DIR)) {
      console.error('❌ Chunks directory not found:', CHUNKS_DIR);
      return;
    }

    // Read metadata info
    const infoPath = path.join(CHUNKS_DIR, 'metadata-info.json');
    if (!fs.existsSync(infoPath)) {
      console.error('❌ metadata-info.json not found');
      return;
    }

    const info = JSON.parse(fs.readFileSync(infoPath, 'utf8'));
    console.log('📋 Metadata Info:');
    console.log(`   Total NFTs: ${info.totalNFTs}`);
    console.log(`   Total Chunks: ${info.totalChunks}`);
    console.log(`   Chunk Size: ${info.chunkSize}`);
    console.log(`   Last Chunk Size: ${info.lastChunkSize}`);
    console.log(`   Created: ${info.createdAt}\n`);

    // Verify each chunk
    let totalNFTs = 0;
    let totalSize = 0;

    for (let i = 0; i < info.totalChunks; i++) {
      const chunkPath = path.join(CHUNKS_DIR, `metadata-${i}.json`);
      
      if (!fs.existsSync(chunkPath)) {
        console.error(`❌ Missing chunk: metadata-${i}.json`);
        continue;
      }

      const chunkData = JSON.parse(fs.readFileSync(chunkPath, 'utf8'));
      const chunkSize = fs.statSync(chunkPath).size;
      const expectedSize = i === info.totalChunks - 1 ? info.lastChunkSize : info.chunkSize;
      
      totalNFTs += chunkData.length;
      totalSize += chunkSize;

      const status = chunkData.length === expectedSize ? '✅' : '❌';
      console.log(`${status} metadata-${i}.json: ${chunkData.length} NFTs (${(chunkSize / 1024 / 1024).toFixed(2)}MB)`);
    }

    console.log('\n📊 Summary:');
    console.log(`   Total NFTs loaded: ${totalNFTs}`);
    console.log(`   Expected NFTs: ${info.totalNFTs}`);
    console.log(`   Total size: ${(totalSize / 1024 / 1024).toFixed(2)}MB`);
    console.log(`   Status: ${totalNFTs === info.totalNFTs ? '✅ All chunks valid' : '❌ Mismatch detected'}`);

    // Check for gaps or overlaps
    console.log('\n🔍 Checking for data integrity...');
    const allTokenIds = [];
    for (let i = 0; i < info.totalChunks; i++) {
      const chunkPath = path.join(CHUNKS_DIR, `metadata-${i}.json`);
      if (fs.existsSync(chunkPath)) {
        const chunkData = JSON.parse(fs.readFileSync(chunkPath, 'utf8'));
        chunkData.forEach(item => {
          if (item.token_id !== undefined) {
            allTokenIds.push(item.token_id);
          }
        });
      }
    }

    allTokenIds.sort((a, b) => a - b);
    const hasGaps = allTokenIds.some((id, index) => index > 0 && id !== allTokenIds[index - 1] + 1);
    
    if (hasGaps) {
      console.log('❌ Gaps detected in token IDs');
    } else {
      console.log('✅ Token IDs are sequential');
    }

  } catch (error) {
    console.error('❌ Error verifying chunks:', error);
  }
}

verifyChunks();
