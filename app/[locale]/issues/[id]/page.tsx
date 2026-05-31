import { getReports, getComments, getConfirmedBySession } from '@/lib/actions'
import { getSessionId } from '@/lib/session'
import { notFound } from 'next/navigation'
import IssuePageClient from '@/components/IssuePage'

export const dynamic = 'force-dynamic'

interface IssuePageProps {
  params: Promise<{
    locale: string
    id: string
  }>
}

export default async function IssuePage({ params }: IssuePageProps) {
  const { locale, id } = await params
  
  // 1. Safely locate the specific report using the common getReports interface
  let report = null
  try {
    const allReports = await getReports({ sortBy: 'recent' })
    report = allReports?.find((r: any) => r.id === id) || null
  } catch (error) {
    console.error("Grievance verification failed:", error)
  }

  if (!report) {
    notFound()
  }

  // 2. Load context updates and session validation hashes
  const comments = await getComments(id)
  const sessionId = getSessionId()
  
  let confirmedIds: string[] = []
  try {
    confirmedIds = await getConfirmedBySession(sessionId)
  } catch (err) {
    console.error("Session matching failed:", err)
  }
  
  const isConfirmed = confirmedIds.includes(id)

  return (
    <IssuePageClient
      report={report}
      sessionId={sessionId}
      isConfirmedInitial={isConfirmed}
      locale={locale}
      comments={comments || []}
    />
  )
}