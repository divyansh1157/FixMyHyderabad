import { getReports } from '@/lib/actions'
import { Report } from '@/lib/types'
import FeedClient from '@/components/FeedClient'

export const dynamic = 'force-dynamic'

export default async function Page({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params

  let initialReports: Report[] = []
  try {
    const data = await getReports({ sortBy: 'recent' })
    initialReports = (data ?? []) as Report[]
  } catch {
    // DB error — feed starts empty, realtime will populate
  }

  return (
    <FeedClient
      initialReports={initialReports}
      initialConfirmedIds={[]}
      locale={locale}
    />
  )
}
