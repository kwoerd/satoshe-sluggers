import React from "react";

interface OwnedNftsProps {
  wallet: string;
}

export default function OwnedNfts({ wallet: _wallet }: OwnedNftsProps) {
  return (
    <div className="p-4">
      <h2 className="text-lg font-semibold">Owned NFTs</h2>
      <p className="text-gray-600">No NFTs found for this wallet.</p>
    </div>
  );
}
