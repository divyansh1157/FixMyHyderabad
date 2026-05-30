'use client'

import { useRouter, usePathname } from 'next/navigation'

const LANGS = [
  { code: 'en', label: 'EN' },
  { code: 'te', label: 'తె' },
  { code: 'ur', label: 'اردو' },
]

export default function LanguageSwitcher({ currentLocale }: { currentLocale: string }) {
  const router   = useRouter()
  const pathname = usePathname()

  const switchTo = (locale: string) => {
    // Swaps /en/... → /te/... → /ur/...
    const newPath = pathname.replace(/^\/(en|te|ur)/, `/${locale}`)
    router.push(newPath)
  }

  return (
    <div className="flex items-center gap-1 bg-[#1A1208]/5 rounded-full p-1">
      {LANGS.map(({ code, label }) => (
        <button
          key={code}
          onClick={() => switchTo(code)}
          className={`px-2.5 py-1 rounded-full text-xs font-bold transition-all ${
            currentLocale === code
              ? 'bg-white shadow-sm text-[#1A1208]'
              : 'text-[#1A1208]/50 hover:text-[#1A1208]'
          }`}
        >
          {label}
        </button>
      ))}
    </div>
  )
}