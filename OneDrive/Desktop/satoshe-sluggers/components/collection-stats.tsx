// components/collection-stats.tsx
import { TOTAL_COLLECTION_SIZE } from "@/lib/contracts";

export default function CollectionStats() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
      <div className="bg-card p-4 lg:p-6 rounded border border-neutral-700 shadow-sm text-center min-w-0">
        <h3 className="text-neutral-400 text-sm lg:text-base mb-2 whitespace-nowrap">Total Supply</h3>
        <p className="text-xl lg:text-2xl xl:text-3xl font-bold whitespace-nowrap">{TOTAL_COLLECTION_SIZE}</p>
      </div>
      <div className="bg-card p-4 lg:p-6 rounded border border-neutral-700 shadow-sm text-center min-w-0">
        <h3 className="text-neutral-400 text-sm lg:text-base mb-2 whitespace-nowrap">Edition</h3>
        <p className="text-xl lg:text-2xl xl:text-3xl font-bold text-offwhite whitespace-nowrap">1</p>
      </div>
      <div className="bg-card p-4 lg:p-6 rounded border border-neutral-700 shadow-sm text-center min-w-0">
        <h3 className="text-neutral-400 text-sm lg:text-base mb-2 whitespace-nowrap">Rarity Tiers</h3>
        <p className="text-xl lg:text-2xl xl:text-3xl font-bold whitespace-nowrap">11</p>
      </div>
    </div>
  )
}

