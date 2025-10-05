"use client";

import { useActiveAccount } from "thirdweb/react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import OwnedNfts from "@/components/OwnedNfts";
import MyBids from "@/components/MyBids";
import Favorites from "@/components/Favorites";

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
      <Tabs defaultValue="owned" className="mt-6">
        <TabsList>
          <TabsTrigger value="owned">Owned</TabsTrigger>
          <TabsTrigger value="bids">My Bids</TabsTrigger>
          <TabsTrigger value="favorites">Favorites</TabsTrigger>
        </TabsList>
        <TabsContent value="owned">
          <OwnedNfts wallet={account.address} />
        </TabsContent>
        <TabsContent value="bids">
          <MyBids wallet={account.address} />
        </TabsContent>
        <TabsContent value="favorites">
          <Favorites />
        </TabsContent>
      </Tabs>
    </main>
  );
}
