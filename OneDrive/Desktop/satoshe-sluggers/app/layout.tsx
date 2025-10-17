// app/layout.tsx
import type { Metadata } from "next"
import { Inter, JetBrains_Mono, Inconsolata } from "next/font/google"
import "./globals.css"
import { Analytics } from "@vercel/analytics/react"
import { ThirdwebProvider } from "thirdweb/react"
import ScrollButtons from "@/components/scroll-buttons"
import TermlyScript from "@/components/termly-script"

const inter = Inter({ 
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap"
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap"
})

const inconsolata = Inconsolata({
  subsets: ["latin"],
  variable: "--font-inconsolata",
  display: "swap"
})

export const metadata: Metadata = {
  title: "Satoshe Sluggers",
  description: "Digital Sluggers, Real-World Change.",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`dark ${inter.variable} ${jetbrainsMono.variable} ${inconsolata.variable}`} suppressHydrationWarning>
      <body className="font-sans" suppressHydrationWarning>
        <ThirdwebProvider>
          {children}
          <ScrollButtons />
        </ThirdwebProvider>
        <TermlyScript />
        <Analytics />
      </body>
    </html>
  )
}
