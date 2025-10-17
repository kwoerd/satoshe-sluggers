// app/about/page.tsx
"use client"

import Image from "next/image"
import Footer from "@/components/footer"
import Navigation from "@/components/navigation"

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-background text-[#FFFBEB] flex flex-col pt-24 sm:pt-28">
      <Navigation activePage="about" />

      <div className="flex-grow container mx-auto px-4 py-12 flex items-center justify-center">
        <div className="max-w-3xl w-full">
          <Image
            src="/about-page/satoshe-sluggers-about-us-offwhite-op.svg"
            alt="About Satoshe Sluggers"
            width={800}
            height={1000}
            className="w-full h-auto"
            priority
          />
        </div>
      </div>

      <Footer />
    </main>
  )
}

