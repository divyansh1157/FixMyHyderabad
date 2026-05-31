'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useTranslations } from 'next-intl'
import { Report, Category } from '@/lib/types'
import { confirmIssue } from '@/lib/actions'

const CAT: Record<Category, { emoji: string; pill: string }> = {
  Pothole:      { emoji: '🕳️', pill: 'bg-orange-50 text-orange-700 border-orange-200' },
  Garbage:      { emoji: '🗑️', pill: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  Waterlogging: { emoji: '🌊', pill: 'bg-blue-50 text-blue-700 border-blue-200' },
  Streetlight:  { emoji: '💡', pill: 'bg-amber-50 text-amber-700 border-amber-200' },
  Other:        { emoji: '📍', pill: 'bg-stone-100 text-stone-700 border-stone-200' },
}

interface IssuePageClientProps {
  report: Report
  sessionId: string
  isConfirmedInitial: boolean
  locale: string
  comments: { id: string; text: string; created_at: string }[]
}

export default function IssuePageClient({
  report,
  sessionId,
  isConfirmedInitial,
  locale,
  comments: initialComments,
}: IssuePageClientProps) {
  const t  = useTranslations('issuePage')
  const tc = useTranslations('categories')
  const tcard = useTranslations('card')

  const [confirmed, setConfirmed] = useState(isConfirmedInitial)
  const [count, setCount]         = useState(report.confirmations_count)
  const [loading, setLoading]     = useState(false)
  const [imgErr, setImgErr]       = useState(false)
  const [comments, setComments]   = useState(initialComments)
  const [newComment, setNewComment] = useState('')
  const [posting, setPosting]     = useState(false)

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
    setLoading(false)
  }

  const handlePostComment = async () => {
    if (!newComment.trim() || posting) return
    setPosting(true)
    // TODO: wire this to your Supabase comments table
    // For now adds optimistically to local state
    setComments((prev) => [
      ...prev,
      { id: Date.now().toString(), text: newComment.trim(), created_at: new Date().toISOString() }
    ])
    setNewComment('')
    setPosting(false)
  }

  const timeAgo = (iso: string) => {
    const diff = Date.now() - new Date(iso).getTime()
    const m = Math.floor(diff / 60000)
    if (m < 1)  return tcard('justNow')
    if (m < 60) return tcard('minutesAgo', { m })
    const h = Math.floor(m / 60)
    if (h < 24) return tcard('hoursAgo', { h })
    return tcard('daysAgo', { d: Math.floor(h / 24) })
  }

  const cat = CAT[report.category] ?? CAT.Other

  return (
    <div className="max-w-2xl mx-auto space-y-5">

      {/* Back link */}
      <Link href={`/${locale}`} className="inline-flex items-center text-sm font-semibold text-[#E8520A] hover:underline">
        {t('back')}
      </Link>

      {/* Main card */}
      <div className="bg-white border border-[#1A1208]/8 rounded-2xl overflow-hidden shadow-sm">

        {/* Image */}
        {report.image_url && !imgErr && (
          <div className="relative w-full h-56 bg-[#FDFAF7]">
            <Image
              src={report.image_url}
              alt={report.title}
              fill
              className="object-cover"
              sizes="(max-width: 640px) 100vw, 672px"
              onError={() => setImgErr(true)}
            />
          </div>
        )}

        <div className="p-5 space-y-4">

          {/* Category badge + time */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md border ${cat.pill}`}>
              {cat.emoji} {tc(report.category as any)}
            </span>
            <span className="text-[10px] text-[#1A1208]/40 font-medium">{timeAgo(report.created_at)}</span>
          </div>

          {/* Title */}
          <h1 className="font-extrabold text-[#1A1208] text-xl leading-snug" style={{ fontFamily: 'var(--font-syne), sans-serif' }}>
            {report.title}
          </h1>

          {/* Meta info grid */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-[#FDFAF7] rounded-xl p-3">
              <p className="text-[10px] font-bold uppercase tracking-widest text-[#1A1208]/30 mb-1">{t('status')}</p>
              <div className="flex items-center gap-1.5">
                <span className={`w-2 h-2 rounded-full ${
                  report.status === 'active'    ? 'bg-green-500' :
                  report.status === 'in_review' ? 'bg-blue-500'  : 'bg-zinc-400'
                }`} />
                <span className="text-sm font-bold text-[#1A1208]">
                  {report.status === 'in_review' ? tcard('inReview') : tcard('active')}
                </span>
              </div>
            </div>
            <div className="bg-[#FDFAF7] rounded-xl p-3">
              <p className="text-[10px] font-bold uppercase tracking-widest text-[#1A1208]/30 mb-1">{t('area')}</p>
              <p className="text-sm font-bold text-[#1A1208]">📍 {report.area_name}</p>
            </div>
            {report.address_text && (
              <div className="col-span-2 bg-[#FDFAF7] rounded-xl p-3">
                <p className="text-[10px] font-bold uppercase tracking-widest text-[#1A1208]/30 mb-1">{t('landmark')}</p>
                <p className="text-sm font-medium text-[#1A1208]">{report.address_text}</p>
              </div>
            )}
          </div>

          {/* Description */}
          {report.description && (
            <p className="text-sm text-[#1A1208]/70 leading-relaxed">
              {report.description}
            </p>
          )}
        </div>
      </div>

      {/* ── CONFIRM BLOCK ── This is the upvote section that was missing! */}
      <div className="bg-white border border-[#1A1208]/8 rounded-2xl p-5 shadow-sm">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="font-extrabold text-[#1A1208] text-base mb-1" style={{ fontFamily: 'var(--font-syne), sans-serif' }}>
              {t('confirmTitle')}
            </h2>
            <p className="text-xs text-[#1A1208]/50">{t('confirmSubtitle')}</p>
            <p className="text-sm font-bold text-[#1A1208] mt-2">
              👥 {t('votes', { count })}
            </p>
          </div>

          <button
            onClick={handleConfirm}
            disabled={confirmed || loading || !sessionId}
            className={`shrink-0 text-sm font-bold px-5 py-2.5 rounded-full border transition-all active:scale-95 ${
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

        {/* Vote progress bar */}
        <div className="mt-4 bg-[#1A1208]/5 rounded-full h-1.5 overflow-hidden">
          <div
            className="bg-[#E8520A] h-full rounded-full transition-all duration-500"
            style={{ width: `${Math.min((count / 100) * 100, 100)}%` }}
          />
        </div>
        <p className="text-[10px] text-[#1A1208]/30 mt-1.5">{count}/100 confirmations for priority escalation</p>
      </div>

      {/* ── COMMENTS SECTION ── */}
      <div className="bg-white border border-[#1A1208]/8 rounded-2xl p-5 shadow-sm space-y-4">
        <h2 className="font-extrabold text-[#1A1208] text-base" style={{ fontFamily: 'var(--font-syne), sans-serif' }}>
          💬 {t('commentsTitle')} ({comments.length})
        </h2>

        {/* Add comment */}
        <div className="space-y-2">
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder={t('commentPlaceholder')}
            rows={3}
            className="w-full text-sm border border-[#1A1208]/10 rounded-xl p-3 resize-none focus:outline-none focus:border-[#E8520A] focus:ring-2 focus:ring-orange-200 transition text-[#1A1208] placeholder:text-[#1A1208]/30"
          />
          <button
            onClick={handlePostComment}
            disabled={!newComment.trim() || posting}
            className="text-xs font-bold px-4 py-2 bg-[#E8520A] text-white rounded-full disabled:opacity-40 hover:bg-[#d4480a] transition-all active:scale-95"
          >
            {posting ? '…' : t('submitComment')}
          </button>
        </div>

        {/* Comments list */}
        {comments.length === 0 ? (
          <p className="text-sm text-[#1A1208]/30 text-center py-6">{t('noComments')}</p>
        ) : (
          <div className="space-y-3">
            {comments.map((c) => (
              <div key={c.id} className="bg-[#FDFAF7] rounded-xl p-3">
                <p className="text-sm text-[#1A1208]/80 leading-relaxed">{c.text}</p>
                <p className="text-[10px] text-[#1A1208]/30 mt-1.5">{timeAgo(c.created_at)}</p>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  )
}
