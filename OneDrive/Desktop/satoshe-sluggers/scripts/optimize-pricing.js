// scripts/optimize-pricing.js
import fs from 'fs';

const INPUT_FILE = 'public/data/pricing/token_pricing_mappings.json';
const OUTPUT_FILE = 'public/data/pricing/optimized_pricing.json';

console.log('🔧 Optimizing pricing data...');

try {
  // Read the current pricing file (remove BOM if present)
  const rawData = fs.readFileSync(INPUT_FILE, 'utf8');
  const cleanData = rawData.replace(/^\uFEFF/, ''); // Remove BOM
  const pricingData = JSON.parse(cleanData);
  
  // Create a more efficient structure
  const optimizedPricing = {
    // Group by rarity tier for efficient lookup
    byRarity: {},
    // Direct token ID lookup for specific cases
    byTokenId: {},
    // Metadata
    totalTokens: pricingData.length,
    lastUpdated: new Date().toISOString()
  };

  // Process each pricing entry
  pricingData.forEach(item => {
    const { token_id, rarity_tier, price_eth } = item;
    
    // Add to rarity group
    if (!optimizedPricing.byRarity[rarity_tier]) {
      optimizedPricing.byRarity[rarity_tier] = {
        price_eth,
        tokens: []
      };
    }
    optimizedPricing.byRarity[rarity_tier].tokens.push(token_id);
    
    // Add to direct lookup
    optimizedPricing.byTokenId[token_id] = {
      rarity_tier,
      price_eth
    };
  });

  // Write optimized file
  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(optimizedPricing, null, 2));
  
  const originalSize = fs.statSync(INPUT_FILE).size;
  const optimizedSize = fs.statSync(OUTPUT_FILE).size;
  const savings = ((originalSize - optimizedSize) / originalSize * 100).toFixed(1);
  
  console.log('✅ Pricing optimization complete!');
  console.log(`📊 Original size: ${(originalSize / 1024 / 1024).toFixed(2)} MB`);
  console.log(`📊 Optimized size: ${(optimizedSize / 1024 / 1024).toFixed(2)} MB`);
  console.log(`💾 Space saved: ${savings}%`);
  
} catch (error) {
  console.error('❌ Error optimizing pricing:', error);
}
