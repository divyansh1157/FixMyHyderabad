'use client'

import { useEffect, useState } from 'react'
import { Report, SortOption } from '@/lib/types'
import { getConfirmedBySession } from '@/lib/actions'
import { useRealtimeFeed } from '@/lib/realtime'
import { getSessionId } from '@/lib/session'
import ReportCard from './ReportCard'
import FeedFilters from './FeedFilters'

interface FeedClientProps {
  initialReports: Report[]
  initialConfirmedIds: string[]
}

export default function FeedClient({ initialReports, initialConfirmedIds }: FeedClientProps) {
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

  return (
    <div className="w-full space-y-4">

      {/* ── Welcome banner ── */}
      <div className="bg-[#E8520A] rounded-2xl p-5 text-white shadow-md">
        <h1
          className="font-extrabold text-xl mb-1 tracking-tight leading-tight"
          style={{ fontFamily: 'var(--font-syne), sans-serif' }}
        >
          Live Incidents Tracker
        </h1>
        <p className="text-xs text-orange-50/90 leading-relaxed">
          Monitor community submissions across Hyderabad areas in real-time.
          Confirm incidents to accelerate municipal verification routing.
        </p>
        <span className="inline-block mt-3 text-[10px] font-bold bg-white/20 px-2.5 py-1 rounded-full">
          {filtered.length} open issue{filtered.length !== 1 ? 's' : ''} tracked
        </span>
      </div>

      {/* ── Filters ── */}
      <FeedFilters
        area={area}
        sortBy={sortBy}
        onAreaChange={setArea}
        onSortChange={setSortBy}
      />

      {/* ── Feed ── */}
      {filtered.length === 0 ? (
        <div className="text-center py-20 text-[#1A1208]/30">
          <p className="text-4xl mb-3">🎉</p>
          <p className="text-sm font-semibold text-[#1A1208]/50">No open issues here</p>
          <p className="text-xs mt-1">
            {area !== 'All' ? 'Try a different area' : 'All clear in Hyderabad!'}
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
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
  )
}
