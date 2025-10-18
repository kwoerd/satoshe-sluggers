// app/page.tsx
"use client"

// Header component removed - using inline hero section
import Footer from "@/components/footer"
import Navigation from "@/components/navigation"
import Head from "next/head"

export default function HomePage() {
  return (
    <>
      <Head>
        <link
          rel="preload"
          as="image"
          href="/brands/satoshe-sluggers/satoshe-sluggers-home-white.svg"
          type="image/svg+xml"
        />
        <link
          rel="preload"
          as="image"
          href="/nfts/1.webp"
          type="image/webp"
        />
        <link
          rel="preload"
          as="image"
          href="/nfts/5.webp"
          type="image/webp"
        />
        <link
          rel="preload"
          as="image"
          href="/nfts/9.webp"
          type="image/webp"
        />
      </Head>
      <main className="min-h-screen bg-background text-[#FFFBEB] flex flex-col pt-24 sm:pt-28">
        <Navigation activePage="home" />

      <div className="flex-grow flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-[#FFFBEB] mb-4">
            SATOSHE SLUGGERS
          </h1>
          <p className="text-lg md:text-xl text-neutral-400 mb-8">
            Digital Sluggers, Real-World Change.
          </p>
          <div className="flex justify-center gap-4">
            <a 
              href="/nfts" 
              className="px-8 py-3 bg-[#ff0099] text-white font-semibold rounded-sm hover:bg-[#ff0099]/90 transition-colors"
            >
              View Collection
            </a>
            <a 
              href="/about" 
              className="px-8 py-3 border border-[#ff0099] text-[#ff0099] font-semibold rounded-sm hover:bg-[#ff0099]/10 transition-colors"
            >
              Learn More
            </a>
          </div>
        </div>
      </div>

        <Footer />
      </main>
    </>
  )
}
