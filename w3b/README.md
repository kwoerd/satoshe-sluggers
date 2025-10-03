# W3B NFT Marketplace

A professional, production-ready NFT marketplace built with Next.js 15, Thirdweb v5, and modern web3 technologies.

## 🚀 Features

- **Real-time NFT Display**: Fetches and displays NFTs from your collection using Thirdweb Insight API
- **Bid & Buyout System**: Professional marketplace functionality with proper validation
- **Wallet Integration**: Seamless wallet connection with Thirdweb v5
- **Responsive Design**: Modern UI with shadcn/ui components and Tailwind CSS
- **Error Handling**: Comprehensive error handling and user feedback
- **Security**: Production-ready security headers and input validation
- **Performance**: Optimized with React Query for caching and polling

## 🛠 Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS + shadcn/ui
- **Web3**: Thirdweb v5 SDK
- **State Management**: React Query (@tanstack/react-query)
- **UI Components**: shadcn/ui
- **Notifications**: Sonner
- **Package Manager**: pnpm

## 📋 Prerequisites

- Node.js 18+ 
- pnpm
- Thirdweb account with Insight API access
- NFT collection contract address
- Marketplace contract address

## ⚙️ Environment Setup

Create a `.env.local` file in the root directory:

```env
# Thirdweb Insight API (Server-side only)
INSIGHT_CLIENT_ID=your_insight_client_id_here

# Public configuration
NEXT_PUBLIC_CHAIN_ID=8453
NEXT_PUBLIC_MARKETPLACE_ADDRESS=0x...
NEXT_PUBLIC_NFT_COLLECTION_ADDRESS=0x...
```

## 🚀 Getting Started

1. **Install dependencies:**
   ```bash
   pnpm install
   ```

2. **Set up environment variables:**
   - Copy `.env.local.example` to `.env.local`
   - Fill in your actual values

3. **Start development server:**
   ```bash
   pnpm dev
   ```

4. **Open your browser:**
   - Navigate to `http://localhost:3000`
   - Connect your wallet
   - Browse your NFT collection

## 🏗 Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   │   ├── auctions/      # NFT collection endpoint
│   │   ├── metadata/      # NFT metadata endpoint
│   │   ├── bid-history/   # Bid history endpoint
│   │   ├── owned/         # Owned NFTs endpoint
│   │   └── my-bids/       # User bids endpoint
│   ├── nfts/              # NFT pages
│   │   └── [tokenId]/     # Individual NFT details
│   ├── my-nfts/           # User dashboard
│   └── layout.tsx         # Root layout
├── components/             # React components
│   ├── ui/                # shadcn/ui components
│   ├── NftCard.tsx        # NFT display card
│   ├── NftGrid.tsx        # NFT grid layout
│   ├── BidBuyoutSection.tsx # Marketplace actions
│   └── ...                # Other components
└── lib/                   # Utilities
    └── utils.ts           # Helper functions
```

## 🔧 API Endpoints

### `/api/auctions`
- **Method**: GET
- **Description**: Fetches NFTs from your collection
- **Parameters**: 
  - `page` (optional): Page number (default: 1)
  - `limit` (optional): Items per page (default: 24, max: 100)
  - `tokenId` (optional): Specific token ID

### `/api/metadata`
- **Method**: GET
- **Description**: Fetches NFT metadata
- **Parameters**:
  - `contract`: NFT collection address
  - `tokenId`: Token ID

### `/api/bid-history`
- **Method**: GET
- **Description**: Fetches bid history for an NFT
- **Parameters**:
  - `tokenId`: Token ID

## 🛡 Security Features

- **Input Validation**: All inputs are validated and sanitized
- **Rate Limiting**: Built-in protection against abuse
- **Security Headers**: Comprehensive security headers
- **Error Handling**: Detailed error logging without exposing sensitive data
- **Environment Variables**: Sensitive data kept server-side

## 🚀 Deployment

### Vercel (Recommended)

1. **Connect your repository to Vercel**
2. **Set environment variables in Vercel dashboard**
3. **Deploy automatically on push to main**

### Manual Deployment

1. **Build the project:**
   ```bash
   pnpm build
   ```

2. **Start production server:**
   ```bash
   pnpm start
   ```

## 🔍 Troubleshooting

### Common Issues

1. **"Failed to fetch" errors:**
   - Check if dev server is running
   - Verify environment variables are set
   - Clear browser cache

2. **"No NFTs found":**
   - Verify your NFT collection address
   - Check if the collection has minted NFTs
   - Ensure Insight API credentials are correct

3. **Wallet connection issues:**
   - Make sure you're on the correct network
   - Check if your wallet supports the chain

## 📝 Development

### Code Standards
- TypeScript strict mode enabled
- ESLint configuration for code quality
- Prettier for code formatting
- Comprehensive error handling

### Testing
- Unit tests for utilities
- Integration tests for API routes
- E2E tests for critical user flows

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support, please open an issue in the GitHub repository or contact the development team.

---

**Built with ❤️ using Next.js, Thirdweb, and modern web3 technologies**
