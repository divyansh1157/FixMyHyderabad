'use client'

import { SortOption } from '@/lib/types'
import { useTranslations } from 'next-intl'

// ── SEGMENT: AREAS LIST ──────────────────────────────────────────────────────
// Add or remove areas here. 'All' must stay first.
// ─────────────────────────────────────────────────────────────────────────────
export const HYDERABAD_AREAS = [
  'All', 'Madhapur', 'Kukatpally', 'Hitech City', 'Gachibowli',
  'Banjara Hills', 'Jubilee Hills', 'Secunderabad', 'Ameerpet',
  'Begumpet', 'Kondapur', 'Miyapur', 'LB Nagar', 'Dilsukhnagar',
  'Uppal', 'Mehdipatnam', 'Tolichowki', 'Manikonda', 'Kompally',
  'Shamshabad', 'Old City'
]

interface FeedFiltersProps {
  area: string
  sortBy: SortOption
  onAreaChange: (area: string) => void
  onSortChange: (sort: SortOption) => void
  layout?: 'inline' | 'sidebar'
}

export default function FeedFilters({
  area,
  sortBy,
  onAreaChange,
  onSortChange,
  layout = 'inline',
}: FeedFiltersProps) {
  const t = useTranslations('filters')
  const isSidebar = layout === 'sidebar'

  return (
    <div className={`
      bg-white/95 border border-[#1A1208]/10 rounded-2xl shadow-sm
      ${isSidebar ? 'p-4 flex flex-col gap-3' : 'p-3 flex flex-col sm:flex-row gap-3 items-center'}
    `}>

      {/* ── Area selector ── */}
      <div className={`relative ${isSidebar ? 'w-full' : 'w-full sm:flex-1'}`}>
        <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm pointer-events-none">📍</span>
        <select
          value={area}
          onChange={(e) => onAreaChange(e.target.value)}
          className="w-full appearance-none bg-white border border-[#1A1208]/10 rounded-xl pl-10 pr-8 py-2.5 text-sm font-semibold text-[#1A1208] focus:outline-none focus:border-[#E8520A] focus:ring-2 focus:ring-orange-200 transition cursor-pointer"
        >
          {HYDERABAD_AREAS.map((a) => (
            <option key={a} value={a}>
              {a === 'All' ? t('allNeighborhoods') : a}
            </option>
          ))}
        </select>
        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[#1A1208]/30 pointer-events-none text-[9px]">▼</span>
      </div>

      {/* ── Sort toggles ── */}
      {isSidebar ? (
        <div className="flex flex-col gap-1.5">
          <p className="text-[10px] font-bold uppercase tracking-widest text-[#1A1208]/30 px-1">
            {t('sortBy')}
          </p>
          <div className="flex gap-2">
            {(['recent', 'urgency'] as SortOption[]).map((opt) => (
              <button
                key={opt}
                onClick={() => onSortChange(opt)}
                aria-pressed={sortBy === opt}
                className={`flex-1 rounded-xl px-3 py-2 text-xs font-bold transition-all ${
                  sortBy === opt
                    ? 'bg-[#E8520A] text-white shadow-md'
                    : 'bg-[#F8F1EC] text-[#1A1208] hover:bg-[#FFF1E6]'
                }`}
              >
                {opt === 'recent' ? ` ${t('recent')}` : ` ${t('urgent')}`}
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div className="flex items-center gap-2 shrink-0">
          {(['recent', 'urgency'] as SortOption[]).map((opt) => (
            <button
              key={opt}
              onClick={() => onSortChange(opt)}
              aria-pressed={sortBy === opt}
              className={`rounded-full px-4 py-2 text-sm font-semibold transition-all whitespace-nowrap ${
                sortBy === opt
                  ? 'bg-[#E8520A] text-white shadow-md'
                  : 'bg-[#F8F1EC] text-[#1A1208] hover:bg-[#FFF1E6]'
              }`}
            >
              {opt === 'recent' ? `🕐 ${t('recent')}` : `🔥 ${t('urgent')}`}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
