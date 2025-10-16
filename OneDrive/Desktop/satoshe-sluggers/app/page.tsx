"use client"

import Header80 from "@/components/header-80"
import Footer from "@/components/footer"
import Navigation from "@/components/navigation"

export default function HomePage() {
  return (
    <main className="min-h-screen bg-background text-foreground flex flex-col pt-24 sm:pt-28">
      <Navigation activePage="home" />

      <div className="flex-grow">
        <Header80 />
      </div>

      <Footer />
    </main>
  )
}
