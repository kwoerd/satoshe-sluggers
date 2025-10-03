// src/components/StatsCard.tsx

// Shows collection stats (owners, supply, etc.)
interface CollectionStats {
  name?: string;
  description?: string;
  total_supply?: number;
  unique_owner_count?: number;
}

export function StatsCard({ stats }: { stats: CollectionStats }) {
  if (!stats) return <div className="skeleton h-24 w-full" />;
  return (
    <div className="bg-card p-6 rounded-xl flex items-center justify-between shadow">
      <div>
        <h1 className="text-2xl font-bold">{stats?.name}</h1>
        <p className="text-lg text-gray-500">{stats?.description}</p>
      </div>
      <div className="flex gap-8 text-right">
        <div>
          <div className="text-3xl font-semibold">{stats?.total_supply}</div>
          <span className="text-xs text-gray-500">Total NFTs</span>
        </div>
        <div>
          <div className="text-3xl font-semibold">
            {stats?.unique_owner_count}
          </div>
          <span className="text-xs text-gray-500">Unique Owners</span>
        </div>
      </div>
    </div>
  );
}
