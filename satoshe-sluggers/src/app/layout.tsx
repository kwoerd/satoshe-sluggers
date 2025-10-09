import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import ScrollButtons from "@/components/scroll-buttons"
import { ThirdwebProvider } from "thirdweb/react"
import { app } from "@/lib/thirdweb"
import { SpeedInsights } from "@vercel/speed-insights/next"
import { Analytics } from "@vercel/analytics/next"
import CookieConsent from "@/components/cookie-consent"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Satoshe Sluggers",
  description: "Browse and collect unique Satoshe Sluggers NFTs",
  icons: {
    icon: "/favicon.ico",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preload" href="/satoshe-sluggers-hero-off-white.svg" as="image" type="image/svg+xml" />
      </head>
      <body className={inter.className}>
        <ThirdwebProvider app={app}>
          <ThemeProvider>
            <div className="text-[1.125rem]">
              {children}
              <ScrollButtons />
            </div>
          </ThemeProvider>
        </ThirdwebProvider>
        <SpeedInsights />
        <Analytics />
        <CookieConsent />
      </body>
    </html>
  )
}
