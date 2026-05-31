'use client'

import { useTranslations } from 'next-intl'
import { SortOption } from '@/lib/types'

interface FeedFiltersProps {
  area: string
  sortBy: SortOption
  onAreaChange: (area: string) => void
  onSortChange: (sort: SortOption) => void
  layout: 'sidebar' | 'inline'
}

// A complete list of target Hyderabad sectors for filtering
const AREAS = [
  'All', 'Madhapur', 'Gachibowli', 'Kondapur', 'Kukatpally', 
  'Ameerpet', 'Banjara Hills', 'Jubilee Hills', 'Dilsukhnagar', 'LB Nagar', 'Miyapur', 'SR Nagar'
]

export default function FeedFilters({
  area,
  sortBy,
  onAreaChange,
  onSortChange,
  layout
}: FeedFiltersProps) {
  const t = useTranslations('feed')

  if (layout === 'inline') {
    return (
      <div className="flex flex-col gap-3 w-full bg-white border border-[#1A1208]/10 rounded-2xl p-4">
        <div>
          <label className="text-[11px] font-bold text-[#1A1208]/40 uppercase tracking-wider block mb-1">
            📍 {t('filterByArea') || 'Neighborhood'}
          </label>
          <select
            value={area}
            onChange={(e) => onAreaChange(e.target.value)}
            className="w-full text-xs font-semibold text-[#1A1208] bg-stone-50 border border-[#1A1208]/10 rounded-xl px-3 py-2.5 focus:outline-hidden focus:ring-1 focus:ring-[#E8520A]/30"
          >
            {AREAS.map((item) => (
              <option key={item} value={item}>
                {item === 'All' ? t('allNeighborhoods') || 'All Neighborhoods' : item}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="text-[11px] font-bold text-[#1A1208]/40 uppercase tracking-wider block mb-1.5">
            ⚖️ {t('sortBy') || 'Sort By'}
          </label>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => onSortChange('recent')}
              className={`text-xs font-bold py-2 px-3 rounded-xl border transition-all text-center flex items-center justify-center gap-1 ${
                sortBy === 'recent'
                  ? 'bg-blue-600 border-blue-600 text-white'
                  : 'bg-white border-[#1A1208]/10 text-[#1A1208]/70 hover:bg-stone-50'
              }`}
            >
              <span>🕒</span> <span>{t('sortRecent') || 'Recent'}</span>
            </button>
            <button
              onClick={() => onSortChange('urgency')}
              className={`text-xs font-bold py-2 px-3 rounded-xl border transition-all text-center flex items-center justify-center gap-1 ${
                sortBy === 'urgency'
                  ? 'bg-blue-600 border-blue-600 text-white'
                  : 'bg-white border-[#1A1208]/10 text-[#1A1208]/70 hover:bg-stone-50'
              }`}
            >
              <span>🔥</span> <span>{t('sortUrgency') || 'Urgent'}</span>
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-5 w-full text-start">
      {/* Area Selector Segment */}
      <div>
        <label className="text-[11px] font-extrabold text-[#1A1208]/40 uppercase tracking-wider block mb-2 flex items-center gap-1">
          <span>📍</span> <span>{t('filterByArea') || 'All Neighborhoods'}</span>
        </label>
        <select
          value={area}
          onChange={(e) => onAreaChange(e.target.value)}
          className="w-full text-xs font-bold text-[#1A1208] bg-stone-50/50 border border-[#1A1208]/10 rounded-xl px-3 py-2.5 cursor-pointer focus:outline-hidden focus:ring-1 focus:ring-[#E8520A]/30"
        >
          {AREAS.map((item) => (
            <option key={item} value={item}>
              {item === 'All' ? t('allNeighborhoods') || 'All Neighborhoods' : item}
            </option>
          ))}
        </select>
      </div>

      {/* Sorting Strategy Toggle Grid */}
      <div>
        <label className="text-[11px] font-extrabold text-[#1A1208]/40 uppercase tracking-wider block mb-2 flex items-center gap-1">
          <span>⚖️</span> <span>{t('sortBy') || 'Sort By'}</span>
        </label>
        <div className="space-y-2">
          {/* ✅ FIXED: Render real unicode icons 🕒 and 🔥 instead of typing text labels inside the layout */}
          <button
            onClick={() => onSortChange('recent')}
            className={`w-full text-xs font-bold py-2.5 px-4 rounded-xl border transition-all flex items-center gap-2 cursor-pointer ${
              sortBy === 'recent'
                ? 'bg-blue-600 border-blue-600 text-white shadow-xs'
                : 'bg-white border-[#1A1208]/10 text-[#1A1208]/70 hover:bg-stone-50'
            }`}
          >
            <span className="text-sm leading-none">🕒</span>
            <span>{t('sortRecent') || 'Recent'}</span>
          </button>

          <button
            onClick={() => onSortChange('urgency')}
            className={`w-full text-xs font-bold py-2.5 px-4 rounded-xl border transition-all flex items-center gap-2 cursor-pointer ${
              sortBy === 'urgency'
                ? 'bg-blue-600 border-blue-600 text-white shadow-xs'
                : 'bg-white border-[#1A1208]/10 text-[#1A1208]/70 hover:bg-stone-50'
            }`}
          >
            <span className="text-sm leading-none">🔥</span>
            <span>{t('sortUrgency') || 'Urgent'}</span>
          </button>
        </div>
      </div>
    </div>
  )
}