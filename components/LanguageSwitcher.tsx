'use client'

import { useRouter, usePathname } from 'next/navigation'

// Add or remove languages here — code must match your locales in i18n/routing.ts
const LANGS = [
  { code: 'en', label: 'EN',   name: 'English' },
  { code: 'te', label: 'తె',   name: 'తెలుగు'  },
  { code: 'ur', label: 'اردو', name: 'اردو'    },
]

export default function LanguageSwitcher({ currentLocale }: { currentLocale: string }) {
  const router   = useRouter()
  const pathname = usePathname()

  const switchTo = (locale: string) => {
    // replaces /en/... with /te/... etc, preserving the rest of the URL
    const segments = pathname.split('/')
    segments[1] = locale           // index 1 is always the locale segment
    router.push(segments.join('/'))
  }

  return (
    <div className="flex items-center gap-0.5 bg-[#1A1208]/6 rounded-full p-1">
      {LANGS.map(({ code, label, name }) => (
        <button
          key={code}
          onClick={() => switchTo(code)}
          title={name}
          aria-label={`Switch to ${name}`}
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
