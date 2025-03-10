import './globals.css'
import { Inter } from 'next/font/google'
import { Metadata } from 'next'
import { AuthProvider } from '../context/AuthContext'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Asheville Events',
  description: 'Discover events happening in Asheville, NC',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-[#E9E3D7] min-h-screen`}>
        <AuthProvider>
          <div className="pt-20">
            {children}
          </div>
        </AuthProvider>
      </body>
    </html>
  )
}
