import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  safelist: [
    // Card backgrounds & shadows
    'bg-white', 'bg-[#FDFAF7]', 'shadow-sm', 'shadow-md', 'rounded-2xl', 'rounded-xl', 'rounded-md', 'rounded-full',
    // Borders
    'border', 'border-[#1A1208]/8', 'border-[#1A1208]/10', 'border-orange-200', 'border-emerald-200',
    'border-blue-200', 'border-amber-200', 'border-stone-200', 'border-red-200', 'border-yellow-200',
    // Category pills
    'bg-orange-50', 'text-orange-700', 'bg-emerald-50', 'text-emerald-700',
    'bg-blue-50', 'text-blue-700', 'bg-amber-50', 'text-amber-700',
    'bg-stone-100', 'text-stone-700',
    // Urgency pills
    'bg-red-50', 'text-red-600', 'border-red-200',
    'text-orange-600',
    'bg-yellow-50', 'text-yellow-700', 'border-yellow-200',
    // Status dots
    'bg-green-500', 'bg-blue-500', 'bg-zinc-400',
    // Confirm button states
    'bg-emerald-50', 'border-emerald-200', 'text-emerald-700',
    // Text colors
    'text-[#1A1208]', 'text-[#E8520A]', 'text-white',
    // Spacing
    'gap-1.5', 'gap-2', 'gap-2.5', 'gap-3', 'gap-4',
    'p-4', 'p-5', 'px-4', 'py-4', 'mb-1', 'mb-2', 'mb-2.5', 'mb-3', 'mt-1',
    // Flex
    'flex', 'flex-col', 'flex-wrap', 'items-center', 'justify-between',
    'w-full', 'min-w-0', 'overflow-hidden',
    // Animation
    'card-in',
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}

export default config
