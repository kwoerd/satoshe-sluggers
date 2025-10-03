// src/app/my-nfts/page.tsx

"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import OwnedNfts from "@/components/OwnedNfts";
import MyBids from "@/components/MyBids";
import Favorites from "@/components/Favorites";

export default function MyNftsPage() {
  // DISABLED: useActiveAccount disabled to prevent RPC calls
  // const account = useActiveAccount();

  // Temporarily show message instead of wallet-dependent content
  return (
    <main className="p-8">
      <h1 className="text-2xl font-bold">My NFTs</h1>
      <p className="mt-4 text-muted-foreground">
        Wallet connection temporarily disabled to prevent rate limiting.
        <br />
        This page will be available once RPC rate limiting is resolved.
      </p>
    </main>
  );
}