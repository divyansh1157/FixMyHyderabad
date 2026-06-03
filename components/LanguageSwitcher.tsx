'use client';

import { useRouter, usePathname } from 'next/navigation';

const LANGS = [
  { code: 'en', label: 'English', name: 'English' },
  { code: 'te', label: 'తెలుగు', name: 'తెలుగు' },
  { code: 'ur', label: 'اردو', name: 'اردو' },
];

export default function LanguageSwitcher({
  currentLocale,
}: {
  currentLocale: string;
}) {
  const router = useRouter();
  const pathname = usePathname();

  const switchTo = (locale: string) => {
    const segments = pathname.split('/');
    segments[1] = locale;
    router.push(segments.join('/'));
  };

  return (
    <div
      className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg border-2 border-slate-200"
      dir="ltr"
    >
      {LANGS.map(({ code, label, name }) => (
        <button
          key={code}
          onClick={() => switchTo(code)}
          title={name}
          aria-label={`Switch context language selection to ${name}`}
          className={`px-3 py-1.5 rounded-md text-xs font-extrabold transition-all cursor-pointer select-none ${
            currentLocale === code
              ? 'bg-blue-800 text-white shadow-xs font-black'
              : 'text-slate-600 hover:bg-slate-200 hover:text-slate-900'
          }`}
        >
          {label}
        </button>
      ))}
    </div>
  );
}
