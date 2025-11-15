import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Fortunegram - Daily Fortunes & Mystical Readings',
  description: 'Discover your daily fortune with Fortunegram - a mystical web app channeling the secrets of the universe.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  )
}
