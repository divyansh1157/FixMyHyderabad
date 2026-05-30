import type { Metadata } from 'next'
import { DM_Sans, Syne } from 'next/font/google'
import '../globals.css'                          // ← note the ../ since we moved one level deeper
import Link from 'next/link'
import { NextIntlClientProvider } from 'next-intl'
import { getMessages } from 'next-intl/server'
import LanguageSwitcher from '@/components/LanguageSwitcher'

const dmSans = DM_Sans({ subsets: ['latin'], weight: ['400','500','600','700'], variable: '--font-dm-sans', display: 'swap' })
const syne   = Syne({ subsets: ['latin'], weight: ['700','800'], variable: '--font-syne', display: 'swap' })

export const metadata: Metadata = {
  title: 'FixMyArea Hyderabad',
  description: 'Report and track civic issues across Hyderabad',
}

const NAV_LINKS = [
  { href: '/',       label_key: 'feed',   emoji: '🏠' },
  { href: '/report', label_key: 'report', emoji: '📸' },
  { href: '/map',    label_key: 'map',    emoji: '🗺️' },
]

export default async function RootLayout(props: any) {
  const { locale } = await props.params
  const { children } = props
  const messages = await getMessages()


  const nav = (messages as any).nav   // typed shortcut

  return (
    <html
      lang={locale}
      dir={locale === 'ur' ? 'rtl' : 'ltr'}   /* ← Urdu flips to right-to-left automatically */
      className={`${dmSans.variable} ${syne.variable}`}
    >
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body className="antialiased min-h-screen bg-[#FDFAF7]" style={{ fontFamily: 'var(--font-dm-sans), sans-serif' }}>
        <NextIntlClientProvider messages={messages}>

          {/* Header */}
          <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-[#1A1208]/8 shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
              <Link href={`/${locale}`} className="flex items-center gap-2.5 shrink-0">
                <span className="text-2xl">🏙️</span>
                <div>
                  <p className="font-extrabold text-sm tracking-tight leading-none text-[#1A1208]" style={{ fontFamily: 'var(--font-syne), sans-serif' }}>
                    FixMyArea
                  </p>
                  <p className="text-[10px] text-[#1A1208]/50 font-medium mt-0.5">{nav.tagline}</p>
                </div>
              </Link>

              {/* Desktop nav */}
              <nav className="hidden md:flex items-center gap-1">
                {NAV_LINKS.map(({ href, label_key, emoji }) => (
                  <Link key={href} href={`/${locale}${href}`} className="flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-semibold text-[#1A1208]/60 hover:text-[#1A1208] hover:bg-[#1A1208]/5 transition-all">
                    <span>{emoji}</span>
                    <span>{(nav as any)[label_key]}</span>
                  </Link>
                ))}
              </nav>

              <div className="flex items-center gap-2 shrink-0">
                {/* Language switcher */}
                <LanguageSwitcher currentLocale={locale} />
                <Link href={`/${locale}/report`} className="bg-[#E8520A] hover:bg-[#d4480a] text-white text-xs font-bold px-4 py-2 rounded-full shadow-md transition-all active:scale-95">
                  {nav.reportIssue}
                </Link>
              </div>
            </div>
          </header>

          <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-24 md:pb-10">
            {children}
          </main>

          {/* Mobile bottom nav */}
          <nav className="fixed bottom-0 inset-x-0 z-40 bg-white/95 backdrop-blur-md border-t border-[#1A1208]/8 shadow-lg md:hidden">
            <div className="max-w-lg mx-auto flex items-center justify-around h-14">
              {NAV_LINKS.map(({ href, label_key, emoji }) => (
                <Link key={href} href={`/${locale}${href}`} className="flex flex-col items-center gap-0.5 text-[#1A1208]/40 hover:text-[#E8520A] transition-colors">
                  <span className="text-lg">{emoji}</span>
                  <span className="text-[10px] font-medium">{(nav as any)[label_key]}</span>
                </Link>
              ))}
            </div>
          </nav>

        </NextIntlClientProvider>
      </body>
    </html>
  )
}