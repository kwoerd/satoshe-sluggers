// src/components/Sidebar.tsx

// Sidebar for Search, Sort, Filters
interface FilterState {
  search?: string;
  sort?: string;
}

export function Sidebar({
  filters,
  setFilters,
}: {
  filters: FilterState;
  setFilters: (f: (prev: FilterState) => FilterState) => void;
}) {
  return (
    <aside className="w-64 p-4 bg-card rounded-xl flex flex-col gap-6 shadow h-fit">
      <input
        type="text"
        placeholder="Search by name or tokenId"
        className="input input-bordered text-gray-900"
        value={filters.search || ""}
        onChange={(e) =>
          setFilters((f) => ({ ...f, search: e.target.value }))
        }
      />
      <label className="block font-medium text-gray-900">Sort by</label>
      <select
        className="select select-bordered text-gray-900"
        value={filters.sort || "tokenId_asc"}
        onChange={(e) =>
          setFilters((f) => ({ ...f, sort: e.target.value }))
        }
      >
        <option value="tokenId_asc" className="text-gray-900">Token ID ↑</option>
        <option value="tokenId_desc" className="text-gray-900">Token ID ↓</option>
        <option value="price_asc" className="text-gray-900">Price (Low → High)</option>
        <option value="price_desc" className="text-gray-900">Price (High → Low)</option>
      </select>
      {/* Add more filters by rarity/tier etc. here */}
    </aside>
  );
}