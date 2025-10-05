// components/Sidebar.tsx
"use client";
import { useState } from "react";
export default function Sidebar({ onApply }: { onApply: (q: { search: string; sort: string; minPrice: string; maxPrice: string }) => void }) {
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("buyoutPrice:asc");
  const [minPrice, setMin] = useState("");
  const [maxPrice, setMax] = useState("");

  return (
    <aside className="space-y-2">
      <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search name" />
      <select value={sort} onChange={e=>setSort(e.target.value)}>
        <option value="buyoutPrice:asc">Price: Low → High</option>
        <option value="buyoutPrice:desc">Price: High → Low</option>
        <option value="endTime:asc">Ending Soon</option>
      </select>
      <div className="flex gap-2">
        <input type="number" placeholder="Min" value={minPrice} onChange={e=>setMin(e.target.value)} />
        <input type="number" placeholder="Max" value={maxPrice} onChange={e=>setMax(e.target.value)} />
      </div>
      <button onClick={() => onApply({ search, sort, minPrice, maxPrice })}>Apply</button>
    </aside>
  );
}
