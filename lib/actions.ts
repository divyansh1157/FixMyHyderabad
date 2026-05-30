'use server'

import { supabase } from './supabase'
import { CreateReportInput } from './types'
import { revalidatePath } from 'next/cache'

// ─── createReport ─────────────────────────────────────────────────────────────
export async function createReport(
  input: CreateReportInput,
  imageFile?: FormData
): Promise<{ success: boolean; id?: string; error?: string }> {
  try {
    let image_url: string | undefined

    // Upload image to Supabase Storage if provided
    if (imageFile) {
      const file = imageFile.get('image') as File
      if (file && file.size > 0) {
        const ext = file.name.split('.').pop()
        const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`

        const { error: uploadError } = await supabase.storage
          .from('civic-images')
          .upload(fileName, file, { contentType: file.type })

        if (uploadError) throw new Error(`Image upload failed: ${uploadError.message}`)

        const { data: urlData } = supabase.storage
          .from('civic-images')
          .getPublicUrl(fileName)

        image_url = urlData.publicUrl
      }
    }

    // Reverse geocode lat/lng to a human-readable address
    let address_text = input.address_text
    if (!address_text && input.latitude && input.longitude) {
      address_text = await reverseGeocode(input.latitude, input.longitude, input.area_name)
    }

    const { data, error } = await supabase
      .from('reports')
      .insert([{ ...input, image_url, address_text, status: 'active' }])
      .select('id')
      .single()

    if (error) throw new Error(error.message)

    revalidatePath('/')
    return { success: true, id: data.id }

  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    console.error('[createReport]', message)
    return { success: false, error: message }
  }
}

// ─── confirmIssue ─────────────────────────────────────────────────────────────
// sessionId comes from an anonymous cookie set on the client (see lib/session.ts)
export async function confirmIssue(
  reportId: string,
  sessionId: string
): Promise<{ success: boolean; new_count?: number; already_confirmed?: boolean; error?: string }> {
  try {
    const { data, error } = await supabase.rpc('increment_confirmations', {
      report_id: reportId,
      session_id: sessionId,
    })

    if (error) throw new Error(error.message)

    if (!data.success && data.reason === 'already_confirmed') {
      return { success: false, already_confirmed: true }
    }

    revalidatePath('/')
    return { success: true, new_count: data.new_count }

  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    console.error('[confirmIssue]', message)
    return { success: false, error: message }
  }
}

// ─── getReports ───────────────────────────────────────────────────────────────
// Used by Member 2's feed component — pass sessionId to know which reports user confirmed
export async function getReports(filters?: {
  area?: string
  sortBy?: 'urgency' | 'recent'
  status?: string
}) {
  let query = supabase.from('reports').select('*')

  if (filters?.area && filters.area !== 'All') {
    query = query.eq('area_name', filters.area)
  }

  // Default: only show active + in_review unless filter specified
  if (filters?.status) {
    query = query.eq('status', filters.status)
  } else {
    query = query.neq('status', 'resolved')
  }

  if (filters?.sortBy === 'urgency') {
    query = query.order('confirmations_count', { ascending: false })
  } else {
    query = query.order('created_at', { ascending: false })
  }

  const { data, error } = await query.limit(50)

  if (error) throw new Error(error.message)
  return data
}

// ─── getConfirmedBySession ────────────────────────────────────────────────────
// Returns list of report IDs the current session has already confirmed
// Member 2 uses this to disable the Confirm button on already-confirmed reports
export async function getConfirmedBySession(sessionId: string): Promise<string[]> {
  const { data, error } = await supabase
    .from('confirmations')
    .select('report_id')
    .eq('session_id', sessionId)

  if (error) return []
  return data.map((c: { report_id: string }) => c.report_id)
}

// ─── reverseGeocode (internal helper) ────────────────────────────────────────
// Uses free Nominatim API — no key needed, but rate-limited (fine for hackathon)
async function reverseGeocode(lat: number, lng: number, fallbackArea: string): Promise<string> {
  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`,
      { headers: { 'User-Agent': 'FixMyHyderabad/1.0' } }
    )
    const json = await res.json()
    const road = json.address?.road || json.address?.suburb || ''
    const suburb = json.address?.suburb || json.address?.neighbourhood || fallbackArea
    return road ? `Near ${road}, ${suburb}` : `${suburb}, Hyderabad`
  } catch {
    return `${fallbackArea}, Hyderabad`
  }
}
