import type { Metadata } from 'next'
import { Cormorant_Garamond, Plus_Jakarta_Sans } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { Navbar } from '@/components/layout/navbar'
import { Footer } from '@/components/layout/footer'
import { WhatsAppFAB } from '@/components/layout/whatsapp-fab'
import { WishlistProvider } from '@/hooks/use-wishlist'
import './globals.css'

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-cormorant',
  display: 'swap',
})

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-plus-jakarta',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Celebrations | Premium Reception Wear & Grand Occasion Dresses | Coimbatore',
  description: 'Discover exquisite reception wear, grand sarees, and occasion dresses at Celebrations, Gandhipuram, Coimbatore. 4.6★ rated with 1,345+ reviews. Visit us or WhatsApp for inquiries.',
  keywords: ['reception wear', 'bridal sarees', 'Coimbatore', 'wedding dresses', 'grand occasion wear', 'kids party wear', 'ethnic wear'],
  openGraph: {
    title: 'Celebrations | Premium Reception Wear & Grand Occasion Dresses',
    description: 'Discover exquisite reception wear and grand sarees at Celebrations, Coimbatore. 4.6★ rated boutique.',
    type: 'website',
    locale: 'en_IN',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Celebrations | Premium Reception Wear',
    description: 'Discover exquisite reception wear and grand sarees at Celebrations, Coimbatore.',
  },
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'ClothingStore',
  name: 'Celebrations',
  address: {
    '@type': 'PostalAddress',
    streetAddress: '119/126, Cross Cut Rd, Ram Nagar, Gandhipuram',
    addressLocality: 'Coimbatore',
    addressRegion: 'Tamil Nadu',
    postalCode: '641009',
    addressCountry: 'IN',
  },
  telephone: '+918015199599',
  aggregateRating: {
    '@type': 'AggregateRating',
    ratingValue: '4.6',
    reviewCount: '1345',
  },
  openingHours: ['Mo-Su 09:00-12:30', 'Mo-Su 14:00-21:00'],
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${cormorant.variable} ${plusJakarta.variable}`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="font-sans antialiased">
        <WishlistProvider>
          <Navbar />
          <main>{children}</main>
          <Footer />
          <WhatsAppFAB />
        </WishlistProvider>
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
