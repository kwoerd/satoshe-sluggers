// src/app/nfts/page.tsx

import NftGrid from "@/components/NftGrid";
import EnvChecker from "@/components/EnvChecker";

export default function NftsPage() {
  return (
    <main className="p-8 space-y-8">
      <h1 className="text-3xl font-bold">NFT Collection</h1>
      <EnvChecker />
      <NftGrid />
    </main>
  );
}
