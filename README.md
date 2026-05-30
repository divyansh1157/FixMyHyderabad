   # FixMyHyderabad — Civic Pulse 🚦

> A real-time civic issue reporting platform for Hyderabad. Citizens report and crowd-verify problems like potholes, waterlogging, and garbage. Built for GHMC and the community.

---

## What This App Does

- Citizens submit geo-tagged civic issues with photos
- Other citizens confirm issues they've seen ("I Confirm This")
- A live feed updates in real-time — no page refresh needed
- Issues are sorted by urgency (confirmation count) or recency
- Filter by area: Madhapur, Kukatpally, Gachibowli, etc.
- Each report has a status: `active`, `in_review`, or `resolved`

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js 14, Tailwind CSS |
| Backend | Next.js Server Actions |
| Database | Supabase (PostgreSQL) |
| Storage | Supabase Storage (civic-images bucket) |
| Realtime | Supabase Realtime subscriptions |
| Location | Browser Geolocation API + Nominatim reverse geocoding |
| Deployment | Vercel |

---

## Project Structure

```
fixmyhyderabad/
├── app/                        ← Next.js app directory (pages, layout)
├── lib/
│   ├── supabase.ts             ← Supabase client
│   ├── types.ts                ← Shared TypeScript types
│   ├── actions.ts              ← Server actions (createReport, confirmIssue, getReports)
│   ├── session.ts              ← Anonymous session ID for duplicate confirm prevention
│   └── realtime.ts             ← useRealtimeFeed() hook for live updates
├── sql/
│   ├── 01_schema.sql           ← reports + confirmations tables, RLS policies
│   ├── 02_storage.sql          ← civic-images storage bucket
│   ├── 03_rpc.sql              ← Atomic increment + duplicate confirm prevention
│   └── 04_seed.sql             ← 12 mock Hyderabad issues for demo
├── .env.example                ← Copy to .env.local
└── README.md
```

---

## Database Schema

### `reports`
| Column | Type | Description |
|---|---|---|
| id | uuid | Primary key |
| title | text | Short issue title |
| category | text | Pothole / Garbage / Waterlogging / Streetlight / Other |
| description | text | Detailed description |
| image_url | text | Public URL from Supabase Storage |
| latitude | float | GPS latitude |
| longitude | float | GPS longitude |
| area_name | text | e.g. Madhapur, Kukatpally |
| address_text | text | Human-readable address e.g. "Near Cyber Towers, Madhapur" |
| confirmations_count | int | Number of community confirmations |
| status | text | active / in_review / resolved |
| created_at | timestamptz | Auto-set on insert |

### `confirmations`
| Column | Type | Description |
|---|---|---|
| id | uuid | Primary key |
| report_id | uuid | Foreign key → reports.id |
| session_id | text | Anonymous browser session ID |
| created_at | timestamptz | Auto-set on insert |

Unique constraint on `(report_id, session_id)` — prevents the same person from confirming twice.

---

## Getting Started

### Prerequisites
- Node.js (LTS) — download from nodejs.org
- A Supabase account — supabase.com
- A Vercel account — vercel.com
- A GitHub account — github.com

### 1. Supabase Setup
1. Create a new project at supabase.com (region: South Asia - Mumbai)
2. Go to **SQL Editor** and run each file in order:
   - `sql/01_schema.sql`
   - `sql/02_storage.sql`
   - `sql/03_rpc.sql`
   - `sql/04_seed.sql`
3. Enable Realtime — run this in SQL Editor:
   ```sql
   alter publication supabase_realtime add table reports;
   ```

### 2. Local Development
```bash
# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Fill in your Supabase URL and anon key (Supabase Dashboard → Settings → API)

# Run the dev server
npm run dev
```
Open http://localhost:3000

### 3. Deploy to Vercel
```bash
git init
git add .
git commit -m "init"
git remote add origin https://github.com/YOUR_USERNAME/fixmyhyderabad.git
git push -u origin main
```
Then go to vercel.com → import the repo → add the 2 environment variables → Deploy.

---

## Environment Variables

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

Get these from: Supabase Dashboard → Settings → Data API

---

## API Reference (Server Actions)

All functions are in `lib/actions.ts` and can be imported by any component.

### `createReport(input, imageFile?)`
Creates a new civic issue report. Automatically reverse-geocodes lat/lng to a human-readable address.
```ts
import { createReport } from '@/lib/actions'

const result = await createReport({
  title: 'Waterlogging near Cyber Towers',
  category: 'Waterlogging',
  description: 'Road completely flooded after rain.',
  latitude: 17.4472,
  longitude: 78.3762,
  area_name: 'Madhapur',
})
// Returns: { success: true, id: 'uuid' } or { success: false, error: '...' }
```

### `confirmIssue(reportId, sessionId)`
Increments confirmation count. Blocks duplicate confirms from the same session.
```ts
import { confirmIssue } from '@/lib/actions'
import { getSessionId } from '@/lib/session'

const sessionId = getSessionId()
const result = await confirmIssue(reportId, sessionId)
// Returns: { success: true, new_count: 15 }
// Or:      { success: false, already_confirmed: true }
```

### `getReports(filters?)`
Fetches reports with optional area filter and sort.
```ts
import { getReports } from '@/lib/actions'

const reports = await getReports({ area: 'Madhapur', sortBy: 'urgency' })
```

### `getConfirmedBySession(sessionId)`
Returns list of report IDs the current session has already confirmed — used to disable the Confirm button.
```ts
import { getConfirmedBySession } from '@/lib/actions'

const confirmed = await getConfirmedBySession(sessionId)
// Returns: ['uuid1', 'uuid2', ...]
```

### `useRealtimeFeed(initialReports)`
React hook that keeps the feed live — subscribes to INSERT and UPDATE events on the reports table.
```ts
import { useRealtimeFeed } from '@/lib/realtime'

const reports = useRealtimeFeed(initialReports)
// reports auto-updates when new issues are reported or confirmed
```

---

## Team

| Member | Role |
|---|---|
| Member 1 | Backend, Database & API Integration |
| Member 2 | Frontend Layout & Live Pulse Feed |
| Member 3 | Report Submission & Location Services |

---

## Hackathon Context

Built at a CivicTech hackathon focused on Hyderabad city-level civic issues.
Theme: Real-time community-driven civic reporting to help GHMC prioritize issues faster.
