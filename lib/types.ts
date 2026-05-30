export type Category = 'Pothole' | 'Garbage' | 'Waterlogging' | 'Streetlight' | 'Other'
export type Status = 'active' | 'in_review' | 'resolved'
export type SortOption = 'urgency' | 'recent'

export type Report = {
  id: string
  title: string
  category: Category
  description?: string
  image_url?: string
  latitude: number
  longitude: number
  area_name: string
  address_text?: string         // e.g. "Near Cyber Towers, Madhapur"
  confirmations_count: number
  status: Status
  created_at: string
}

export type CreateReportInput = Omit<Report, 'id' | 'confirmations_count' | 'created_at' | 'status'>
