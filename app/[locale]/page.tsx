import { getReports } from '@/lib/actions';
import { Report } from '@/lib/types';
import FeedClient from '@/components/FeedClient';

export const dynamic = 'force-dynamic';

interface PageProps {
  params: Promise<{ locale: string }>;
}

export default async function Page({ params }: PageProps) {
  const { locale } = await params;

  let initialReports: Report[] = [];
  try {
    // Collect primary feed items from your action module safely
    const data = await getReports({ sortBy: 'recent' });
    initialReports = (data ?? []) as Report[];
  } catch (error) {
    console.error('Database fallback triggered:', error);
  }

  return (
    <FeedClient
      initialReports={initialReports}
      initialConfirmedIds={[]}
      locale={locale}
    />
  );
}
