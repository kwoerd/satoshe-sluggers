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
      <main className="min-h-screen bg-background text-[#FFFBEB] flex flex-col pt-24 sm:pt-28">
        <Navigation activePage="home" />

        <div className="flex-grow">
          <Header80 />
        </div>

        <Footer />
      </main>
    </>
  )
}
