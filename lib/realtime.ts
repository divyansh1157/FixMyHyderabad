// Supabase Realtime subscription for the live feed
// Member 2 drops useRealtimeFeed() into their feed component
// New reports and confirmation count updates appear instantly — no page refresh needed

import { useEffect, useState } from 'react';
import { supabase } from './supabase';
import { Report } from './types';

export function useRealtimeFeed(initialReports: Report[]) {
  const [reports, setReports] = useState<Report[]>(initialReports);

  useEffect(() => {
    // Subscribe to all changes on the reports table
    const channel = supabase
      .channel('reports-live')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'reports' },
        (payload) => {
          // New report added — prepend to feed
          setReports((prev) => [payload.new as Report, ...prev]);
        }
      )
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'reports' },
        (payload) => {
          // Confirmation count updated — replace in place
          setReports((prev) =>
            prev.map((r) =>
              r.id === payload.new.id ? (payload.new as Report) : r
            )
          );
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return reports;
}
