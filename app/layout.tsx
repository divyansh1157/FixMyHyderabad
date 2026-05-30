import type { Metadata } from 'next'
import { DM_Sans, Syne } from 'next/font/google'
import './globals.css'
import Link from 'next/link'

// ── Fonts loaded correctly via next/font (not @import) ──
const dmSans = DM_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  variable: '--font-dm-sans',
  display: 'swap',
})

const syne = Syne({
  subsets: ['latin'],
  weight: ['700', '800'],
  variable: '--font-syne',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'FixMyArea Hyderabad',
  description: 'Report and track civic issues across Hyderabad',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${dmSans.variable} ${syne.variable}`}>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
      </head>
      <body
        className="antialiased min-h-screen bg-[#FDFAF7]"
        style={{ fontFamily: 'var(--font-dm-sans), sans-serif' }}
      >
        {/* ── Sticky header ── */}
        <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-[#1A1208]/8 shadow-sm">
          <div className="max-w-xl mx-auto px-4 h-16 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2.5">
              <span className="text-2xl">🏙️</span>
              <div>
                <p
                  className="font-extrabold text-sm tracking-tight leading-none text-[#1A1208]"
                  style={{ fontFamily: 'var(--font-syne), sans-serif' }}
                >
                  FixMyArea
                </p>
                <p className="text-[10px] text-[#1A1208]/50 font-medium mt-0.5">Hyderabad Portal</p>
              </div>
            </Link>
            <Link
              href="/report"
              className="bg-[#E8520A] hover:bg-[#d4480a] text-white text-xs font-bold px-4 py-2 rounded-full shadow-md transition-all active:scale-95"
            >
              + Report Issue
            </Link>
          </div>
        </header>

        {/* ── Page content ── */}
        <main className="max-w-xl mx-auto px-4 pt-6 pb-28">
          {children}
        </main>

        {/* ── Mobile bottom nav ── */}
        <nav className="fixed bottom-0 inset-x-0 z-40 bg-white/95 backdrop-blur-md border-t border-[#1A1208]/8 shadow-lg sm:hidden">
          <div className="max-w-xl mx-auto flex items-center justify-around h-14">
            <Link href="/" className="flex flex-col items-center gap-0.5 text-[#E8520A]">
              <span className="text-lg">🏠</span>
              <span className="text-[10px] font-semibold">Feed</span>
            </Link>
            <Link href="/report" className="flex flex-col items-center gap-0.5 text-[#1A1208]/40">
              <span className="text-lg">📸</span>
              <span className="text-[10px] font-medium">Report</span>
            </Link>
            <Link href="/map" className="flex flex-col items-center gap-0.5 text-[#1A1208]/40">
              <span className="text-lg">🗺️</span>
              <span className="text-[10px] font-medium">Map</span>
            </Link>
          </div>
        </nav>
      </body>
    </html>
  )
}
