// app/page.tsx
"use client"

import Header80 from "@/components/header-80"
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
      <main id="main-content" className="min-h-screen bg-background text-[#FFFBEB]">
        <Navigation activePage="home" />
        <Header80 />
        <Footer />
      </main>
    </>
  )
}
