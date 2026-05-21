import type { Metadata, Viewport } from 'next'
import { Lora, DM_Sans, JetBrains_Mono } from 'next/font/google'
import { AppShell } from '@/components/layout/AppShell'
import './globals.css'

const lora = Lora({
  subsets: ['latin'],
  weight: ['500', '600'],
  variable: '--font-display',
  display: 'swap',
})

const dmSans = DM_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-body',
  display: 'swap',
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-mono',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Todo',
  description: 'A calm, offline-first task manager.',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Todo',
  },
}

export const viewport: Viewport = {
  themeColor: '#faf9f6',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html
      lang="en"
      className={`${lora.variable} ${dmSans.variable} ${jetbrainsMono.variable} h-full`}
    >
      <body className="min-h-full font-body bg-bg-base text-ink-primary antialiased">
        <AppShell>{children}</AppShell>
      </body>
    </html>
  )
}
