"use client"
import NFTGrid from "@/components/nft-grid-optimized"
import CollectionStats from "@/components/collection-stats"
import Footer from "@/components/footer"
import Navigation from "@/components/navigation"
import NFTSidebar from "@/components/nft-sidebar-optimized"
import { useState, useCallback } from "react"

export default function NFTsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [searchMode, setSearchMode] = useState<"contains" | "exact">("contains")
  const [selectedFilters, setSelectedFilters] = useState({})
  const [filteredCount, setFilteredCount] = useState(0)
  const [traitCounts, setTraitCounts] = useState<Record<string, Record<string, number>>>({})

  const handleFilteredCountChange = useCallback((count: number) => {
    setFilteredCount(count)
  }, [])

  const handleTraitCountsChange = useCallback((counts: Record<string, Record<string, number>>) => {
    setTraitCounts(counts)
  }, [])

  return (
    <main className="min-h-screen bg-background text-foreground pt-24 sm:pt-28">
      <Navigation activePage="nfts" />

      <section className="w-full mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
        <div className="mb-6">
          <h1 id="collection-heading" className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-center mb-1 text-white">
            SATO<span className="text-[#ff0099]">SHE</span> SLUGGERS
          </h1>
          <p className="text-lg sm:text-2xl text-neutral-300 text-center max-w-2xl mx-auto tracking-wider">
            A RETINAL DELIGHTS NFT MARKETPLACE
          </p>
        </div>

        <CollectionStats />

        <div className="mt-6 sm:mt-8 flex flex-col lg:flex-row gap-4 lg:gap-6" suppressHydrationWarning>
          <div className="lg:sticky lg:top-[76px] lg:self-start z-10 w-full lg:w-72 xl:w-80 2xl:w-96">
            <NFTSidebar
              searchTerm={searchTerm}
              searchMode={searchMode}
              selectedFilters={selectedFilters}
              onSearchChange={setSearchTerm}
              onSearchModeChange={(mode) => setSearchMode(mode as "exact" | "contains")}
              onFilterChange={setSelectedFilters}
              onTraitCountsChange={handleTraitCountsChange}
            />
          </div>
          <div className="flex-1 min-w-0">
            <NFTGrid
              searchTerm={searchTerm}
              searchMode={searchMode}
              selectedFilters={selectedFilters}
              onFilteredCountChange={handleFilteredCountChange}
              onTraitCountsChange={handleTraitCountsChange}
            />
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}

