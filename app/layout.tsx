import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  metadataBase: new URL('https://studio.intuitv.app'),
  title: 'IntuiTV Creator Studio | AI-Powered Content Creation',
  description: 'Professional content creation powered by MOTHER AI. Create stunning videos, animations, and shows with text-to-video technology. UK sovereign AI infrastructure.',
  keywords: 'AI video creation, MOTHER AI, text-to-video, content creation, IntuiTV, creator studio, AI animation',
  openGraph: {
    title: 'IntuiTV Creator Studio',
    description: 'Professional AI-powered content creation platform',
    url: 'https://studio.intuitv.app',
    siteName: 'IntuiTV Creator Studio',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
      },
    ],
    locale: 'en_GB',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'IntuiTV Creator Studio',
    description: 'Professional AI-powered content creation',
    images: ['/og-image.png'],
  },
}

function Starfield() {
  const stars = Array.from({ length: 100 }, (_, i) => ({
    id: i,
    size: Math.random() * 2 + 1,
    left: Math.random() * 100,
    top: Math.random() * 100,
    delay: Math.random() * 3,
  }))

  return (
    <div className="starfield">
      {stars.map((star) => (
        <div
          key={star.id}
          className="star"
          style={{
            width: `${star.size}px`,
            height: `${star.size}px`,
            left: `${star.left}%`,
            top: `${star.top}%`,
            animationDelay: `${star.delay}s`,
          }}
        />
      ))}
    </div>
  )
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <Starfield />
        {children}
      </body>
    </html>
  )
}
