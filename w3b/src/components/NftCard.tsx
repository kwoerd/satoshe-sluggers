// src/components/NftCard.tsx

import Link from "next/link";
import Image from "next/image";
import { BidBuyoutSection } from "./BidBuyoutSection";
import { FavoriteButton } from "./FavoriteButton";

interface NFT {
  tokenId: string;
  metadata?: {
    image?: string;
    name?: string;
    description?: string;
  };
  owner?: string;
  tokenURI?: string;
}

export default function NftCard({ nft, priority = false }: { nft: NFT; priority?: boolean }) {
  // Convert IPFS URLs to HTTP URLs as a fallback
  const convertIpfsUrl = (url: string) => {
    if (!url) return url;
    if (url.startsWith('ipfs://')) {
      const ipfsHash = url.replace('ipfs://', '');
      return `https://ipfs.io/ipfs/${ipfsHash}`;
    }
    return url;
  };

  const imageUrl = convertIpfsUrl(nft.metadata?.image || '');

  return (
        <div className="rounded-xl border p-3 space-y-3">
          <Link href={`/nfts/${nft.tokenId}`} className="block">
            {imageUrl && (
              <Image 
                src={imageUrl} 
                alt={nft.metadata?.name || `NFT #${nft.tokenId}`} 
                width={400}
                height={400}
                className="w-full rounded object-cover"
                priority={priority}
              />
            )}
            <div className="font-semibold">{nft.metadata?.name ?? `#${nft.tokenId}`}</div>
            <div className="text-sm text-gray-500">Token ID: {nft.tokenId}</div>
            {nft.owner && <div className="text-xs text-gray-400">Owner: {nft.owner.slice(0, 6)}...{nft.owner.slice(-4)}</div>}
          </Link>
      
      <div className="flex justify-between items-center">
        <FavoriteButton nftId={nft.tokenId} />
      </div>
      
      <BidBuyoutSection
        auctionId={BigInt(String(nft.tokenId || "0"))}
        minBid="0.01"
        buyoutPrice="0.1"
      />
    </div>
  );
}
