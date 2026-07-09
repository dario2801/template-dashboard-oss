import { ClerkProvider } from "@clerk/nextjs"
import type { Metadata } from "next"
import { ThemeProvider } from "next-themes"
import { Inter, Playfair_Display } from "next/font/google"
import "./globals.css"

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
})

// Stands in for Ivy Presto, the commercial didone the brand reference specifies.
const playfair = Playfair_Display({
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500"],
  variable: "--font-playfair",
})

import { siteConfig } from "./siteConfig"

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: siteConfig.name,
  description: siteConfig.description,
  keywords: ["analytics", "dashboard", "metrics", "data", "insights"],
  authors: [
    {
      name: siteConfig.name,
      url: siteConfig.url,
    },
  ],
  creator: siteConfig.name,
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteConfig.url,
    title: siteConfig.name,
    description: siteConfig.description,
    siteName: siteConfig.name,
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.name,
    description: siteConfig.description,
    creator: "@novaanalytics",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body
          className={`${inter.className} ${inter.variable} ${playfair.variable} overflow-y-scroll scroll-auto antialiased selection:bg-brand-100 selection:text-brand-700 dark:bg-gray-950`}
          suppressHydrationWarning
        >
          <ThemeProvider defaultTheme="system" attribute="class">
            {children}
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  )
}
