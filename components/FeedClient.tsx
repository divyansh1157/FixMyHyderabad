'use client'

import { useEffect, useState } from 'react'
import { useTranslations } from 'next-intl'
import { Report, SortOption } from '@/lib/types'
import { getConfirmedBySession } from '@/lib/actions'
import { useRealtimeFeed } from '@/lib/realtime'
import { getSessionId } from '@/lib/session'
import ReportCard from './ReportCard'
import FeedFilters from './FeedFilters'

interface FeedClientProps {
  initialReports: Report[]
  initialConfirmedIds: string[]
  locale: string   // passed from page.tsx so cards know their locale for links
}

export default function FeedClient({ initialReports, initialConfirmedIds, locale }: FeedClientProps) {
  const t = useTranslations('feed')

  const [sessionId, setSessionId]       = useState<string>('')
  const [confirmedIds, setConfirmedIds] = useState<Set<string>>(new Set(initialConfirmedIds))
  const [area, setArea]                 = useState<string>('All')
  const [sortBy, setSortBy]             = useState<SortOption>('recent')

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

  const stats = [
    { label: t('statsOpen'),   value: filtered.length,                                      emoji: '📋' },
    { label: t('statsTotal'), value: reports?.length ?? 0,                                 emoji: '📊' },
    { label: t('statsAreas'),  value: new Set(reports?.map(r => r.area_name) ?? []).size,   emoji: '📍' },
  ]

  return (
    <div className="lg:grid lg:grid-cols-[280px_1fr] lg:gap-8 xl:grid-cols-[320px_1fr]">

      {/* ── SIDEBAR (desktop only) ── */}
      <aside className="hidden lg:flex flex-col gap-4 sticky top-24 self-start">
        <div className="bg-[#E8520A] rounded-2xl p-5 text-white shadow-md">
          <h1 className="font-extrabold text-2xl mb-2 tracking-tight leading-tight" style={{ fontFamily: 'var(--font-syne), sans-serif' }}>
            {t('title')}
          </h1>
          <p className="text-xs text-orange-50/90 leading-relaxed">{t('subtitle')}</p>
        </div>

        <div className="grid grid-cols-1 gap-2">
          {stats.map(({ label, value, emoji }) => (
            <div key={label} className="bg-white border border-[#1A1208]/8 rounded-xl px-4 py-3 flex items-center justify-between shadow-sm">
              <div className="flex items-center gap-2.5">
                <span className="text-lg">{emoji}</span>
                <span className="text-xs font-semibold text-[#1A1208]/50">{label}</span>
              </div>
              <span className="text-lg font-extrabold text-[#1A1208]" style={{ fontFamily: 'var(--font-syne), sans-serif' }}>
                {value}
              </span>
            </div>
          ))}
        </div>

        <FeedFilters area={area} sortBy={sortBy} onAreaChange={setArea} onSortChange={setSortBy} layout="sidebar" />

        <p className="text-[10px] text-[#1A1208]/30 leading-relaxed px-1">
          Data updates in real-time via Supabase. Issues are routed to GHMC for municipal action.
        </p>
      </aside>

      {/* ── MAIN FEED ── */}
      <div className="w-full space-y-4">

        {/* Mobile banner */}
        <div className="lg:hidden bg-[#E8520A] rounded-2xl p-5 text-white shadow-md">
          <h1 className="font-extrabold text-xl mb-1 tracking-tight leading-tight" style={{ fontFamily: 'var(--font-syne), sans-serif' }}>
            {t('title')}
          </h1>
          <p className="text-xs text-orange-50/90 leading-relaxed">{t('subtitle')}</p>
          <span className="inline-block mt-3 text-[10px] font-bold bg-white/20 px-2.5 py-1 rounded-full">
            {t('openIssues', { count: filtered.length })}
          </span>
        </div>

        {/* Mobile filters */}
        <div className="lg:hidden">
          <FeedFilters area={area} sortBy={sortBy} onAreaChange={setArea} onSortChange={setSortBy} layout="inline" />
        </div>

        {/* Desktop feed header */}
        <div className="hidden lg:flex items-center justify-between mb-2">
          <h2 className="font-extrabold text-[#1A1208] text-lg" style={{ fontFamily: 'var(--font-syne), sans-serif' }}>
            {t('openIssues', { count: filtered.length })}
          </h2>
          <span className="text-xs text-[#1A1208]/40 font-medium">{t('realtimeUpdate')}</span>
        </div>

        {/* Cards grid */}
        {filtered.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-4xl mb-3">🎉</p>
            <p className="text-sm font-semibold text-[#1A1208]/50">{t('noIssues')}</p>
            <p className="text-xs mt-1 text-[#1A1208]/30">
              {area !== 'All' ? t('tryDifferentArea') : t('allClear')}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {filtered.map((report, i) => (
              <div key={report.id} className="card-in" style={{ animationDelay: `${Math.min(i * 50, 200)}ms` }}>
                <ReportCard
                  report={report}
                  sessionId={sessionId}
                  isConfirmedInitial={confirmedIds.has(report.id)}
                  onConfirmStateChange={handleConfirmStateChange}
                  locale={locale}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
