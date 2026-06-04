# Agents — FixMyHyderabad

> This document describes all backend agents, server actions, and automated processes in the FixMyHyderabad platform.

---

## Overview

FixMyHyderabad uses a set of server-side agents (Next.js Server Actions) that handle all data operations between the frontend and Supabase. There are no third-party AI agents in this version — all agents are deterministic functions.

---

## Agent 1 — Report Intake Agent

**File:** `lib/actions.ts` → `createReport()`

**Trigger:** User submits the report form

**What it does:**

1. Receives form input (title, category, description, coordinates, area, image)
2. If an image is attached, uploads it to Supabase Storage (`civic-images` bucket) and generates a public URL
3. Calls the Nominatim reverse geocoding API to convert lat/lng into a human-readable address (e.g. "Near Cyber Towers, Madhapur")
4. Inserts the full report record into the `reports` table with `status: 'active'`
5. Triggers a `revalidatePath('/')` to refresh the feed

**Input:**

```ts
{
  title: string
  category: 'Pothole' | 'Garbage' | 'Waterlogging' | 'Streetlight' | 'Other'
  description?: string
  latitude: number
  longitude: number
  area_name: string
  address_text?: string
}
```

**Output:**

```ts
{ success: true, id: string }
// or
{ success: false, error: string }
```

**External dependencies:**

- Supabase Storage (image upload)
- Nominatim OpenStreetMap API (reverse geocoding, free, no key required)

---

## Agent 2 — Confirmation Agent

**File:** `lib/actions.ts` → `confirmIssue()`

**Trigger:** User clicks "I Confirm This Issue" button

**What it does:**

1. Receives the `report_id` and the user's anonymous `session_id`
2. Calls the Supabase RPC function `increment_confirmations`
3. The RPC atomically checks if this session has already confirmed this report
4. If not confirmed: inserts a row into `confirmations` table and increments `confirmations_count` on the report
5. If already confirmed: returns `already_confirmed: true` without changing any data
6. Triggers a `revalidatePath('/')` on success

**Input:**

```ts
reportId: string;
sessionId: string; // anonymous browser session ID from lib/session.ts
```

**Output:**

```ts
{ success: true, new_count: number }
// or
{ success: false, already_confirmed: true }
// or
{ success: false, error: string }
```

**Why atomic?** The RPC runs as a single PostgreSQL transaction — prevents race conditions where two users confirming simultaneously could result in an incorrect count.

---

## Agent 3 — Feed Query Agent

**File:** `lib/actions.ts` → `getReports()`

**Trigger:** Page load, filter change, or sort change

**What it does:**

1. Accepts optional filters: `area` and `sortBy`
2. Builds a Supabase query filtering out `resolved` reports by default
3. Applies area filter if provided (not "All")
4. Sorts by `confirmations_count DESC` (urgency) or `created_at DESC` (recent)
5. Returns up to 50 reports

**Input:**

```ts
{
  area?: string       // e.g. 'Madhapur' or 'All'
  sortBy?: 'urgency' | 'recent'
  status?: string     // optional override to show resolved reports
}
```

**Output:**

```ts
Report[]  // array of report objects
```

---

## Agent 4 — Session History Agent

**File:** `lib/actions.ts` → `getConfirmedBySession()`

**Trigger:** Page load (called once to hydrate the frontend with confirmed state)

**What it does:**

1. Accepts an anonymous `sessionId`
2. Queries the `confirmations` table for all rows matching that session
3. Returns a list of `report_id` values the session has already confirmed

**Input:**

```ts
sessionId: string;
```

**Output:**

```ts
string[]  // list of report IDs already confirmed by this session
```

**Used by:** Member 2's feed component to pre-disable the Confirm button on already-confirmed reports when the page loads.

---

## Agent 5 — Realtime Feed Agent

**File:** `lib/realtime.ts` → `useRealtimeFeed()`

**Trigger:** Component mount (runs as a React hook)

**What it does:**

1. Accepts an initial list of reports (from server-side fetch)
2. Opens a Supabase Realtime channel subscribed to the `reports` table
3. On `INSERT` event: prepends the new report to the feed state
4. On `UPDATE` event: replaces the matching report in place (e.g. updated `confirmations_count`)
5. Cleans up the channel subscription on component unmount

**Input:**

```ts
initialReports: Report[]
```

**Output:**

```ts
Report[]  // live-updating array, managed via React state
```

**Dependency:** Requires Realtime to be enabled on the `reports` table in Supabase (`alter publication supabase_realtime add table reports`).

---

## Agent 6 — Session Identity Agent

**File:** `lib/session.ts` → `getSessionId()`

**Trigger:** Called on the client whenever a session ID is needed

**What it does:**

1. Checks `localStorage` for an existing session ID under the key `fmh_session_id`
2. If found, returns it
3. If not found, generates a new random ID and persists it to `localStorage`

**Output:**

```ts
string; // e.g. "1748576432891-x7k2m9-p4q1r8"
```

**Why anonymous?** No login is required. The session ID is a random string that persists in the browser — it identifies the device/browser, not the person. This is enough to prevent accidental double-confirms while preserving full privacy.

---

## Agent 7 — Reverse Geocoding Agent

**File:** `lib/actions.ts` → `reverseGeocode()` (internal helper)

**Trigger:** Called automatically inside `createReport()` when `address_text` is not provided

**What it does:**

1. Takes a latitude and longitude
2. Calls the free Nominatim OpenStreetMap API
3. Parses the response to extract road name and suburb
4. Returns a formatted string like "Near KPHB Main Road, Kukatpally"
5. Falls back to `"{area_name}, Hyderabad"` if the API fails

**Input:**

```ts
lat: number;
lng: number;
fallbackArea: string;
```

**Output:**

```ts
string; // e.g. "Near Cyber Towers, Madhapur"
```

**Note:** Nominatim has a rate limit of 1 request/second. This is fine for a hackathon but should be replaced with a paid geocoding API (Google Maps, Mapbox) in production.

---

## Database-Level Agent — Supabase RPC

**Function:** `increment_confirmations(report_id, session_id)`
**File:** `sql/03_rpc.sql`

This is a PostgreSQL function that runs server-side inside Supabase. It is called by Agent 2 (Confirmation Agent) and handles:

- Duplicate detection (checks `confirmations` table)
- Atomic counter increment (single transaction, no race conditions)
- Returns a JSONB result with `success`, `new_count`, or `reason`

---

## Agent Interaction Map

```
User submits form
    └── Report Intake Agent (createReport)
            ├── Reverse Geocoding Agent (reverseGeocode)
            └── Supabase INSERT → triggers Realtime Feed Agent (useRealtimeFeed)

User clicks Confirm
    └── Confirmation Agent (confirmIssue)
            └── Supabase RPC (increment_confirmations)
                    └── triggers Realtime Feed Agent (useRealtimeFeed)

Page loads
    ├── Feed Query Agent (getReports)
    ├── Session History Agent (getConfirmedBySession)
    ├── Session Identity Agent (getSessionId)
    └── Realtime Feed Agent (useRealtimeFeed) — stays alive until unmount
```
