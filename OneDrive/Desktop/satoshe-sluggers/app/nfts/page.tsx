// app/nfts/page.tsx
"use client"
import NFTGrid from "@/components/nft-grid"
import CollectionStats from "@/components/collection-stats"
import Footer from "@/components/footer"
import Navigation from "@/components/navigation"
import NFTSidebar from "@/components/nft-sidebar"
import { useState } from "react"

export default function NFTsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [searchMode, setSearchMode] = useState<"contains" | "exact">("contains")
  const [selectedFilters, setSelectedFilters] = useState({})
  const [traitCounts, setTraitCounts] = useState<Record<string, Record<string, number>>>({})

  return (
    <main className="min-h-screen bg-background text-[#FFFBEB] pt-24 sm:pt-28">
      <Navigation activePage="nfts" />

      <section className="w-full mx-auto px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 2xl:px-20 py-6 sm:py-8 lg:py-10">
        <div className="mb-8 lg:mb-12">
          <h1 id="collection-heading" className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-center mb-3 text-[#FFFBEB]">
            SATO<span className="text-[#ff0099]">SHE</span> SLUGGERS
          </h1>
          <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-neutral-300 text-center max-w-3xl mx-auto tracking-wider">
            A RETINAL DELIGHTS NFT MARKETPLACE
          </p>
        </div>

        <div className="mb-8 lg:mb-12">
          <CollectionStats />
        </div>

        <div className="flex flex-col xl:flex-row gap-6 lg:gap-8" suppressHydrationWarning>
          <div className="xl:sticky xl:top-[76px] xl:self-start z-10 w-full xl:w-80 2xl:w-96">
            <NFTSidebar
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              searchMode={searchMode}
              setSearchMode={setSearchMode}
              selectedFilters={selectedFilters}
              setSelectedFilters={setSelectedFilters}
              traitCounts={traitCounts}
            />
          </div>
          <div className="flex-1 min-w-0">
            <NFTGrid
              searchTerm={searchTerm}
              searchMode={searchMode}
              selectedFilters={selectedFilters}
              onFilteredCountChange={() => {}} // Empty callback since we don't use the count
              onTraitCountsChange={setTraitCounts} // Pass trait counts to sidebar
            />
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}

