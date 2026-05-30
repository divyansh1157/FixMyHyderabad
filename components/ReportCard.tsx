'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Report, Category } from '@/lib/types'
import { confirmIssue } from '@/lib/actions'
import { useTranslations } from 'next-intl'

// ── SEGMENT: CATEGORY CONFIG ─────────────────────────────────────────────────
const CAT: Record<Category, { emoji: string; pill: string }> = {
  Pothole:      { emoji: '🕳️', pill: 'bg-orange-50 text-orange-700 border-orange-200' },
  Garbage:      { emoji: '🗑️', pill: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  Waterlogging: { emoji: '🌊', pill: 'bg-blue-50 text-blue-700 border-blue-200' },
  Streetlight:  { emoji: '💡', pill: 'bg-amber-50 text-amber-700 border-amber-200' },
  Other:        { emoji: '📍', pill: 'bg-stone-100 text-stone-700 border-stone-200' },
}

// ── SEGMENT: URGENCY THRESHOLDS ──────────────────────────────────────────────
const URGENCY = (n: number) => {
  if (n >= 20) return { label: 'CRITICAL', cls: 'bg-red-50 text-red-600 border-red-200' }
  if (n >= 10) return { label: 'HIGH',     cls: 'bg-orange-50 text-orange-600 border-orange-200' }
  if (n >= 5)  return { label: 'MODERATE', cls: 'bg-yellow-50 text-yellow-700 border-yellow-200' }
  return null
}

interface ReportCardProps {
  report: Report
  sessionId: string
  isConfirmedInitial: boolean
  onConfirmStateChange: (id: string) => void
}

export default function ReportCard({
  report,
  sessionId,
  isConfirmedInitial,
  onConfirmStateChange,
}: ReportCardProps) {
  const [confirmed, setConfirmed] = useState(isConfirmedInitial)
  const [count, setCount]         = useState(report.confirmations_count)
  const [loading, setLoading]     = useState(false)
  const [imgErr, setImgErr]       = useState(false)
  const t  = useTranslations('card')
  const tc = useTranslations('categories')

  // ── Time ago using translations ──────────────────────────────────────────
  const timeAgo = (iso: string) => {
    const diff = Date.now() - new Date(iso).getTime()
    const m = Math.floor(diff / 60000)
    if (m < 1)  return t('justNow')
    if (m < 60) return t('minutesAgo', { m })
    const h = Math.floor(m / 60)
    if (h < 24) return t('hoursAgo', { h })
    return t('daysAgo', { d: Math.floor(h / 24) })
  }

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
    }
    onConfirmStateChange(report.id)
    setLoading(false)
  }

  const cat     = CAT[report.category] ?? CAT.Other
  const urgency = URGENCY(count)

  return (
    <div className="bg-white border border-[#1A1208]/8 rounded-2xl overflow-hidden shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 h-full flex flex-col">

      {/* Card image */}
      {report.image_url && !imgErr && (
        <div className="relative w-full h-36 sm:h-44 bg-[#FDFAF7] shrink-0">
          <Image
            src={report.image_url}
            alt={report.title}
            fill
            className="object-cover"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 400px"
            onError={() => setImgErr(true)}
          />
        </div>
      )}

      <div className="p-4 flex flex-col flex-1">

        {/* Badges row */}
        <div className="flex items-center gap-1.5 flex-wrap mb-2.5">
          <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md border ${cat.pill}`}>
            {cat.emoji} {tc(report.category)}
          </span>
          {urgency && (
            <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md border ${urgency.cls}`}>
              {urgency.label}
            </span>
          )}
          <span className="ml-auto text-[10px] text-[#1A1208]/40 font-medium shrink-0">
            {timeAgo(report.created_at)}
          </span>
        </div>

        {/* Title */}
        <h3
          className="font-extrabold text-[#1A1208] text-base leading-snug mb-1"
          style={{ fontFamily: 'var(--font-syne), sans-serif' }}
        >
          {report.title}
        </h3>

        {/* Address */}
        <p className="text-[11px] text-[#1A1208]/45 font-medium mb-1">
          📍 {report.address_text || report.area_name}
        </p>

        {/* Description */}
        {report.description && (
          <p className="text-xs text-[#1A1208]/60 leading-relaxed line-clamp-2 mb-3">
            {report.description}
          </p>
        )}

        <div className="flex-1" />

        {/* Card footer */}
        <div className="border-t border-[#1A1208]/6 pt-3 flex items-center justify-between gap-2">
          {/* Status */}
          <div className="flex items-center gap-1.5">
            <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${
              report.status === 'active'    ? 'bg-green-500' :
              report.status === 'in_review' ? 'bg-blue-500'  : 'bg-zinc-400'
            }`} />
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#1A1208]/50">
              {report.status === 'in_review' ? t('inReview') :
               report.status === 'active'    ? t('active')   : t('active')}
            </span>
          </div>

          {/* Votes + Confirm */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-[#1A1208]/70 tabular-nums whitespace-nowrap">
              👥 {count === 1 ? t('vote') : t('votes', { count })}
            </span>
            <button
              onClick={handleConfirm}
              disabled={confirmed || loading}
              className={`text-xs font-bold px-3.5 py-1.5 rounded-full border transition-all active:scale-95 whitespace-nowrap ${
                confirmed
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-700 cursor-default'
                  : loading
                    ? 'bg-[#E8520A]/40 text-white border-transparent cursor-wait'
                    : 'bg-[#E8520A] text-white border-transparent hover:bg-[#d4480a] shadow-sm'
              }`}
            >
              {confirmed ? `✓ ${t('confirmed')}` : loading ? '…' : `👍 ${t('confirm')}`}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
