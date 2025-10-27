import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'AI System Prompts Explorer',
  description: 'Explore and interact with AI system prompts from 30+ tools and platforms',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="h-full">
      <body className="h-full antialiased">{children}</body>
    </html>
  )
}