# Satoshe Sluggers NFT Marketplace

A clean, modern NFT marketplace for the Satoshe Sluggers collection built with Next.js 15, Thirdweb v5, and ShadCN.

## 🚀 Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Blockchain**: Thirdweb v5 SDK
- **Styling**: Tailwind CSS
- **UI Components**: ShadCN
- **Package Manager**: PNPM
- **Network**: Base (Chain ID: 8453)

## 📦 Installation

```bash
# Install dependencies
pnpm install
```

## 🔑 Environment Setup

1. Create a `.env.local` file in the root directory
2. Copy the contents from `env.example.txt`
3. Fill in your actual values:
   - **NEXT_PUBLIC_THIRDWEB_CLIENT_ID**: Get from [Thirdweb Dashboard](https://thirdweb.com/dashboard)
   - **NEXT_PUBLIC_NFT_COLLECTION_ADDRESS**: Your ERC-721 Drop contract address
   - **NEXT_PUBLIC_MARKETPLACE_ADDRESS**: Your v3 Marketplace contract address
   - **Turnstile Keys**: Get from [Cloudflare Dashboard](https://dash.cloudflare.com/)

## 🎨 Features

- **Direct Listings Only**: Simple buy/sell functionality (no auctions)
- **Local Metadata**: Fast filtering and sorting using `combined_metadata.json`
- **Thirdweb Insight**: Optimized RPC calls for blockchain data
- **Favorites**: Save NFTs to local favorites (wallet-specific)
- **Provenance Page**: Complete cryptographic proof of collection authenticity
- **Responsive Design**: Mobile-first UI with ShadCN components
- **Dark Theme**: Beautiful dark mode design with pink accents (#ff0099)

## 📂 Project Structure

```
satoshe-sluggers/
├── app/                    # Next.js pages
│   ├── about/             # About page
│   ├── contact/           # Contact form
│   ├── my-nfts/           # User's NFT collection
│   ├── nft/[id]/          # Individual NFT detail page
│   ├── nfts/              # Browse all NFTs
│   ├── provenance/        # Provenance record
│   └── page.tsx           # Home page
├── components/            # React components
│   ├── ui/               # ShadCN components
│   ├── nft-card.tsx      # NFT card component
│   ├── nft-grid.tsx      # NFT grid with pagination
│   ├── nft-sidebar.tsx   # Filters sidebar
│   └── ...
├── lib/                   # Utilities
│   ├── thirdweb.ts       # Thirdweb client config
│   ├── contracts.ts      # Contract instances
│   └── constants.ts      # App constants
├── hooks/                 # Custom React hooks
│   └── useFavorites.ts   # Favorites management
├── public/               # Static assets
│   ├── docs/             # Metadata & provenance data
│   ├── images/           # NFT images
│   ├── icons/            # UI icons
│   └── data/             # Provenance files
└── styles/               # Global styles
```

## 🏃 Development

```bash
# Run development server
pnpm dev

# Build for production
pnpm build

# Start production server
pnpm start
```

## 🔐 Security Features

- **Cloudflare Turnstile**: Bot protection before wallet connection
- **SIWE (Sign-In With Ethereum)**: Secure wallet authentication
- **RPC Rate Limiting**: Maximum 250 calls/second
- **Local Metadata**: Reduces blockchain queries

## 📊 Collection Info

- **Total Supply**: 7,777 NFTs
- **Blockchain**: Base
- **Token Standard**: ERC-721
- **Current Limit**: 3,000 NFTs (temporary for development)

## 🎯 Next Steps

1. Update environment variables in `.env.local`
2. Update contract addresses in `lib/constants.ts` (Provenance page)
3. Test wallet connection and Turnstile integration
4. Deploy to Vercel
5. Update `MAX_NFTS` in `lib/contracts.ts` to 7777 when ready

## 📝 License

Proprietary - Retinal Delights © 2024

## 🙋 Support

For questions or issues, please contact through the [Contact Page](https://retinaldelights.io/contact).
