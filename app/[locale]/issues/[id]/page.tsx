import { getReportDetail, getComments } from '@/lib/actions'
import { notFound } from 'next/navigation'
import IssueDetail from '@/components/IssueDetail'
import CommentsSection from '@/components/CommentsSection'
import { getSessionId } from '@/lib/session'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

interface IssuePageProps {
  params: Promise<{
    locale: string
    id: string
  }>
}

export default async function IssuePage({ params }: IssuePageProps) {
  const { locale, id } = await params

  let report
  try {
    report = await getReportDetail(id)
  } catch {
    notFound()
  }

  const comments = await getComments(id, 50)

  // Get session ID on server (for SSR hydration)
  const sessionId = typeof window !== 'undefined' ? getSessionId() : ''

  return (
    <div>
      {/* Back button */}
      <div className="mb-6">
        <Link
          href={`/${locale}`}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold text-[#1A1208]/60 hover:text-[#1A1208] hover:bg-[#1A1208]/5 transition-all"
        >
          ← Back to Feed
        </Link>
      </div>

      {/* Issue Detail */}
      <div className="mb-8">
        <IssueDetail report={report} />
      </div>

      {/* Comments Section - Client component */}
      <CommentsSection
        reportId={id}
        sessionId={sessionId}
        initialComments={comments}
      />
    </div>
  )
}
