import './globals.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'SteveOS Mission Control',
  description: 'CEO dashboard'
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
