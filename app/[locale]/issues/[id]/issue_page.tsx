import { getReportById, getConfirmedBySession, getCommentsByReport } from '@/lib/actions'
import { getSessionId } from '@/lib/session'
import { notFound } from 'next/navigation'
import IssuePageClient from '@/components/IssuePage'

export const dynamic = 'force-dynamic'

export default async function IssuePage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>
}) {
  const { locale, id } = await params

  let report = null
  try {
    report = await getReportById(id)
  } catch {
    notFound()
  }

  if (!report) notFound()

  // Get session and check if confirmed
  const sessionId = getSessionId()    // server-side session read
  const confirmedIds = await getConfirmedBySession(sessionId)
  const isConfirmed  = confirmedIds.includes(id)

  // Get comments — if you don't have this action yet, pass empty array
  let comments: { id: string; text: string; created_at: string }[] = []
  try {
    comments = await getCommentsByReport(id) ?? []
  } catch {
    // comments table may not exist yet — that's fine
  }

  return (
    <IssuePageClient
      report={report}
      sessionId={sessionId}
      isConfirmedInitial={isConfirmed}
      locale={locale}
      comments={comments}
    />
  )
}
