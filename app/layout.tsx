import './globals.css'
import { Inter } from 'next/font/google'
import { Metadata } from 'next'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Frequent Flyer - Discover Local Events',
  description: 'Find and explore local events in your area.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-[#E9E3D7] min-h-screen`}>
        {children}
      </body>
    </html>
  )
}
