import Link from "next/link";
import { useState, useEffect } from "react";
import { Heart } from "lucide-react";
import { useFavorites } from "@/hooks/useFavorites";
import { track } from '@vercel/analytics';
import { TransactionButton, useSendTransaction, useActiveAccount } from "thirdweb/react";
import { buyFromListing } from "thirdweb/extensions/marketplace";
import { marketplace } from "../lib/contracts";

interface NFTCardProps {
  // Static props from complete_metadata.json
  image: string;
  name: string;
  rank: string | number;
  rarity: string;
  rarityPercent: string | number;
  price: string; // Direct listing price
  tokenId: string;
  listingId: number;
  isForSale: boolean;
  isProcessingBuy?: boolean;
  
  // Purchase handlers (from parent/page)
  onBuy?: () => void;
}

export default function NFTCard({
  image, name, rank, rarity, rarityPercent, price,
  tokenId, listingId, isForSale, isProcessingBuy = false, onBuy,
}: NFTCardProps) {
  const [imgLoaded, setImgLoaded] = useState(false);
  const [imgError, setImgError] = useState(false);
  const [imgLoading, setImgLoading] = useState(true);

  const { isFavorited, toggleFavorite, isConnected } = useFavorites();
  const isFav = isFavorited(tokenId);
  const account = useActiveAccount();

  const { mutate: sendBuy } = useSendTransaction();

  const placeholder = "/media/nfts/placeholder-nft.webp";
  const showPlaceholder = !imgLoaded || imgError;

  function handleFavoriteClick(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    if (!isConnected) {
      alert('Please connect your wallet to favorite NFTs');
      return;
    }
    const wasFav = isFav;
    toggleFavorite({ tokenId, name, image, rarity, rank, rarityPercent });
    track(wasFav ? 'NFT Unfavorited' : 'NFT Favorited', {
      tokenId, name, rarity, rank: String(rank), rarityPercent: String(rarityPercent)
    });
  }

  return (
    <div className="overflow-visible w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl 2xl:max-w-2xl mx-auto rounded-sm shadow-md flex flex-col h-full">
      <Link href={`/nft/${tokenId}`} className="block w-full">
        <div className="relative w-full overflow-visible" style={{ aspectRatio: "0.9/1" }}>
          <img
            src={showPlaceholder ? placeholder : image}
            alt={name}
            width="100%"
            height="100%"
            className={`object-contain p-2 hover:scale-[1.02] hover:rotate-[5deg] hover:-translate-y-1 transition-all duration-300 ease-out relative z-20 ${showPlaceholder ? 'animate-pulse' : ''}`}
            onLoad={() => { setImgLoaded(true); setImgLoading(false); }}
            onError={() => { setImgError(true); setImgLoading(false); }}
          />
          {imgLoading && !showPlaceholder && (
            <div className="absolute inset-0 bg-neutral-900/80 flex items-center justify-center">
              <div className="animate-pulse text-neutral-400 text-sm">Loading...</div>
            </div>
          )}
        </div>
      </Link>
      <div className="p-3 flex-1 flex flex-col text-off-white">
        <div className="mb-2">
          <div className="flex items-center justify-between mb-1">
                <h4 className="text-sm md:text-base lg:text-lg font-medium leading-tight whitespace-nowrap pr-2 text-off-white">{name}</h4>
            <button
              onClick={handleFavoriteClick}
              className="p-1 rounded-sm hover:bg-neutral-800 transition-colors"
              title={isFav ? "Remove from favorites" : "Add to favorites"}
            >
              <Heart className={`w-5 h-5 transition-colors ${isFav ? "fill-brand-pink text-brand-pink" : "text-neutral-400 hover:text-brand-pink"}`} />
            </button>
          </div>
        </div>
        <div className="flex flex-col flex-1">
          <div className="space-y-0.5 text-xs md:text-sm mb-3 flex-1 leading-tight">
            <div className="flex justify-between"><span className="text-neutral-400">Rank:</span><span className="text-neutral-400">{rank || '—'} of 7777</span></div>
            <div className="flex justify-between"><span className="text-neutral-400">Rarity:</span><span className="text-neutral-400">{rarityPercent || '--'}%</span></div>
            <div className="flex justify-between"><span className="text-neutral-400">Tier:</span><span className="text-neutral-400">{rarity || 'Unknown'}</span></div>
            {!isForSale && (
              <div className="flex justify-between">
                <span className="text-neutral-400">Status:</span><span className="text-neutral-500">Not for Sale</span>
              </div>
            )}
          </div>
          {isForSale && (
            <div className="pt-2 p-3 bg-card rounded-sm">
              <div className="flex items-end justify-between">
                <div>
                      <div className="text-xs md:text-sm mb-0.5 text-off-white">Buy Now</div>
                  <div className="text-sm md:text-base font-medium leading-tight" style={{ color: "#3B82F6" }}>{price.replace(' ETH', '')} ETH</div>
                </div>
                <button
                  onClick={async () => {
                    if (onBuy) {
                      onBuy();
                      return;
                    }
                    
                    if (!account?.address) {
                      alert("Please connect your wallet first");
                      return;
                    }
                    
                    try {
                      const tx = buyFromListing({
                        contract: marketplace,
                        listingId: BigInt(listingId),
                        quantity: 1n,
                        recipient: account.address,
                      });
                      await new Promise((resolve, reject) => {
                        sendBuy(tx, {
                          onSuccess: () => {
                            track('NFT Buy Now Clicked', {
                              tokenId,
                              buyNowPrice: price.replace(' ETH', ''),
                              rarity,
                              rank: String(rank),
                              listingId: String(listingId),
                            });
                            resolve(true);
                          },
                          onError: (error) => {
                            console.error(`[Buy Now] Transaction failed for token ${tokenId}:`, error);
                            reject(error);
                          },
                        });
                      });
                      alert(`NFT purchased successfully for ${price.replace(' ETH', '')} ETH!`);
                    } catch (error) {
                      console.error(`[Buy Now] Error in buy now flow for token ${tokenId}:`, error);
                      alert(error instanceof Error ? error.message : "Failed to buy NFT. Please try again.");
                    }
                  }}
                      className="px-3 text-xs md:text-sm font-normal border rounded-sm text-off-white"
                      style={{
                        height: "32px",
                        backgroundColor: "#3B82F6",
                        minWidth: "50px",
                        borderRadius: "2px",
                        borderColor: "#3B82F6",
                        borderWidth: "1px"
                      }}
                >
                  BUY
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
