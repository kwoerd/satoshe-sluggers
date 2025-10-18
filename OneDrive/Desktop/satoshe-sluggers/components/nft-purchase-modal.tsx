// components/nft-purchase-modal.tsx
"use client";

import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { BuyDirectListingButton } from "thirdweb/react";
import { client } from "@/lib/thirdweb";
import { base } from "thirdweb/chains";
import { track } from '@vercel/analytics';
import Image from "next/image";

interface NFTPurchaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  nft: {
    tokenId: string;
    name: string;
    image: string;
    priceEth: number;
    listingId: number;
    rarity: string;
    rank: string | number;
    rarityPercent: string | number;
    attributes: Array<{
      trait_type: string;
      value: string;
    }>;
  };
}

export default function NFTPurchaseModal({ isOpen, onClose, nft }: NFTPurchaseModalProps) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted || !isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative bg-[#FFFBEB] rounded-lg shadow-2xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-neutral-200">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-[#ff0099] rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-sm">RD</span>
            </div>
            <div>
              <h2 className="font-bold text-lg text-neutral-900">Retinal Delights</h2>
              <p className="text-sm text-neutral-600">Joy for the eye to see.</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-neutral-100 rounded-full transition-colors"
          >
            <X className="w-6 h-6 text-neutral-600" />
          </button>
        </div>

        {/* Content */}
        <div className="flex">
          {/* Left Side - NFT Image */}
          <div className="w-1/2 p-6 bg-[#FFFBEB]">
            <div className="aspect-square relative rounded-lg overflow-hidden bg-neutral-100">
              <Image
                src={nft.image}
                alt={nft.name}
                fill
                className="object-cover"
                priority
              />
            </div>
            <div className="mt-4 text-center">
              <h3 className="text-2xl font-bold text-neutral-900">SATOSHE SLUGGER</h3>
            </div>
          </div>

          {/* Right Side - Details & Buy Button */}
          <div className="w-1/2 p-6 bg-neutral-900 text-white">
            <div className="space-y-6">
              {/* NFT Info */}
              <div>
                <h1 className="text-3xl font-bold mb-2">{nft.name}</h1>
                <p className="text-neutral-400 mb-4">Women&apos;s Baseball Card</p>
                
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-sm text-neutral-400">Satoshe Sluggers</span>
                  <span className="text-sm text-neutral-400">•</span>
                  <span className="text-sm text-neutral-400">Owned by 0x52C9...383d</span>
                </div>

                <div className="flex gap-2 mb-6">
                  <span className="px-3 py-1 bg-neutral-700 rounded-full text-sm">ERC721</span>
                  <span className="px-3 py-1 bg-neutral-700 rounded-full text-sm">Token #{nft.tokenId}</span>
                  <span className="px-3 py-1 bg-blue-600 rounded-full text-sm">Base</span>
                </div>
              </div>

              {/* Traits */}
              <div>
                <h3 className="text-lg font-semibold mb-4">Traits {nft.attributes.length}</h3>
                <div className="grid grid-cols-2 gap-3">
                  {nft.attributes.map((attr, index) => (
                    <div key={index} className="bg-neutral-800 rounded-lg p-3 flex items-center justify-between">
                      <div>
                        <div className="text-xs text-neutral-400 uppercase tracking-wide">{attr.trait_type}</div>
                        <div className="text-sm font-medium">{attr.value}</div>
                      </div>
                      <div className="text-neutral-400">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                        </svg>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Buy Section */}
              <div className="border-t border-neutral-700 pt-3">
                <div className="flex items-baseline justify-between gap-4">
                  <div>
                    <div className="text-base font-semibold text-neutral-400 mb-1">Buy Now</div>
                    <div className="text-2xl font-bold text-blue-400">{nft.priceEth} ETH</div>
                  </div>
                  
                  <BuyDirectListingButton
                    contractAddress="0x187A56dDfCcc96AA9f4FaAA8C0fE57388820A817"
                    client={client}
                    chain={base}
                    listingId={BigInt(nft.listingId)}
                    quantity={1n}
                    onTransactionSent={() => {
                      track('NFT Purchase Attempted', { tokenId: nft.tokenId });
                    }}
                    onTransactionConfirmed={() => {
                      track('NFT Purchase Success', { tokenId: nft.tokenId });
                      onClose(); // Close modal on successful purchase
                    }}
                    onError={() => {
                      track('NFT Purchase Failed', { tokenId: nft.tokenId });
                    }}
                    className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-black text-xl rounded-lg transition-colors"
                  >
                    BUY
                  </BuyDirectListingButton>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
