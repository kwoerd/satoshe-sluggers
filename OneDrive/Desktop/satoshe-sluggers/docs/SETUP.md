<!-- docs/SETUP.md -->
# Satoshe Sluggers - Setup Guide

## 📦 Install Dependencies

First, install the `canvas-confetti` package for celebration animations:

```bash
pnpm add canvas-confetti
pnpm add -D @types/canvas-confetti
```

## 🔑 Environment Variables

Create a `.env.local` file in the root with:

```env
# Thirdweb SDK (marketplace operations)
NEXT_PUBLIC_THIRDWEB_CLIENT_ID=your_marketplace_client_id

# Thirdweb Insight (read operations)
NEXT_PUBLIC_INSIGHT_CLIENT_ID=your_insight_client_id

# Contract Addresses
NEXT_PUBLIC_NFT_COLLECTION_ADDRESS=0xE3f1694adCe46ffcF82D15dd88859147c72f7C5a
NEXT_PUBLIC_MARKETPLACE_ADDRESS=0xF0f26455b9869d4A788191f6AEdc78410731072C

# Cloudflare Turnstile
NEXT_PUBLIC_CF_TURNSTILE_SITEKEY=your_site_key
CF_TURNSTILE_SECRET=your_secret_key
```

## 🚀 Run Development Server

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000)

## 🏗️ Build for Production

```bash
pnpm build
```

## 📤 Deploy to Vercel

1. Push to GitHub
2. Connect repository in Vercel
3. Add environment variables in Vercel dashboard
4. Deploy

---

## 🎨 Key Features

- ✅ Direct listings marketplace (no auctions)
- ✅ NFT browsing with filters and search
- ✅ Provenance records with cryptographic proofs
- ✅ Dark mode with off-white text (`#fffbeb`)
- ✅ Confetti celebrations on purchases
- ✅ Favorites system (localStorage)
- ⏳ Cloudflare Turnstile integration (pending)

## 📚 Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Styling**: Tailwind CSS v4
- **UI Components**: ShadCN
- **Blockchain**: Thirdweb v5 SDK
- **Package Manager**: PNPM
- **Deployment**: Vercel

