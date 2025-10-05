"use client";

import { useActiveAccount } from "thirdweb/react";

export default function MyNftsPage() {
  const account = useActiveAccount();

  if (!account) {
    return (
      <main className="p-8">
        <h1 className="text-2xl font-bold">My NFTs</h1>
        <p className="mt-4">Please connect your wallet to view your NFTs and bids.</p>
      </main>
    );
  }

  return (
    <main className="p-8">
      <h1 className="text-2xl font-bold">My NFTs</h1>
      <div className="mt-6">
        <p className="text-neutral-400">This page is ready for your existing UI components.</p>
        <p className="text-sm text-neutral-500 mt-2">
          Connect your existing components to display owned NFTs, bids, and favorites.
        </p>
      </div>
    </main>
  );
}
