// app/nfts/page.tsx
"use client"
import NFTGrid from "@/components/nft-grid"
import CollectionStats from "@/components/collection-stats"
import Footer from "@/components/footer"
import Navigation from "@/components/navigation"
import NFTSidebar from "@/components/nft-sidebar-optimized"
import { useState } from "react"

export default function NFTsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [searchMode, setSearchMode] = useState<"contains" | "exact">("contains")
  const [selectedFilters, setSelectedFilters] = useState({})
  // Removed unused filteredCount and traitCounts state variables

  // Removed unused callback functions

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
              onTraitCountsChange={() => {}} // Empty callback since we don't use the counts
            />
          </div>
          <div className="flex-1 min-w-0">
                    <NFTGrid
                      searchTerm={searchTerm}
                      searchMode={searchMode}
                      selectedFilters={selectedFilters}
                      onFilteredCountChange={() => {}} // Empty callback since we don't use the count
                      onTraitCountsChange={() => {}} // Empty callback since we don't use the counts
                    />
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}

