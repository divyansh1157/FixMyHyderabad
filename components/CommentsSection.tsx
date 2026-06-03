'use client';

import { useState, useEffect } from 'react';
import { Comment } from '@/lib/types';
import { addComment, getComments } from '@/lib/actions';
import { useTranslations } from 'next-intl';

interface CommentsSectionProps {
  reportId: string;
  sessionId: string;
  initialComments: Comment[];
}

export default function CommentsSection({
  reportId,
  sessionId,
  initialComments,
}: CommentsSectionProps) {
  const t = useTranslations('comments');
  const [comments, setComments] = useState<Comment[]>(initialComments);
  const [name, setName] = useState('');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const timeAgo = (iso: string) => {
    const diff = Date.now() - new Date(iso).getTime();
    const m = Math.floor(diff / 60000);
    if (m < 1) return t('justNow');
    if (m < 60) return t('minutesAgo', { m });
    const h = Math.floor(m / 60);
    if (h < 24) return t('hoursAgo', { h });
    return t('daysAgo', { d: Math.floor(h / 24) });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!content.trim()) {
      setError(t('emptyComment'));
      return;
    }

    setLoading(true);
    const res = await addComment(
      reportId,
      sessionId,
      content,
      name || undefined
    );

    if (res.success && res.comment) {
      setComments((prev) => [res.comment!, ...prev]);
      setContent('');
      setName('');
    } else {
      setError(res.error || t('commentError'));
    }

    setLoading(false);
  };

  return (
    <div className="border-t border-[#1A1208]/8 pt-8">
      <h2
        className="text-xl font-extrabold text-[#1A1208] mb-6"
        style={{ fontFamily: 'var(--font-syne), sans-serif' }}
      >
        💬 {t('title')}
      </h2>

      {/* Comment form */}
      <form
        onSubmit={handleSubmit}
        className="mb-8 p-5 bg-[#FDFAF7] rounded-2xl border border-[#1A1208]/8"
      >
        <div className="mb-4">
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder={t('nameLabel')}
            className="w-full bg-white border border-[#1A1208]/10 rounded-xl p-3 text-sm outline-none focus:border-[#E8520A] transition-colors placeholder:text-[#1A1208]/40"
            maxLength={50}
          />
        </div>

        <div className="mb-4">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value.slice(0, 500))}
            placeholder={t('contentLabel')}
            rows={4}
            className="w-full bg-white border border-[#1A1208]/10 rounded-xl p-3 text-sm outline-none focus:border-[#E8520A] transition-colors placeholder:text-[#1A1208]/40 resize-none"
          />
          <p className="text-xs text-[#1A1208]/40 mt-1">{content.length}/500</p>
        </div>

        {error && <p className="text-xs text-rose-600 mb-4">{error}</p>}

        <button
          type="submit"
          disabled={loading || !content.trim()}
          className="w-full bg-[#E8520A] hover:bg-[#d4480a] disabled:bg-[#E8520A]/50 text-white font-bold py-3 rounded-xl text-sm uppercase tracking-wider transition-all active:scale-95"
        >
          {loading ? '⏳ ' + t('posting') : '📝 ' + t('postComment')}
        </button>
      </form>

      {/* Comments list */}
      {comments.length === 0 ? (
        <p className="text-center text-[#1A1208]/40 py-8">{t('noComments')}</p>
      ) : (
        <div className="space-y-4">
          {comments.map((comment) => (
            <div
              key={comment.id}
              className="border border-[#1A1208]/8 rounded-xl p-4 bg-white hover:shadow-sm transition-all"
            >
              <div className="flex items-start justify-between mb-2">
                <p className="font-semibold text-[#1A1208]">
                  {comment.author_name || t('anonymous')}
                </p>
                <p className="text-xs text-[#1A1208]/40">
                  {timeAgo(comment.created_at)}
                </p>
              </div>
              <p className="text-sm text-[#1A1208]/70 leading-relaxed whitespace-pre-wrap">
                {comment.content}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
