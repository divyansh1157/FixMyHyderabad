import {
  getReportDetail,
  getComments,
  getConfirmedBySession,
} from '@/lib/actions';
import { notFound } from 'next/navigation';
import IssueDetail from '@/components/IssueDetail';
import CommentsSection from '@/components/CommentsSection';
import Link from 'next/link';
import { cookies } from 'next/headers';
import { useTranslations } from 'next-intl';
import { getTranslations } from 'next-intl/server';

export const dynamic = 'force-dynamic';

interface IssuePageProps {
  params: Promise<{ locale: string; id: string }>;
}

export default async function IssuePage({ params }: IssuePageProps) {
  const { locale, id } = await params;
  const t = await getTranslations('details');

  // Fetch report
  let report;
  try {
    report = await getReportDetail(id);
  } catch {
    notFound();
  }
  if (!report) notFound();

  // Fetch comments
  const comments = await getComments(id, 50);

  // Read session cookie on the server properly — no typeof window needed
  const cookieStore = await cookies();
  const sessionId = cookieStore.get('session_id')?.value ?? '';

  // Check if already confirmed
  const confirmedIds = sessionId ? await getConfirmedBySession(sessionId) : [];
  const isConfirmed = confirmedIds.includes(id);

  return (
    <div>
      {/* Back button */}
      <div className="mb-6">
        <Link
          href={`/${locale}`}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold text-[#1A1208]/60 hover:text-[#1A1208] hover:bg-[#1A1208]/5 transition-all"
        >
          {t('back')}
        </Link>
      </div>

      {/* Issue detail + confirm button */}
      <div className="mb-8">
        <IssueDetail report={report} isConfirmedInitial={isConfirmed} />
      </div>

      {/* Comments */}
      <CommentsSection
        reportId={id}
        sessionId={sessionId}
        initialComments={comments}
      />
    </div>
  );
}
