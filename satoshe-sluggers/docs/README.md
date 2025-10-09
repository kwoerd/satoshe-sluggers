# 🖼️ NFT Gallery & English Auction Platform – For BASE

A next-gen, modular, real-time NFT gallery and English auction platform, built for Base with **Next.js 15**, **React 19**, **TypeScript**, **Tailwind CSS**, **shadcn/ui** (neutral theming), **thirdweb v5 SDK/Insight**, and **pnpm** monorepo workspaces.  
All NFTs are accessible **only** as secondary sales via live English auctions—no mint/claim/list UI.  
**Optimized for scale, data integrity, reusability, and live UX.**

---

## 🏗 Tech Stack

- **Monorepo:** Managed via pnpm workspaces (pnpm install/dev/build)
- **Frontend:** Next.js 15, React 19, TypeScript, Tailwind CSS, shadcn/ui (neutral/dark/light, CSS variables in `/app/globals.css`)
- **Blockchain:** Base Mainnet (ID: 8453)
- **Marketplace:** thirdweb V3 English Auctions Marketplace (only auctions, no fixed-price/list UI)
- **Data APIs:** thirdweb v5 SDK, Insight batch API, real-time updates via Insight webhooks & backend push
- **Notifications:** Insight webhooks → backend → frontend socket for wallet-based toasts/inbox
- **Deployment:** Modular to Vercel, serverless, or traditional infra

---

## 🎨 Theming & shadcn/ui Usage

- Uses shadcn’s "neutral" palette with CSS vars, dark mode via `.dark { ... }` overrides.
- Example: `<div className="bg-background text-foreground" />`
- All preferred shadcn components (nav, sidebar, card, pagination, badge, table, accordion, etc.) are scaffolded via [component registry](https://github.com/kwoerd/component-registry) and pnpm dlx installs.
- Extend/add your own colors/utility classes as needed; tailwind.config with `"cssVariables": true`.

---

## 📦 Structure

/apps/frontend               # Next.js 15 front end (marketplace gallery)
/apps/backend                # Optional: Insight webhook/event backend
/packages/components         # Reusable UI, all shadcn-based and pure props-driven
/packages/types              # Shared TS types/constants, critical filtering arrays
/components/Grid/NFTGrid.tsx # Batched NFTCards, paginated
/components/Grid/NFTCard.tsx # Single NFT + auction, price/bid/buyout
/components/Layout/Sidebar.tsx # Filtering, sort, search via shadcn
/providers/AuctionNFTProvider.tsx # Batches + merges auction/NFT metadata with polling
/hooks/useAuctionNFTs.ts     # Batch fetch auctions/metas, exposes sort/filter
/pages/index.tsx             # Main public grid view

*All scripts, installs, builds use `pnpm` only.*

---

## ⚡ Quickstart

1. Clone & setup:
   ```
   git clone ...
   cd marketplace-app
   pnpm install
   ```
```
2. Configure `.env.local` for:
   ```
```
   NEXT_PUBLIC_NFT_COLLECTION_ADDRESS=
   NEXT_PUBLIC_MARKETPLACE_ADDRESS=
   NEXT_PUBLIC_CHAIN_ID=8453
   NEXT_PUBLIC_CLIENT_ID=
   NEXT_PUBLIC_RPC_URL=https://8453.rpc.thirdweb.com
   ```
```
3. Start dev:
   ```
```
   pnpm dev
   ```
```
4. Build for prod:
   ```
```
   pnpm build
   ```
---

## 🚨 Absolute Rules & Data Integrity

- **No mint/claim/fixed-price or listing/sell actions in UI. Only show owned NFTs in active English auctions.**
- **Never, ever render, pass, or reference these bad Listing IDs:**  
  `0,1,2,3,4,5,6,7782,7783,7784,7785,7786,7787,7788`
  - Every provider/hook must exclude them before UI gets the data.
  - Add dev comments/tests for this in `/types`, `/hooks/useAuctionListings.ts`, `/providers`.
- **Never do per-NFT or per-auction RPC/meta/network fetches.** 
  - Only batch via Insight or SDK (all data in memory).
- **All sort/filter/search logic acts globally on full in-memory data set (not just what's displayed).**
- **Paginate only in-memory (UI slices 25/50/100/250 by dropdown), never refetch entire data set per action.**
- **All notification and price/auction state is polled or pushed live for UX accuracy.**

---

## 🔄 Data Flow – Real-Time, Batch-Only

- All English auction events (and basic listing data) loaded via Insight `/v1/events`, then filtered/excluded for bad IDs and cached in provider.
- All NFT metadata for just those tokenIds loaded in batch (via `/nfts` endpoint or batch SDK).
- Merge data once in provider/context, then expose via hooks for grid/sidebar/UI.
- Buy/Bid actions use only thirdweb v5 extension SDK, modularized as standalone buttons/actions.
- Client polls just active auctions for price/status/bid updates every 10–20s (or receives push from backend socket).
- All searching, sorting, and filtering (by price, attributes, rarity, etc.) acts globally over the batch in-memory dataset for UX; only renders the current page's worth to DOM.

---

## 🎨 UI/Component Composition

- Navbar (shadcn/nav menu + ConnectButton right)
- Sidebar (shadcn/checkbox, toggle, select, input for sort/search/filter)
- NFTGrid (grid or table of NFTCards, paginated by dropdown)
- NFTCard (image, name, tokenId, auction status, timer, price, bid button, buyout if allowed, attributes via shadcn Badge/Accordion)
- Loading states: skeletons/grid while batch data loads
- Notifications: shadcn/alert or badge on auction win/outbid etc.
- Modal/Drawer: shadcn/sheet for NFT details or auction steps

---

## 🧑‍💻 Dev Conventions

- **pnpm only** for everything (document in README/onboarding).
- No per-item network or contract calls for meta or auction status/price (batch Insight or SDK fetch only).
- Never filter, sort, or search by network—do so in memory for all UX actions.
- All reusable logic/components in `/packages/components`, `/hooks`, `/providers`—never wire network directly in component.
- Use memoization/windowing for grid if collection >1000 NFTs for fast scroll UX.
- Notify users of auction events via backend-push (Insight webhooks → socket) or fallback polling.

---

## 🪄 Theming & CSS Rules

- shadcn "neutral" CSS vars, dark/light supported out of box.
- Change palette in `/app/globals.css`, add new vars for chart/accent/notification/etc as needed.
- All shadcn component utilities available in TSX via imports, e.g.
  ```
  <Accordion />    <Alert />    <Badge />    <NavigationMenu />    <Pagination />    <Sidebar />
  ```
```
- See `/components.json` and `/globals.css` for Tailwind + shadcn config (`cssVariables: true` recommended).

---

## 🔗 References

- [thirdweb SDK v5](https://portal.thirdweb.com/typescript/v5)
- [thirdweb Insight docs](https://portal.thirdweb.com/insight)
- [Setting up Insight Webhooks](https://portal.thirdweb.com/insight/insight-webhooks)
- [shadcn/ui components](https://github.com/kwoerd/component-registry)
- [Next.js 15](https://beta.nextjs.org/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [pnpm](https://pnpm.io/)

---

## 📋 Onboarding for New Devs

- Install `pnpm` ([docs](https://pnpm.io/installation)), never use npm/yarn.
- Read this README—every dev must understand batch-only, English auction focus, and listing ID exclusion rules before coding.
- Review provider/hook/demo logic for full auction+NFT data merging and event push.
- Fork and extend only modularized components; never duplicate logic.

---

**Summary:**  
Everything here builds for batch data flow, maximum reusability, ease of upgrade/testing, and fast, real-time auction gallery UX for Base NFTs.  
Have questions? Need example hooks, layouts, or architecture diagrams? Ask the maintainers!

""")
```
Would you like a sample provider/hook implementation or a TSX component scaffold next? To avoid markdown/triple-quote errors, I will break the README into clear, short markdown sections, and stay strictly within standard markdown formatting—no nested code blocks or ambiguous delimiters, and no code fences within the string.

# 🖼️ NFT English Auction Gallery & Platform – BASE

A modular, real-time NFT gallery auction site on BASE, built with **Next.js 15**, **React 19**, **TypeScript**, **Tailwind CSS**, **shadcn/ui** (neutral palette), **thirdweb v5 SDK/Insight**, and **pnpm**.  
All items are secondary sales via live English auctions—no minting, claim, or direct listings in UI.  
**Optimized for scale, integrity, and real-time UX.**

---

## 🏗️ Tech Stack

- Monorepo via pnpm workspaces (`pnpm install`, `pnpm dev`, `pnpm build`)
- Frontend: Next.js 15, React 19, TypeScript, Tailwind, shadcn/ui (neutral/dark mode, CSS variables in `/app/globals.css`)
- Blockchain: Base Mainnet (ID: 8453)
- Auction/Market: thirdweb V3 English Auctions Marketplace (auction-only)
- Data: thirdweb SDK v5, Insight API (batch NFT/auction fetch), webhooks for live push
- Notifications: Insight webhooks → backend → frontend socket for real-time alerts

---

## 🎨 Theming & UI

- Uses shadcn "neutral" color palette, dark/light mode ready
- All shadcn registry components supported: nav, sidebar, card, badge, accordion, table, etc.
- Colors defined in `/globals.css`, exposed via Tailwind config with `"cssVariables": true`
- All installs, scripts, builds use `pnpm` only

---

## 📦 Directory Overview

- `/apps/frontend` – Next.js UI for gallery
- `/apps/backend` – (Optional) webhook/event backend
- `/packages/components` – All reusable UI (grid, card, sidebar, modals)
- `/packages/types` – Shared TypeScript for data, filtering, constants
- `/providers/AuctionNFTProvider.tsx` – Loads and merges all NFT/auction data, polls/receives live updates
- `/hooks/useAuctionNFTs.ts` – All data fetching, filtering, sorting, exposes canonical in-memory dataset
- `/pages/index.tsx` – All NFTs listed here; sort/filter/search in sidebar
- `/components/Grid/NFTGrid.tsx` – Paginated, filterable NFT display
- `/components/Grid/NFTCard.tsx` – Each NFT (with auction, bid, buyout, timer, owner)
- `/components/Layout/Sidebar.tsx` – All sort/attribute/price filter/search UI

---

## 🚨 Data Integrity Rules

- No claim/mint UI/logic—show auctionable, owned NFTs only.
- **Never reference these Marketplace Listing IDs:** `0,1,2,3,4,5,6,7782,7783,7784,7785,7786,7787,7788`
  - Filter ASAP in every provider/hook—document and test everywhere.
- No per-item contract/RPC fetches—**batch API only** (Insight recommended).
- All global filtering/sorting/search is over merged in-memory dataset.

---

## 🔄 Data Flow – Live, Batch-Only

- Batch-load all auction events (`/v1/events`), then all NFT metadata (`/nfts`) by tokenId(s), filtered for bad IDs.
- Merge datasets in provider; expose only the current, sorted, filtered paginated slice for rendering (25/50/100/250 by dropdown).
- **Do not** re-query to filter/sort; do everything client-side/in memory.
- Actions: Bid/Buyout buttons use thirdweb v5 extensions (standalone, modular).
- Poll for price/auction status, *or* receive via backend/Insight webhooks pushed to sockets.

---

## 🪄 UI Composition & Best Practices

- Nav bar: shadcn nav (add ConnectButton to right)
- Sidebar: shadcn (checkboxes/toggles/dropdowns/inputs for filters)
- NFTGrid: paginates, slices current page for display
- NFTCard: image, name, tokenId, price, timer, attributes, bid/buyout
- Use shadcn skeleton for loading
- Alerts/badges for notification events
- All shared state/code in `/providers`, `/hooks`—never in raw components.

---

## 🧑‍💻 Dev Conventions

- **pnpm** is required—never use npm/yarn.
- No per-NFT/auction network calls; only batch load and in-memory UX logic.
- All UI pure/componentized with TS types, responsive, props-driven.
- Add comments/tests where filtering required, especially for bad listing IDs.

---

## ⚡ Quickstart

- `pnpm install`
- Add `.env.local` (`NFT_COLLECTION_ADDRESS`, `MARKETPLACE_ADDRESS`, `CHAIN_ID`, `CLIENT_ID`, `RPC_URL`)
- `pnpm dev`
- Build: `pnpm build`

---

## 🔗 References

- [thirdweb Insight NFT API](https://portal.thirdweb.com/insight/functions#nfts)
- [thirdweb SDK v5](https://portal.thirdweb.com/typescript/v5)
- [Insight Webhooks](https://portal.thirdweb.com/insight/insight-webhooks)
- [shadcn/ui registry](https://github.com/kwoerd/component-registry)
- [pnpm](https://pnpm.io/)

---

**All devs:** Read these rules and architecture notes before coding. 
Only work from batch APIs; do not write claim, primary sale, or list UI.  
