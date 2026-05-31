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

const iconPath = '/images/00a12c53-aa04-42b8-a0dc-a74e02c64e78_removalai_preview.png'

export const metadata: Metadata = {
  metadataBase: new URL('https://ecom-1st-web-sothafrican-clint.vercel.app'),
  title: { default: "PrideProMart - Premium Luxury E-Commerce", template: "%s | PrideProMart" },
  description: "Discover premium luxury products at PrideProMart. Shop curated collections of fashion, beauty, tech, home, and more.",
  keywords: ["luxury", "ecommerce", "premium products", "fashion", "beauty", "gadgets", "PrideProMart", "South Africa"],
  icons: {
    icon: [{ url: iconPath, type: 'image/png' }],
    apple: [{ url: iconPath, sizes: '180x180', type: 'image/png' }],
  },
  openGraph: {
    title: "PrideProMart - Premium Luxury E-Commerce",
    description: "Discover premium luxury products at PrideProMart.",
    url: "https://pridepromart.co.za",
    siteName: "PrideProMart",
    images: [{ url: iconPath, width: 512, height: 512 }],
    locale: "en_ZA",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "PrideProMart - Premium Luxury E-Commerce",
    description: "Discover premium luxury products at PrideProMart.",
    images: [iconPath],
  },
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
