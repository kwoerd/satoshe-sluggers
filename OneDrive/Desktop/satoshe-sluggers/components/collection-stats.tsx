export default function CollectionStats() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4">
      <div className="bg-card p-3 md:p-4 rounded border border-neutral-700 shadow-sm text-center min-w-0">
        <h3 className="text-neutral-400 text-xs md:text-sm mb-1 whitespace-nowrap">Total Supply</h3>
        <p className="text-lg md:text-xl lg:text-2xl font-bold whitespace-nowrap">7777</p>
      </div>
      <div className="bg-card p-3 md:p-4 rounded border border-neutral-700 shadow-sm text-center min-w-0">
        <h3 className="text-neutral-400 text-xs md:text-sm mb-1 whitespace-nowrap">Edition</h3>
        <p className="text-lg md:text-xl lg:text-2xl font-bold text-offwhite whitespace-nowrap">1</p>
      </div>
      <div className="bg-card p-3 md:p-4 rounded border border-neutral-700 shadow-sm text-center min-w-0">
        <h3 className="text-neutral-400 text-xs md:text-sm mb-1 whitespace-nowrap">Rarity Tiers</h3>
        <p className="text-lg md:text-xl lg:text-2xl font-bold whitespace-nowrap">11</p>
      </div>
    </div>
  )
}

