// app/layout.tsx
import type { Metadata } from "next"
import { Inter, JetBrains_Mono, Inconsolata } from "next/font/google"
import "./globals.css"
import { Analytics } from "@vercel/analytics/react"
import { ThirdwebProvider } from "thirdweb/react"
import ScrollButtons from "@/components/scroll-buttons"
import TermlyScript from "@/components/termly-script"
import ErrorBoundary from "@/components/error-boundary"

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
  title: "Satoshe Sluggers - Digital Sluggers, Real-World Change",
  description: "Satoshe Sluggers is a unique NFT collection of 7,777 digital sluggers on Base blockchain. Each NFT represents a commitment to real-world change and social impact.",
  keywords: ["NFT", "Satoshe Sluggers", "Base", "blockchain", "digital art", "social impact", "cryptocurrency", "web3"],
  authors: [{ name: "Satoshe Sluggers Team" }],
  creator: "Satoshe Sluggers",
  publisher: "Satoshe Sluggers",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://satoshesluggers.com'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: "Satoshe Sluggers - Digital Sluggers, Real-World Change",
    description: "A unique NFT collection of 7,777 digital sluggers on Base blockchain, representing commitment to real-world change and social impact.",
    url: 'https://satoshesluggers.com',
    siteName: 'Satoshe Sluggers',
    images: [
      {
        url: '/brands/satoshe-sluggers/satoshe-sluggers-home-white.svg',
        width: 1200,
        height: 630,
        alt: 'Satoshe Sluggers - Digital Sluggers, Real-World Change',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: "Satoshe Sluggers - Digital Sluggers, Real-World Change",
    description: "A unique NFT collection of 7,777 digital sluggers on Base blockchain, representing commitment to real-world change and social impact.",
    images: ['/brands/satoshe-sluggers/satoshe-sluggers-home-white.svg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  other: {
    'preload': '/brands/satoshe-sluggers/satoshe-sluggers-home-white.svg',
  }
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`dark ${inter.variable} ${jetbrainsMono.variable} ${inconsolata.variable}`} suppressHydrationWarning>
      <head>
        <link rel="dns-prefetch" href="//fonts.googleapis.com" />
        <link rel="dns-prefetch" href="//fonts.gstatic.com" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="font-sans" suppressHydrationWarning>
        <ErrorBoundary>
          <ThirdwebProvider>
            {children}
            <ScrollButtons />
          </ThirdwebProvider>
          <TermlyScript />
          <Analytics />
        </ErrorBoundary>
      </body>
    </html>
  )
}
