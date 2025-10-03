// src/app/nfts/[tokenId]/page.tsx

import NftDetails from "@/components/NftDetails";

export default function TokenPage({ params }: { params: { tokenId: string } }) {
  return (
    <main className="p-8">
      <NftDetails tokenId={params.tokenId} />
    </main>
  );
}
