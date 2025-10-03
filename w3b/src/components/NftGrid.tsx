// src/components/NftGrid.tsx

import NftCollection from "./NftCollection";

export default function NftGrid() {
  return (
    <NftCollection 
      contractAddress={process.env.NEXT_PUBLIC_NFT_COLLECTION_ADDRESS!}
      limit={12}
      page={1}
    />
  );
}
