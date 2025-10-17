// app/layout.tsx
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Analytics } from "@vercel/analytics/react"
import { ThirdwebProvider } from "thirdweb/react"
import ScrollButtons from "@/components/scroll-buttons"

const inter = Inter({ 
  subsets: ["latin"],
  variable: "--font-sans",
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
    <html lang="en" className={`dark ${inter.variable}`} suppressHydrationWarning>
      <body className="font-sans">
        <ThirdwebProvider>
          <ThemeProvider>
            {children}
            <ScrollButtons />
          </ThemeProvider>
        </ThirdwebProvider>
        <Analytics />
      </body>
    </html>
  )
}
