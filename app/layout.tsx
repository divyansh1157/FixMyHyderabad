import type { Metadata } from 'next'
import { DM_Sans, Syne } from 'next/font/google'
import './globals.css'
import Link from 'next/link'

// ── Fonts ──────────────────────────────────────────────────────────────────
const dmSans = DM_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
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

// ─────────────────────────────────────────────────────────────────────────────
// SEGMENT: NAV_LINKS — edit this array to add/remove header nav items
// ─────────────────────────────────────────────────────────────────────────────
const NAV_LINKS = [
  { href: '/',       label: 'Feed',   emoji: '🏠' },
  { href: '/report', label: 'Report', emoji: '📸' },
]

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${dmSans.variable} ${syne.variable}`}>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body
        className="antialiased min-h-screen bg-[#FDFAF7]"
        style={{ fontFamily: 'var(--font-dm-sans), sans-serif' }}
      >

        {/* ── SEGMENT: HEADER ─────────────────────────────────────────────
            To change header style: edit classes on <header> and inner divs.
            To change max content width: change max-w-7xl below.
        ────────────────────────────────────────────────────────────────── */}
        <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-[#1A1208]/8 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-6">

            {/* Logo */}
            <Link href="/" className="flex items-center gap-2.5 shrink-0">
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

            {/* Desktop nav — hidden on mobile */}
            <nav className="hidden md:flex items-center gap-1">
              {NAV_LINKS.map(({ href, label, emoji }) => (
                <Link
                  key={href}
                  href={href}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-semibold text-[#1A1208]/60 hover:text-[#1A1208] hover:bg-[#1A1208]/5 transition-all"
                >
                  <span>{emoji}</span>
                  <span>{label}</span>
                </Link>
              ))}
            </nav>

            {/* CTA button */}
            <Link
              href="/report"
              className="bg-[#E8520A] hover:bg-[#d4480a] text-white text-xs font-bold px-4 py-2 rounded-full shadow-md transition-all active:scale-95 shrink-0"
            >
              + Report Issue
            </Link>
          </div>
        </header>

        {/* ── SEGMENT: PAGE WRAPPER ───────────────────────────────────────
            max-w-7xl = full wide layout for desktop.
            On mobile it naturally goes edge-to-edge with px-4 padding.
            Change max-w-7xl to max-w-5xl or max-w-3xl to make it narrower.
        ────────────────────────────────────────────────────────────────── */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-24 md:pb-10">
          {children}
        </main>

        {/* ── SEGMENT: BOTTOM NAV (mobile only, hidden md+) ───────────────
            Only shows on phones. Tablet/desktop uses the header nav above.
        ────────────────────────────────────────────────────────────────── */}
        <nav className="fixed bottom-0 inset-x-0 z-40 bg-white/95 backdrop-blur-md border-t border-[#1A1208]/8 shadow-lg md:hidden">
          <div className="max-w-lg mx-auto flex items-center justify-around h-14">
            {NAV_LINKS.map(({ href, label, emoji }) => (
              <Link
                key={href}
                href={href}
                className="flex flex-col items-center gap-0.5 text-[#1A1208]/40 hover:text-[#E8520A] transition-colors"
              >
                <span className="text-lg">{emoji}</span>
                <span className="text-[10px] font-medium">{label}</span>
              </Link>
            ))}
          </div>
        </nav>

      </body>
    </html>
  )
}
