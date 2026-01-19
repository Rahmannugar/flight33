import type { Metadata } from "next"
import "./globals.css"
import { Providers } from "./Providers"
import { Space_Grotesk } from "next/font/google"
import { LayoutClient } from "./LayoutClient"

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  display: "swap",
  weight: ["300", "400", "500", "600", "700"],
})

export const metadata: Metadata = {
  metadataBase: new URL("http://flyt33.vercel.app"),
  title: {
    default: "Flight33",
    template: "%s · Flight33",
  },
  description:
    "A modern flight discovery platform focused on price trends, insights, and smarter travel decisions.",
  keywords: [
    "flights",
    "flight prices",
    "airfare trends",
    "cheap flights",
    "travel insights",
  ],
  openGraph: {
    type: "website",
    siteName: "Flight33",
  },
  twitter: {
    card: "summary_large_image",
  },
}


export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${spaceGrotesk.className} antialiased`}>
       <Providers>
          <LayoutClient>{children}</LayoutClient>
        </Providers>
      </body>
    </html>
  )
}
