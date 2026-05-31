'use client'

import Image from 'next/image'
import { Report, Category } from '@/lib/types'
import { useTranslations } from 'next-intl'

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
}

export default function IssueDetail({ report }: IssueDetailProps) {
  const t = useTranslations('details')
  const tc = useTranslations('categories')
  const [imgErr, setImgErr] = React.useState(false)

  const timeAgo = (iso: string) => {
    const diff = Date.now() - new Date(iso).getTime()
    const m = Math.floor(diff / 60000)
    if (m < 1)  return t('justNow')
    if (m < 60) return t('minutesAgo', { m })
    const h = Math.floor(m / 60)
    if (h < 24) return t('hoursAgo', { h })
    return t('daysAgo', { d: Math.floor(h / 24) })
  }

  const cat = CAT[report.category] ?? CAT.Other
  const urgency = URGENCY(report.confirmations_count)

  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-[#1A1208]/8">
      {/* Full-size image */}
      {report.image_url && !imgErr && (
        <div className="relative w-full h-96 sm:h-[500px] bg-[#FDFAF7]">
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

      {/* Content */}
      <div className="p-6 sm:p-8">
        {/* Badges */}
        <div className="flex items-center gap-2 flex-wrap mb-4">
          <span className={`text-xs font-bold uppercase tracking-wider px-3 py-1.5 rounded-md border ${cat.pill}`}>
            {cat.emoji} {tc(report.category)}
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

        {/* Stats */}
        <div className="border-t border-[#1A1208]/8 pt-6 grid grid-cols-3 gap-4">
          <div className="text-center">
            <p className="text-2xl font-extrabold text-[#E8520A]">
              👥 {report.confirmations_count}
            </p>
            <p className="text-xs text-[#1A1208]/50 font-medium mt-1">
              {t('confirmations')}
            </p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-extrabold text-[#1A1208]">
              📍
            </p>
            <p className="text-xs text-[#1A1208]/50 font-medium mt-1">
              {t('location')}
            </p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-extrabold text-[#1A1208]">
              {report.status === 'active' ? '🟢' : report.status === 'in_review' ? '🔵' : '⚫'}
            </p>
            <p className="text-xs text-[#1A1208]/50 font-medium mt-1">
              {report.status}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

import React from 'react'
