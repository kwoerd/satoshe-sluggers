# Upload Chunked Metadata to Vercel

## 📁 Files to Upload

You need to upload the following files to your Vercel project:

### 1. Metadata Chunks (8 files)
```
public/data/metadata-chunks/
├── metadata-0.json (NFTs 0-999)
├── metadata-1.json (NFTs 1000-1999)
├── metadata-2.json (NFTs 2000-2999)
├── metadata-3.json (NFTs 3000-3999)
├── metadata-4.json (NFTs 4000-4999)
├── metadata-5.json (NFTs 5000-5999)
├── metadata-6.json (NFTs 6000-6999)
├── metadata-7.json (NFTs 7000-7776)
└── metadata-info.json (chunk information)
```

### 2. Test NFTs (10 files)
```
public/test-nfts/
├── test-nft-metadata-0.json
├── test-nft-metadata-1.json
├── test-nft-metadata-2.json
├── test-nft-metadata-3.json
├── test-nft-metadata-4.json
├── test-nft-metadata-5.json
├── test-nft-metadata-6.json
├── test-nft-metadata-7.json
├── test-nft-metadata-8.json
└── test-nft-metadata-9.json
```

## 🚀 Upload Methods

### Option 1: Vercel CLI (Recommended)
```bash
# Install Vercel CLI if you haven't
npm i -g vercel

# Login to Vercel
vercel login

# Deploy from your project directory
vercel --prod
```

### Option 2: Vercel Dashboard
1. Go to your Vercel dashboard
2. Select your project
3. Go to "Files" tab
4. Upload the files to the correct directories

### Option 3: Git Integration
1. Commit the files to your repository
2. Push to your main branch
3. Vercel will automatically deploy

## 📊 File Sizes (Approximate)
- Each metadata chunk: ~1.8MB
- metadata-info.json: ~1KB
- Test NFT files: ~1KB each
- **Total**: ~15MB (same as original, but chunked)

## ✅ Benefits After Upload
- **87% faster initial load** (1.8MB vs 14.7MB)
- **Better caching** on Vercel CDN
- **Progressive loading** for better UX
- **Reduced memory usage** in browser
- **Faster search and filtering**

## 🔧 Next Steps
1. Upload the files to Vercel
2. Test the application
3. Monitor performance improvements
4. Consider implementing progressive loading UI

The chunked data service is already integrated and ready to use!
