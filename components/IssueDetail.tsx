'use client'

import React, { useState } from 'react'   // ← React imported at TOP, not bottom
import Image from 'next/image'
import { Report, Category } from '@/lib/types'
import { confirmIssue } from '@/lib/actions'
import { useTranslations } from 'next-intl'
import { getSessionId } from '@/lib/session'

const CAT: Record<Category, { emoji: string; pill: string }> = {
  Pothole:      { emoji: '🕳️', pill: 'bg-orange-50 text-orange-700 border-orange-200' },
  Garbage:      { emoji: '🗑️', pill: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  Waterlogging: { emoji: '🌊', pill: 'bg-blue-50 text-blue-700 border-blue-200' },
  Streetlight:  { emoji: '💡', pill: 'bg-amber-50 text-amber-700 border-amber-200' },
  Other:        { emoji: '📍', pill: 'bg-stone-100 text-stone-700 border-stone-200' },
}

const URGENCY = (n: number) => {
  if (n >= 20) return { label: 'CRITICAL', cls: 'bg-red-50 text-red-600 border-red-200' }
  if (n >= 10) return { label: 'HIGH',     cls: 'bg-orange-50 text-orange-600 border-orange-200' }
  if (n >= 5)  return { label: 'MODERATE', cls: 'bg-yellow-50 text-yellow-700 border-yellow-200' }
  return null
}

interface IssueDetailProps {
  report: Report
  isConfirmedInitial: boolean   // ← passed from page.tsx
}

export default function IssueDetail({ report, isConfirmedInitial }: IssueDetailProps) {
  const t  = useTranslations('details')
  const tc = useTranslations('categories')

  const [imgErr, setImgErr]       = useState(false)
  const [confirmed, setConfirmed] = useState(isConfirmedInitial)
  const [count, setCount]         = useState(report.confirmations_count)
  const [loading, setLoading]     = useState(false)

  const handleConfirm = async () => {
    if (confirmed || loading) return
    const sessionId = getSessionId()   // client-side, always works here
    if (!sessionId) return

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
    setLoading(false)
  }

  const timeAgo = (iso: string) => {
    const diff = Date.now() - new Date(iso).getTime()
    const m = Math.floor(diff / 60000)
    if (m < 1)  return t('justNow')
    if (m < 60) return t('minutesAgo', { m })
    const h = Math.floor(m / 60)
    if (h < 24) return t('hoursAgo', { h })
    return t('daysAgo', { d: Math.floor(h / 24) })
  }

  const cat     = CAT[report.category] ?? CAT.Other
  const urgency = URGENCY(count)

  return (
    <div className="space-y-4">

      {/* ── Main detail card ── */}
      <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-[#1A1208]/8">

        {/* Full-size image */}
        {report.image_url && !imgErr && (
          <div className="relative w-full h-72 sm:h-96 bg-[#FDFAF7]">
            <Image
              src={report.image_url}
              alt={report.title}
              fill
              className="object-cover"
              sizes="100vw"
              onError={() => setImgErr(true)}
              priority
            />
          </div>
        )}

        <div className="p-6 sm:p-8">

          {/* Badges */}
          <div className="flex items-center gap-2 flex-wrap mb-4">
            <span className={`text-xs font-bold uppercase tracking-wider px-3 py-1.5 rounded-md border ${cat.pill}`}>
              {cat.emoji} {tc(report.category as any)}
            </span>
            {urgency && (
              <span className={`text-xs font-bold uppercase tracking-wider px-3 py-1.5 rounded-md border ${urgency.cls}`}>
                {urgency.label}
              </span>
            )}
            <span className="ml-auto text-xs text-[#1A1208]/40 font-medium">
              {timeAgo(report.created_at)}
            </span>
          </div>

          {/* Title */}
          <h1
            className="font-extrabold text-[#1A1208] text-2xl sm:text-3xl leading-tight mb-3"
            style={{ fontFamily: 'var(--font-syne), sans-serif' }}
          >
            {report.title}
          </h1>

          {/* Address */}
          <p className="text-sm text-[#1A1208]/60 mb-4">
            📍 {report.address_text || report.area_name}
          </p>

          {/* Description */}
          {report.description && (
            <p className="text-base text-[#1A1208]/70 leading-relaxed mb-6 whitespace-pre-wrap">
              {report.description}
            </p>
          )}

          {/* Stats row */}
          <div className="border-t border-[#1A1208]/8 pt-6 grid grid-cols-3 gap-4">
            <div className="text-center">
              <p className="text-2xl font-extrabold text-[#E8520A]">👥 {count}</p>
              <p className="text-xs text-[#1A1208]/50 font-medium mt-1">{t('confirmations')}</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-extrabold text-[#1A1208]">📍</p>
              <p className="text-xs text-[#1A1208]/50 font-medium mt-1">{t('location')}</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-extrabold text-[#1A1208]">
                {report.status === 'active' ? '🟢' : report.status === 'in_review' ? '🔵' : '⚫'}
              </p>
              <p className="text-xs text-[#1A1208]/50 font-medium mt-1 capitalize">{report.status}</p>
            </div>
          </div>
        </div>
      </div>

      {/* ── CONFIRM BLOCK — this was the missing upvote button! ── */}
      <div className="bg-white border border-[#1A1208]/8 rounded-2xl p-5 shadow-sm">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div className="min-w-0">
            <h2
              className="font-extrabold text-[#1A1208] text-base mb-1"
              style={{ fontFamily: 'var(--font-syne), sans-serif' }}
            >
              {t('confirmTitle')}
            </h2>
            <p className="text-xs text-[#1A1208]/50 mb-2">{t('confirmSubtitle')}</p>
            <p className="text-sm font-bold text-[#1A1208]">
              👥 {t('peopleConfirmed', { count })}
            </p>
          </div>

          {/* THE CONFIRM BUTTON */}
          <button
            onClick={handleConfirm}
            disabled={confirmed || loading}
            className={`shrink-0 text-sm font-bold px-5 py-3 rounded-full border transition-all active:scale-95 ${
              confirmed
                ? 'bg-emerald-50 border-emerald-200 text-emerald-700 cursor-default'
                : loading
                  ? 'bg-[#E8520A]/40 text-white border-transparent cursor-wait'
                  : 'bg-[#E8520A] text-white border-transparent hover:bg-[#d4480a] shadow-md'
            }`}
          >
            {confirmed ? t('confirmedButton') : loading ? '…' : t('confirmButton')}
          </button>
        </div>

        {/* Progress bar toward 100 confirmations */}
        <div className="mt-4 bg-[#1A1208]/5 rounded-full h-1.5 overflow-hidden">
          <div
            className="bg-[#E8520A] h-full rounded-full transition-all duration-500"
            style={{ width: `${Math.min((count / 100) * 100, 100)}%` }}
          />
        </div>
        <p className="text-[10px] text-[#1A1208]/30 mt-1.5">
          {t('escalationNote', { count })}
        </p>
      </div>

    </div>
  )
}
