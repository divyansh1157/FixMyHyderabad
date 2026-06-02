import type { Metadata } from 'next'
import { Inter, Noto_Sans_Arabic } from 'next/font/google'
import '../globals.css'
import Link from 'next/link'
import { NextIntlClientProvider } from 'next-intl'
import { getMessages } from 'next-intl/server'
import LanguageSwitcher from '@/components/LanguageSwitcher'

const inter = Inter({ 
  subsets: ['latin'], 
  weight: ['400','500','600','700','800','900'], 
  variable: '--font-inter', 
  display: 'swap' 
})

const notoUrdu = Noto_Sans_Arabic({
  subsets: ['arabic'],
  weight: ['400', '700'],
  variable: '--font-noto-urdu',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'FixMyHyderabad',
  description: 'Report and track civic issues across Hyderabad',
}

interface LayoutProps {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}

export default async function RootLayout({ children, params }: LayoutProps) {
  // Await the dynamic locale route params
  const { locale } = await params
  
  // Fetch messages corresponding to the active locale bundle ('en', 'te', 'ur')
  const messages = await getMessages()
  const nav = messages.nav as { tagline: string; reportIssue: string }
  
  // Determine if RTL - only apply text direction, not full layout flip
  const isRtl = locale === 'ur'

  return (
    <html lang={locale} dir={isRtl ? 'rtl' : 'ltr'}>
      <body className={`${inter.variable} ${notoUrdu.variable} antialiased ${isRtl ? 'font-urdu' : 'font-sans'}`}>
        <NextIntlClientProvider locale={locale} messages={messages}>
          
          {/* Header */}
          <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-gray-200 shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
              <Link href={`/${locale}`} className={`flex items-center gap-2.5 shrink-0 ${isRtl ? 'flex-row-reverse' : 'flex-row'}`}>
                <span className="text-2xl">🏙️</span>
                <div className={isRtl ? 'text-right' : 'text-left'}>
                  <p className="font-extrabold text-lg tracking-tight leading-none text-gray-900" style={{ fontFamily: 'var(--font-inter), sans-serif' }}>
                    FixMyHyderabad
                  </p>
                  <p className="text-[10px] text-gray-500 font-medium mt-0.5">{nav.tagline}</p>
                </div>
              </Link>

              <div className={`flex items-center gap-2 shrink-0 ${isRtl ? 'flex-row-reverse' : 'flex-row'}`}>
                <LanguageSwitcher currentLocale={locale} />
                <Link href={`/${locale}/report`} className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-4 py-2 rounded-full shadow-md transition-all active:scale-95">
                  {nav.reportIssue}
                </Link>
              </div>
            </div>
          </header>

          {/* Core Page Contents */}
          <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            {children}
          </main>

        </NextIntlClientProvider>
      </body>
    </html>
  )
}