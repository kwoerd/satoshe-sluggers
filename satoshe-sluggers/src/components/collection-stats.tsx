export default function CollectionStats() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
      <div className="bg-card p-4 rounded border border-neutral-700 shadow-sm text-center">
        <h3 className="text-neutral-400 text-sm mb-1">Total Supply</h3>
        <p className="text-xl sm:text-2xl font-bold" style={{ color: "#fffbeb" }}>7777</p>
      </div>
      <div className="bg-card p-4 rounded border border-neutral-700 shadow-sm text-center">
        <h3 className="text-neutral-400 text-sm mb-1">Edition</h3>
        <p className="text-2xl font-bold" style={{ color: "#fffbeb" }}>1</p>
      </div>
      <div className="bg-card p-4 rounded border border-neutral-700 shadow-sm text-center">
        <h3 className="text-neutral-400 text-sm mb-1">Rarity Tiers</h3>
        <p className="text-xl sm:text-2xl font-bold" style={{ color: "#fffbeb" }}>11</p>
      </div>
    </div>
  )
}
