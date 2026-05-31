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
  locale: string
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
      if (sortBy === 'urgency') {
        return (b.confirmations_count || 0) - (a.confirmations_count || 0)
      }
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    })

  return (
    /* ✅ FIXED: Added items-start to force the sidebar and main section to line up perfectly at the top margin */
    <div className="flex flex-col lg:flex-row items-start gap-6 w-full">
      
      {/* Sidebar Filter Control Panel */}
      <div className="w-full lg:w-64 shrink-0 lg:sticky lg:top-24 lg:h-fit bg-white border border-[#1A1208]/10 rounded-2xl p-5">
        <div className="hidden lg:block mb-5">
          <h1 className="text-xl font-black text-[#1A1208] tracking-tight" style={{ fontFamily: 'var(--font-syne), sans-serif' }}>
            {t('title')}
          </h1>
          <p className="text-[11px] text-[#1A1208]/50 font-semibold mt-1 leading-relaxed">
            {t('subtitle')}
          </p>
        </div>
        <FeedFilters
          area={area}
          sortBy={sortBy}
          onAreaChange={setArea}
          onSortChange={setSortBy}
          layout="sidebar"
        />
      </div>

      {/* Main Stream Activity Feed Container */}
      <div className="flex-1 min-w-0 w-full">
        {/* Mobile Feed Filter Controls Block */}
        <div className="lg:hidden mb-4">
          <FeedFilters area={area} sortBy={sortBy} onAreaChange={setArea} onSortChange={setSortBy} layout="inline" />
        </div>

        {/* Desktop feed header */}
        <div className="hidden lg:flex items-center justify-between mb-4">
          <h2 className="font-extrabold text-[#1A1208] text-base" style={{ fontFamily: 'var(--font-syne), sans-serif' }}>
            {t('openIssues', { count: filtered.length })}
          </h2>
          <span className="text-xs text-[#1A1208]/40 font-bold">{t('realtimeUpdate')}</span>
        </div>

        {/* Cards grid section */}
        {filtered.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-4xl mb-3">🎉</p>
            <p className="text-sm font-semibold text-[#1A1208]/50">{t('noIssues')}</p>
            <p className="text-xs mt-1 text-[#1A1208]/30">
              {area !== 'All' ? t('tryDifferentArea') : t('allClear')}
            </p>
          </div>
        ) : (
          /* ✅ STABLE RESPONSIVE AUTO-STRETCH GRID PACK */
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 w-full auto-rows-fr">
            {filtered.map((report, i) => (
              <div key={report.id} className="card-in w-full min-w-0 h-full" style={{ animationDelay: `${Math.min(i * 50, 200)}ms` }}>
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