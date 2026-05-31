'use client'

import { useState } from 'react'
import { Comment } from '@/lib/types'
import { addComment } from '@/lib/actions'
import { useTranslations } from 'next-intl'

interface CommentsSectionProps {
  reportId: string
  sessionId: string
  initialComments: Comment[]
}

export default function CommentsSection({
  reportId,
  sessionId,
  initialComments,
}: CommentsSectionProps) {
  const t = useTranslations('comments')
  const [comments, setComments] = useState<Comment[]>(initialComments)
  const [name, setName] = useState('')
  const [content, setContent] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const timeAgo = (iso: string) => {
    const diff = Date.now() - new Date(iso).getTime()
    const m = Math.floor(diff / 60000)
    if (m < 1) return t('justNow')
    if (m < 60) return t('minutesAgo', { m })
    const h = Math.floor(m / 60)
    if (h < 24) return t('hoursAgo', { h })
    return t('daysAgo', { d: Math.floor(h / 24) })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!content.trim()) {
      setError('Comment field cannot be empty')
      return
    }

    setLoading(true)
    const res = await addComment(reportId, sessionId, content.trim(), name.trim() || undefined)
    if (res.success && res.comment) {
      setComments((prev) => [res.comment as Comment, ...prev])
      setContent('')
      setName('')
    } else {
      setError('Could not submit update. Please try again.')
    }
    setLoading(false)
  }

  return (
    <div className="space-y-5 text-start">
      <h3 className="text-base font-extrabold text-slate-900 pb-2 border-b border-slate-200">
        📢 {t('title')} ({comments.length})
      </h3>

      {/* Accessible Input Form */}
      <form onSubmit={handleSubmit} className="space-y-3">
        <div>
          <label className="block text-xs font-extrabold text-slate-600 uppercase tracking-wider mb-1">
            {t('nameLabel')}
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Anand Kumar"
            maxLength={50}
            className="w-full bg-slate-50 border-2 border-slate-200 rounded-lg px-3 py-2.5 text-sm font-bold text-slate-900 focus:border-blue-700 focus:ring-1 focus:ring-blue-700 outline-none h-12"
          />
        </div>

        <div>
          <label className="block text-xs font-extrabold text-slate-600 uppercase tracking-wider mb-1">
            Grievance Update / Context Details
          </label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder={t('contentLabel')}
            rows={3}
            maxLength={500}
            className="w-full bg-slate-50 border-2 border-slate-200 rounded-lg p-3 text-sm font-bold text-slate-900 focus:border-blue-700 focus:ring-1 focus:ring-blue-700 outline-none resize-none min-h-[90px]"
          />
          
          {/* FIXED JSX STRUCTURAL BLOCK FOR ERROR / COUNTER MAPS */}
          <div className="flex justify-between items-center mt-1 text-xs">
            <div className="text-red-600 font-bold">
              {error ? error : ""}
            </div>
            <div className="text-[10px] font-bold text-slate-400 ms-auto">
              {content.length}/500
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading || !content.trim()}
          className="w-full bg-blue-800 hover:bg-blue-900 disabled:bg-slate-200 disabled:border-slate-300 disabled:text-slate-400 text-white font-extrabold py-3 rounded-lg text-xs uppercase tracking-wider transition-all border-2 border-blue-900 shadow-sm h-12 cursor-pointer select-none"
        >
          {loading ? t('posting') : t('postComment')}
        </button>
      </form>

      {/* Verified Comments Canvas */}
      <div className="space-y-3 overflow-y-auto max-h-[360px] pe-1">
        {comments.length === 0 ? (
          <p className="text-center text-xs font-bold text-slate-400 py-8">
            {t('noComments')}
          </p>
        ) : (
          comments.map((comment) => (
            <div key={comment.id} className="border border-slate-200/80 rounded-xl p-4 bg-slate-50/50 hover:bg-slate-50 transition-colors">
              <div className="flex items-center justify-between gap-4 mb-2">
                <p className="font-extrabold text-xs text-slate-900">
                  👤 {comment.author_name || 'Anonymous Citizen'}
                </p>
                <p className="text-[10px] font-bold text-slate-400 tabular-nums">
                  {timeAgo(comment.created_at)}
                </p>
              </div>
              
              <p className="text-xs font-medium text-slate-700 leading-relaxed break-words">
                {comment.content}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  )
}