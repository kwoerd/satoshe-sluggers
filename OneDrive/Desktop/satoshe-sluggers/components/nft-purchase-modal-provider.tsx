// components/nft-purchase-modal-provider.tsx
"use client";

import { createContext, useContext, useState, ReactNode } from "react";
import NFTPurchaseModal from "./nft-purchase-modal";

interface NFTData {
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
}

interface NFTPurchaseModalContextType {
  openModal: (nft: NFTData) => void;
  closeModal: () => void;
}

const NFTPurchaseModalContext = createContext<NFTPurchaseModalContextType | undefined>(undefined);

export function NFTPurchaseModalProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentNFT, setCurrentNFT] = useState<NFTData | null>(null);

  const openModal = (nft: NFTData) => {
    setCurrentNFT(nft);
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
    setCurrentNFT(null);
  };

  return (
    <NFTPurchaseModalContext.Provider value={{ openModal, closeModal }}>
      {children}
      {currentNFT && (
        <NFTPurchaseModal
          isOpen={isOpen}
          onClose={closeModal}
          nft={currentNFT}
        />
      )}
    </NFTPurchaseModalContext.Provider>
  );
}

export function useNFTPurchaseModal() {
  const context = useContext(NFTPurchaseModalContext);
  if (context === undefined) {
    throw new Error('useNFTPurchaseModal must be used within a NFTPurchaseModalProvider');
  }
  return context;
}
