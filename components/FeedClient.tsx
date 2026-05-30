'use client'

import { useEffect, useState } from 'react'
import { Report, SortOption } from '@/lib/types'
import { getConfirmedBySession } from '@/lib/actions'
import { useRealtimeFeed } from '@/lib/realtime'
import { getSessionId } from '@/lib/session'
import ReportCard from './ReportCard'
import FeedFilters from './FeedFilters'
import { useTranslations } from 'next-intl'

interface FeedClientProps {
  initialReports: Report[]
  initialConfirmedIds: string[]
}

export default function FeedClient({ initialReports, initialConfirmedIds }: FeedClientProps) {
  const [sessionId, setSessionId]       = useState<string>('')
  const [confirmedIds, setConfirmedIds] = useState<Set<string>>(new Set(initialConfirmedIds))
  const [area, setArea]                 = useState<string>('All')
  const [sortBy, setSortBy]             = useState<SortOption>('recent')
  const t = useTranslations('feed')
  
  const reports = useRealtimeFeed(initialReports)

  useEffect(() => {
    const sid = getSessionId()
    setSessionId(sid)
    getConfirmedBySession(sid).then((ids) => setConfirmedIds(new Set(ids)))
  }, [])

  const handleConfirmStateChange = (id: string) => {
    setConfirmedIds((prev) => new Set(prev).add(id))
  }

  const filtered = (reports || [])
    .filter((r) => area === 'All' || r.area_name === area)
    .sort((a, b) => {
      if (sortBy === 'urgency')
        return (b.confirmations_count || 0) - (a.confirmations_count || 0)
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    })

  // ── SEGMENT: STATS — quick numbers shown in the sidebar on desktop
  // Add/remove stat objects here to change what's displayed
  const stats = [
    { label: 'Open Issues',  value: filtered.length,                          emoji: '📋' },
    { label: 'Total Reports',value: reports?.length ?? 0,                     emoji: '📊' },
    { label: 'Areas Active', value: new Set(reports?.map(r => r.area_name) ?? []).size, emoji: '📍' },
  ]

  return (
    // ── SEGMENT: PAGE LAYOUT ─────────────────────────────────────────────
    // lg:grid-cols-[280px_1fr] = sidebar + feed on desktop
    // Change 280px to make sidebar wider/narrower
    // Remove lg:grid-cols-... to go single-column everywhere
    // ─────────────────────────────────────────────────────────────────────
    <div className="lg:grid lg:grid-cols-[280px_1fr] lg:gap-8 xl:grid-cols-[320px_1fr]">

      {/* ── SEGMENT: SIDEBAR (desktop only) ──────────────────────────────
          Hidden on mobile/tablet. Shows on lg+ screens.
          Move anything here you want pinned on the left on desktop.
      ──────────────────────────────────────────────────────────────── */}
      <aside className="hidden lg:flex flex-col gap-4 sticky top-24 self-start">

        {/* Banner — condensed version of the mobile banner */}
        <div className="bg-[#E8520A] rounded-2xl p-5 text-white shadow-md">
          <h1
            className="font-extrabold text-2xl mb-2 tracking-tight leading-tight"
            style={{ fontFamily: 'var(--font-syne), sans-serif' }}
          >
            Live Incidents Tracker
          </h1>
          <p className="text-xs text-orange-50/90 leading-relaxed">
            Monitor community submissions across Hyderabad in real-time.
            Confirm incidents to accelerate municipal verification routing.
          </p>
        </div>

        {/* Stats cards */}
        <div className="grid grid-cols-1 gap-2">
          {stats.map(({ label, value, emoji }) => (
            <div
              key={label}
              className="bg-white border border-[#1A1208]/8 rounded-xl px-4 py-3 flex items-center justify-between shadow-sm"
            >
              <div className="flex items-center gap-2.5">
                <span className="text-lg">{emoji}</span>
                <span className="text-xs font-semibold text-[#1A1208]/50">{label}</span>
              </div>
              <span
                className="text-lg font-extrabold text-[#1A1208]"
                style={{ fontFamily: 'var(--font-syne), sans-serif' }}
              >
                {value}
              </span>
            </div>
          ))}
        </div>

        {/* Filters — pinned in sidebar on desktop */}
        <FeedFilters
          area={area}
          sortBy={sortBy}
          onAreaChange={setArea}
          onSortChange={setSortBy}
          layout="sidebar"
        />

        {/* ── SEGMENT: SIDEBAR FOOTER ─────────────────────────────────────
            Great place to add: about text, links, social, etc.
        ──────────────────────────────────────────────────────────────── */}
        <div className="text-[10px] text-[#1A1208]/30 leading-relaxed px-1">
          Data updates in real-time via Supabase. Issues are routed to GHMC for municipal action.
        </div>

      </aside>

      {/* ── SEGMENT: MAIN FEED COLUMN ────────────────────────────────────
          This is what both mobile and desktop see (sidebar is extra on lg+)
      ──────────────────────────────────────────────────────────────── */}
      <div className="w-full space-y-4">

        {/* Mobile-only banner (hidden on desktop where sidebar shows it) */}
        <div className="lg:hidden bg-[#E8520A] rounded-2xl p-5 text-white shadow-md">
          <h1
            className="font-extrabold text-xl mb-1 tracking-tight leading-tight"
            style={{ fontFamily: 'var(--font-syne), sans-serif' }}
          >
            Live Incidents Tracker
          </h1>
          <p className="text-xs text-orange-50/90 leading-relaxed">
            Monitor community submissions across Hyderabad areas in real-time.
          </p>
          <span className="inline-block mt-3 text-[10px] font-bold bg-white/20 px-2.5 py-1 rounded-full">
            {filtered.length} open issue{filtered.length !== 1 ? 's' : ''} tracked
          </span>
        </div>

        {/* Mobile-only filters (desktop sees them in sidebar) */}
        <div className="lg:hidden">
          <FeedFilters
            area={area}
            sortBy={sortBy}
            onAreaChange={setArea}
            onSortChange={setSortBy}
            layout="inline"
          />
        </div>

        {/* Desktop feed header */}
        <div className="hidden lg:flex items-center justify-between mb-2">
          <h2
            className="font-extrabold text-[#1A1208] text-lg"
            style={{ fontFamily: 'var(--font-syne), sans-serif' }}
          >
            {filtered.length} open issue{filtered.length !== 1 ? 's' : ''}
          </h2>
          <span className="text-xs text-[#1A1208]/40 font-medium">
            Updates in real-time
          </span>
        </div>

        {/* ── SEGMENT: FEED GRID ──────────────────────────────────────────
            Mobile: single column
            md (tablet): 2 columns
            xl (wide desktop): 3 columns (uncomment xl:grid-cols-3 below)
            Change grid-cols-* to adjust the layout
        ──────────────────────────────────────────────────────────────── */}
        {filtered.length === 0 ? (
          <div className="text-center py-20 text-[#1A1208]/30">
            <p className="text-4xl mb-3">🎉</p>
            <p className="text-sm font-semibold text-[#1A1208]/50">No open issues here</p>
            <p className="text-xs mt-1">
              {area !== 'All' ? 'Try a different area' : 'All clear in Hyderabad!'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 xl:grid-cols-2">
            {filtered.map((report, i) => (
              <div
                key={report.id}
                className="card-in"
                style={{ animationDelay: `${Math.min(i * 50, 200)}ms` }}
              >
                <ReportCard
                  report={report}
                  sessionId={sessionId}
                  isConfirmedInitial={confirmedIds.has(report.id)}
                  onConfirmStateChange={handleConfirmStateChange}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
