// app/nfts/page.tsx
"use client"
import NFTGrid from "@/components/nft-grid"
import CollectionStats from "@/components/collection-stats"
import Footer from "@/components/footer"
import Navigation from "@/components/navigation"
import NFTSidebar from "@/components/nft-sidebar"
import { useState, useEffect, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Satoshe Sluggers | NFTs",
}

function NFTsPageContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  
  const [searchTerm, setSearchTerm] = useState("")
  const [searchMode, setSearchMode] = useState<"contains" | "exact">("contains")
  const [selectedFilters, setSelectedFilters] = useState<Record<string, any>>({})
  const [traitCounts, setTraitCounts] = useState<Record<string, Record<string, number>>>({})
  const [isInitialized, setIsInitialized] = useState(false)

  // Initialize state from URL parameters
  useEffect(() => {
    if (!isInitialized) {
      const urlSearchTerm = searchParams.get('search') || ""
      const urlSearchMode = (searchParams.get('mode') as "contains" | "exact") || "contains"
      
      // Parse filters from URL
          const urlFilters: Record<string, any> = {}
      const simpleFilterKeys = ['rarity', 'background', 'skinTone', 'shirt', 'eyewear']
      const nestedFilterKeys = ['hair', 'headwear']
      
      // Handle simple array filters
      simpleFilterKeys.forEach(key => {
        const value = searchParams.get(key)
        if (value) {
          try {
            urlFilters[key] = JSON.parse(decodeURIComponent(value))
          } catch {
            // If parsing fails, treat as single value
            urlFilters[key] = [value]
          }
        }
      })
      
      // Handle nested object filters (hair, headwear)
      nestedFilterKeys.forEach(key => {
        const value = searchParams.get(key)
        if (value) {
          try {
            urlFilters[key] = JSON.parse(decodeURIComponent(value))
          } catch {
            // If parsing fails, skip this filter
            console.warn(`Failed to parse ${key} filter from URL`)
          }
        }
      })
      
      setSearchTerm(urlSearchTerm)
      setSearchMode(urlSearchMode)
      setSelectedFilters(urlFilters)
      setIsInitialized(true)
    }
  }, [searchParams, isInitialized])

  // Update URL when state changes
  useEffect(() => {
    if (isInitialized) {
      const params = new URLSearchParams()
      
      if (searchTerm) params.set('search', searchTerm)
      if (searchMode !== 'contains') params.set('mode', searchMode)
      
      Object.entries(selectedFilters).forEach(([key, value]) => {
        if (value) {
          if (Array.isArray(value) && value.length > 0) {
            // Simple array filters
            params.set(key, encodeURIComponent(JSON.stringify(value)))
          } else if (typeof value === 'object' && value !== null) {
            // Nested object filters (hair, headwear)
            const hasValues = Object.values(value).some((arr: any) => Array.isArray(arr) && arr.length > 0)
            if (hasValues) {
              params.set(key, encodeURIComponent(JSON.stringify(value)))
            }
          }
        }
      })
      
      const newUrl = params.toString() ? `?${params.toString()}` : '/nfts'
      router.replace(newUrl, { scroll: false })
    }
  }, [searchTerm, searchMode, selectedFilters, isInitialized, router])

  return (
    <main id="main-content" className="min-h-screen bg-background text-[#FFFBEB] pt-24 sm:pt-28">
      <Navigation activePage="nfts" />

      <section className="w-full mx-auto px-6 sm:px-8 md:px-12 lg:px-16 xl:px-20 2xl:px-24 py-6 sm:py-8 lg:py-10">
        <div className="mb-8 lg:mb-12">
          <h1 id="collection-heading" className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold text-center mb-3 text-[#FFFBEB]">
            SATO<span className="text-[#ff0099]">SHE</span> SLUGGERS
          </h1>
          <p className="text-xs sm:text-sm md:text-base lg:text-lg text-neutral-300 text-center max-w-4xl mx-auto tracking-wider whitespace-nowrap overflow-x-auto">
            / <span className="text-[#ff0099]">SHE</span> hits different    / <span className="text-[#ff0099]">SHE</span> funds women&apos;s baseball    / <span className="text-[#ff0099]">SHE</span> makes a difference
          </p>
        </div>

        <div className="mb-8 lg:mb-12">
          <CollectionStats />
        </div>

        <div className="flex flex-col xl:flex-row gap-6 lg:gap-8" suppressHydrationWarning>
          <div className="xl:sticky xl:top-[76px] xl:self-start z-10 w-full xl:w-72 2xl:w-80">
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
            {isInitialized ? (
              <NFTGrid
                searchTerm={searchTerm}
                searchMode={searchMode}
                selectedFilters={selectedFilters}
                onFilteredCountChange={() => {}} // Empty callback since we don't use the count
                onTraitCountsChange={setTraitCounts} // Pass trait counts to sidebar
              />
            ) : (
              <div className="flex items-center justify-center h-64">
                <div className="text-neutral-400">Loading filters...</div>
              </div>
            )}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}

export default function NFTsPage() {
  return (
    <Suspense fallback={
      <main className="min-h-screen bg-background text-foreground flex flex-col">
        <Navigation activePage="nfts" />
        <div className="flex-grow flex flex-col items-center justify-center pt-24 sm:pt-28">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-pink mx-auto mb-4"></div>
            <p className="text-neutral-400">Loading NFTs...</p>
          </div>
        </div>
        <Footer />
      </main>
    }>
      <NFTsPageContent />
    </Suspense>
  )
}

