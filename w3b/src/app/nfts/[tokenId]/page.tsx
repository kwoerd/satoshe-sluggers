// src/app/nfts/[tokenId]/page.tsx

import NftDetails from "@/components/NftDetails";

export default async function TokenPage({ params }: { params: Promise<{ tokenId: string }> }) {
  const { tokenId } = await params;
  return (
    <main className="p-8">
      <NftDetails tokenId={tokenId} />
    </main>
  );
}
