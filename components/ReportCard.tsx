'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useTranslations } from 'next-intl'
import { Report, Category } from '@/lib/types'
import { confirmIssue } from '@/lib/actions'

const CAT: Record<Category, { emoji: string; label_key: string; pill: string }> = {
  Pothole:      { emoji: '🕳️', label_key: 'Pothole',      pill: 'bg-orange-50 text-orange-700 border-orange-200' },
  Garbage:      { emoji: '🗑️', label_key: 'Garbage',      pill: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  Waterlogging: { emoji: '🌊', label_key: 'Waterlogging', pill: 'bg-blue-50 text-blue-700 border-blue-200' },
  Streetlight:  { emoji: '💡', label_key: 'Streetlight',  pill: 'bg-amber-50 text-amber-700 border-amber-200' },
  Other:        { emoji: '📍', label_key: 'Other',        pill: 'bg-stone-100 text-stone-700 border-stone-200' },
}

const URGENCY = (n: number) => {
  if (n >= 20) return { label: 'CRITICAL', cls: 'bg-red-50 text-red-600 border-red-200' }
  if (n >= 10) return { label: 'HIGH',     cls: 'bg-orange-50 text-orange-600 border-orange-200' }
  if (n >= 5)  return { label: 'MODERATE', cls: 'bg-amber-50 text-amber-600 border-amber-200' }
  return { label: 'ROUTINE', cls: 'bg-slate-50 text-slate-600 border-slate-200' }
}

interface ReportCardProps {
  report: Report
  sessionId: string
  isConfirmedInitial: boolean
  onConfirmStateChange: (id: string) => void
  locale: string
}

export default function ReportCard({
  report,
  sessionId,
  isConfirmedInitial,
  onConfirmStateChange,
  locale,
}: ReportCardProps) {
  const t = useTranslations('card')
  const tc = useTranslations('categories')

  const [confirmed, setConfirmed] = useState(isConfirmedInitial)
  const [count, setCount]         = useState(report.confirmations_count || 0)
  const [loading, setLoading]     = useState(false)

  const handleConfirm = async () => {
    if (confirmed || loading || !sessionId) return
    setConfirmed(true)
    setCount((p) => p + 1)
    setLoading(true)
    
    const res = await confirmIssue(report.id, sessionId)
    if (!res.success && !res.already_confirmed) {
      setConfirmed(false)
      setCount((p) => Math.max(0, p - 1))
    } else if (res.new_count !== undefined) {
      setCount(res.new_count)
      if (onConfirmStateChange) onConfirmStateChange(report.id)
    }
    setLoading(false)
  }

  const cat = CAT[report.category] ?? CAT.Other
  const urg = URGENCY(count)

  return (
    <div className="bg-white border border-[#1A1208]/10 rounded-2xl p-4 flex flex-col justify-between hover:shadow-md transition-all text-start w-full min-w-0 h-full">
      <div>
        {/* Category Header */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full border flex items-center gap-1 ${cat.pill}`}>
            <span className="inline-block select-none text-sm leading-none">{cat.emoji}</span> 
            <span>{tc(cat.label_key)}</span>
          </span>
          <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full border tracking-wide uppercase ${urg.cls}`}>
            {urg.label}
          </span>
        </div>

        {/* Location Row */}
        <p className="text-xs font-semibold text-[#1A1208]/40 mb-2 flex items-center gap-1">
          <span className="text-xs select-none">📍</span> {report.area_name}
        </p>

        {/* Description */}
        <h3 className="text-sm font-bold text-[#1A1208] leading-snug break-words mb-4 antialiased">
          {report.description}
        </h3>
      </div>

      {/* Action Footer Group */}
      <div className="space-y-3 pt-2.5 border-t border-[#1A1208]/5 w-full mt-auto">
        <div className="flex items-center justify-between gap-2">
          
          {/* Status Label */}
          <div className="flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider text-[#1A1208]/40 whitespace-nowrap">
            <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${report.status === 'in_review' ? 'bg-amber-500' : 'bg-emerald-500'}`} />
            {report.status === 'in_review' ? t('inReview') : t('active')}
          </div>

          {/* Voting Button Group */}
          <div className="flex items-center gap-1.5 min-w-0">
            <span className="text-[11px] font-bold text-[#1A1208]/60 tabular-nums whitespace-nowrap flex items-center gap-0.5 shrink-0">
              <span className="text-xs select-none">👥</span> {count}
            </span>
            
            <button
              onClick={handleConfirm}
              disabled={confirmed || loading}
              /* ✅ FIXED: Shrunk font size to text-[11px], standardized structure rules to stop button explosions */
              className={`text-[11px] font-extrabold px-2.5 py-1.5 rounded-full border transition-all active:scale-95 whitespace-nowrap flex items-center gap-1 cursor-pointer select-none max-w-full ${
                confirmed
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-700 cursor-default'
                  : loading
                    ? 'bg-[#E8520A]/40 text-white border-transparent cursor-wait'
                    : 'bg-[#E8520A] text-white border-transparent hover:bg-[#d4480a] shadow-sm'
              }`}
            >
              <span className="text-xs leading-none shrink-0">{confirmed ? '✓' : '👍'}</span>
              <span className="truncate">{confirmed ? t('confirmed') : loading ? '…' : t('confirm')}</span>
            </button>
          </div>
        </div>

        <Link
          href={`/${locale}/issues/${report.id}`}
          className="block text-center text-[11px] font-bold text-[#E8520A] hover:underline transition-all"
        >
          {t('viewDetails')} →
        </Link>
      </div>
    </div>
  )
}