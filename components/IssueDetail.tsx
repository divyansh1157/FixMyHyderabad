'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import { Report, Category } from '@/lib/types'
import { confirmIssue } from '@/lib/actions'
import { useTranslations } from 'next-intl'

const CAT: Record<Category, { emoji: string; pill: string }> = {
  Pothole:      { emoji: '🕳️', pill: 'bg-orange-50 text-orange-700 border-orange-200' },
  Garbage:      { emoji: '🗑️', pill: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  Waterlogging: { emoji: '🌊', pill: 'bg-blue-50 text-blue-700 border-blue-200' },
  Streetlight:  { emoji: '💡', pill: 'bg-amber-50 text-amber-700 border-amber-200' },
  Other:        { emoji: '📍', pill: 'bg-stone-100 text-stone-700 border-stone-200' },
}

interface IssueDetailProps {
  report: Report
  sessionId: string
  isConfirmedInitial: boolean
}

export default function IssueDetail({
  report,
  sessionId,
  isConfirmedInitial,
}: IssueDetailProps) {
  const t = useTranslations('details')
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
      // Fixed property check mapping to match backend shape
      setCount(res.new_count)
    }
    setLoading(false)
  }

  const cat = CAT[report.category] || CAT.Other

  return (
    <div className="bg-white border border-[#1A1208]/10 rounded-2xl p-6 shadow-sm space-y-6 text-start">
      {/* Detail Core Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <span className={`text-xs font-bold px-3 py-1 rounded-full border ${cat.pill}`}>
          {cat.emoji} {report.category}
        </span>
        <div className="flex items-center gap-1.5 text-xs font-semibold text-[#1A1208]/50 uppercase tracking-wider">
          <span className={`w-2 h-2 rounded-full ${report.status === 'in_review' ? 'bg-amber-500' : 'bg-emerald-500'}`} />
          {report.status === 'in_review' ? 'In Review' : 'Active'}
        </div>
      </div>

      {/* Description Meta */}
      <div className="space-y-2">
        <p className="text-xs font-bold text-[#1A1208]/40 uppercase tracking-wider">
          {t('location')}
        </p>
        <p className="text-base font-bold text-[#1A1208]">
          📍 {report.area_name}
        </p>
        <p className="text-sm text-[#1A1208]/80 leading-relaxed break-words pt-2">
          {report.description}
        </p>
      </div>

      {/* Image Block Canvas if exists */}
      {report.image_url && (
        <div className="relative w-full aspect-video rounded-xl overflow-hidden bg-stone-100 border border-[#1A1208]/5">
          <Image
            src={report.image_url}
            alt="Civic issue proof visual input documentation"
            fill
            className="object-cover"
            sizes="(max-w-7xl) 100vw"
            priority
          />
        </div>
      )}

      {/* Verification Vote Panel Canvas */}
      <div className="bg-[#FDFAF7] border border-[#1A1208]/5 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="space-y-1">
          <h4 className="text-sm font-bold text-[#1A1208]">
            {t('confirmTitle')}
          </h4>
          <p className="text-xs text-[#1A1208]/50">
            {t('confirmSubtitle')}
          </p>
          <p className="text-xs font-bold text-[#1A1208] pt-1">
            👥 {t('peopleConfirmed', { count })}
          </p>
        </div>

        <button
          onClick={handleConfirm}
          disabled={confirmed || loading}
          className={`text-xs font-bold px-5 py-3 rounded-full border transition-all active:scale-95 whitespace-nowrap cursor-pointer select-none ${
            confirmed
              ? 'bg-emerald-50 border-emerald-200 text-emerald-700 cursor-default'
              : loading
                ? 'bg-[#E8520A]/40 text-white border-transparent cursor-wait'
                : 'bg-[#E8520A] text-white border-transparent hover:bg-[#d4480a] shadow-sm'
          }`}
        >
          {confirmed ? t('confirmedButton') : loading ? '…' : t('confirmButton')}
        </button>
      </div>

      {/* Escalation Progress Tracker Component Bar */}
      <div className="space-y-1.5">
        <div className="w-full bg-[#1A1208]/5 h-2 rounded-full overflow-hidden">
          <div
            className="bg-[#E8520A] h-full rounded-full transition-all duration-500"
            style={{ width: `${Math.min((count / 100) * 100, 100)}%` }}
          />
        </div>
        <p className="text-[10px] font-semibold text-[#1A1208]/40 text-end tracking-wide">
          {t('escalationNote', { count })}
        </p>
      </div>
    </div>
  )
}