export type Category =
  | 'Pothole'
  | 'Garbage'
  | 'Waterlogging'
  | 'Streetlight'
  | 'Other';
export type Status = 'active' | 'in_review' | 'resolved';
export type SortOption = 'urgency' | 'recent';

export type Report = {
  id: string;
  title: string;
  title_te?: string | null;
  title_ur?: string | null;
  category: Category;
  description?: string;
  description_te?: string | null;
  description_ur?: string | null;
  image_url?: string;
  latitude: number;
  longitude: number;
  area_name: string;
  address_text?: string;
  confirmations_count: number;
  status: Status;
  created_at: string;
};

export type CreateReportInput = Omit<
  Report,
  | 'id'
  | 'confirmations_count'
  | 'status'
  | 'created_at'
  | 'title_te'
  | 'title_ur'
  | 'description_te'
  | 'description_ur'
>;

export type Comment = {
  id: string;
  report_id: string;
  session_id: string;
  author_name?: string | null;
  content: string;
  created_at: string;
};
