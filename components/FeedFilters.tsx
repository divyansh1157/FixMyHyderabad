'use client'

import { SortOption } from '@/lib/types'

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
}

export default function FeedFilters({ area, sortBy, onAreaChange, onSortChange }: FeedFiltersProps) {
  return (
    <div className="grid gap-3 xl:grid-cols-[1.2fr_0.8fr] items-center bg-white/95 border border-[#1A1208]/10 p-4 rounded-[1.75rem] shadow-[0_18px_40px_rgba(26,18,8,0.05)]">
      <div className="relative">
        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-base">📍</span>
        <select
          value={area}
          onChange={(e) => onAreaChange(e.target.value)}
          className="w-full appearance-none bg-white border border-[#1A1208]/10 rounded-3xl pl-12 pr-9 py-3 text-sm font-semibold text-[#1A1208] focus:outline-none focus:border-[#E8520A] focus:ring-2 focus:ring-orange-200 transition"
        >
          {HYDERABAD_AREAS.map((a) => (
            <option key={a} value={a}>{a === 'All' ? 'All Neighborhoods' : a}</option>
          ))}
        </select>
        <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#1A1208]/40 pointer-events-none text-[9px]">▼</span>
      </div>

      {/* Grid Filter Sorting Toggles */}
      <div className="flex items-center gap-2 flex-wrap justify-end">
        <button
          onClick={() => onSortChange('recent')}
          aria-pressed={sortBy === 'recent'}
          className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
            sortBy === 'recent'
              ? 'bg-[#E8520A] text-white shadow-lg shadow-[#E8520A]/15'
              : 'bg-[#F8F1EC] text-[#1A1208] hover:bg-[#FFF1E6]'
          }`}
        >
          🕐 Recent
        </button>
        <button
          onClick={() => onSortChange('urgency')}
          aria-pressed={sortBy === 'urgency'}
          className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
            sortBy === 'urgency'
              ? 'bg-[#E8520A] text-white shadow-lg shadow-[#E8520A]/15'
              : 'bg-[#F8F1EC] text-[#1A1208] hover:bg-[#FFF1E6]'
          }`}
        >
          🔥 Urgent
        </button>
      </div>
    </div>
  );
}