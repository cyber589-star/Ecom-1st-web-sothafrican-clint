import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import "./globals.css"
import { Providers } from "./providers"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
})

export const metadata: Metadata = {
  title: "PrideProMart - Premium Luxury E-Commerce",
  description: "Discover premium luxury products at PrideProMart. Shop curated collections of fashion, beauty, tech, home, and more.",
  keywords: "luxury, ecommerce, premium products, fashion, beauty, gadgets, PrideProMart",
  icons: { icon: '/images/00a12c53-aa04-42b8-a0dc-a74e02c64e78_removalai_preview.png', apple: '/images/00a12c53-aa04-42b8-a0dc-a74e02c64e78_removalai_preview.png' },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-white text-gray-900">
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
