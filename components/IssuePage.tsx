'use client';

import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { Report, Comment } from '@/lib/types';
import IssueDetail from './IssueDetail';
import CommentsSection from './CommentsSection';

interface IssuePageClientProps {
  report: Report;
  sessionId: string;
  isConfirmedInitial: boolean;
  locale: string;
  comments: Comment[];
}

export default function IssuePageClient({
  report,
  sessionId,
  isConfirmedInitial,
  locale,
  comments,
}: IssuePageClientProps) {
  const t = useTranslations('details');

  return (
    <div className="space-y-6">
      {/* Dynamic Directional Back-Navigation Target Anchor Block */}
      <div className="text-start">
        <Link
          href={`/${locale}`}
          className="inline-flex items-center gap-2 bg-white border-2 border-slate-200 hover:bg-slate-50 text-slate-700 font-extrabold text-xs px-4 py-2.5 rounded-lg transition-colors shadow-xs focus:ring-2 focus:ring-blue-300"
        >
          {/* Flipped dynamically in CSS to stay correct in both English and Urdu */}
          <span className="rtl:rotate-180 inline-block">←</span>
          <span>{t('back')}</span>
        </Link>
      </div>

      {/* Structured Split Screen Dashboard Grid System Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Left Interactive Side: Authoritative Ticket Detail Canvas Area */}
        <div className="lg:col-span-2">
          <IssueDetail
            report={report}
            isConfirmedInitial={isConfirmedInitial}
          />
        </div>

        {/* Right Interactive Side: Multi-generational Citizen Comments Forum Widget */}
        <div className="lg:col-span-1 bg-white border-2 border-slate-200 rounded-xl p-5 shadow-xs">
          <CommentsSection
            reportId={report.id}
            sessionId={sessionId}
            initialComments={comments}
          />
        </div>
      </div>
    </div>
  );
}
