"use client"

import Image from "next/image"
import Footer from "@/components/footer"
import Navigation from "@/components/navigation"

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-background text-foreground flex flex-col pt-24 sm:pt-28">
      <Navigation activePage="about" />

      <div className="flex-grow container mx-auto px-4 py-12 pb-16 flex items-center justify-center">
        <div className="max-w-3xl w-full">
          <Image
            src="/satoshe-sluggers-about-us-offwhite.svg"
            alt="About Satoshe Sluggers"
            width={600}
            height={1200}
            className="w-full h-auto max-w-2xl"
            priority
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 80vw, 60vw"
          />
        </div>
      </div>

      <Footer />
    </main>
  )
}
