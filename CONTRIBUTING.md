# Contributing — FixMyHyderabad

## Team

| Member   | Name     | Role                                  |
| -------- | -------- | ------------------------------------- |
| Member 1 | Divyansh | Backend, Database & API Integration   |
| Member 2 | Srujan   | Frontend Layout & Live Pulse Feed     |
| Member 3 | Akshara  | Report Submission & Location Services |

---

## Who Owns What

### Divyansh — Backend, Database & API Integration

- Supabase project setup and schema design
- `lib/supabase.ts` — database client
- `lib/types.ts` — shared TypeScript types
- `lib/actions.ts` — all server actions (`createReport`, `confirmIssue`, `getReports`, `getConfirmedBySession`)
- `lib/session.ts` — anonymous session ID for duplicate confirm prevention
- `lib/realtime.ts` — live feed hook
- `sql/` — all database migrations and seed data
- Vercel deployment and GitHub CI setup

### Srujan — Frontend Layout & Live Pulse Feed

- Next.js project scaffold and Tailwind CSS setup
- Main dashboard layout (mobile-first)
- Live feed component using `getReports()` and `useRealtimeFeed()`
- "I Confirm This" button wired to `confirmIssue()`
- Filter by area dropdown and Sort by Urgency toggle
- Report status badges (active / in_review / resolved)

### Akshara — Report Submission & Location Services

- Report submission form (category, title, description, image)
- Browser Geolocation API integration
- Form wired to `createReport()` with image upload and error handling
- Demo seed data preparation and mock issue insertion

---

## How to Run Locally

```bash
# Clone the repo
git clone https://github.com/YOUR_USERNAME/fixmyhyderabad.git
cd fixmyhyderabad

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Fill in NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY

# Start the dev server
npm run dev
```

---

## Branch Convention

Since this is a hackathon, all members push to `main` directly. Coordinate with the team before pushing to avoid conflicts.

Recommended: work in separate files and tell teammates before pushing.

---

## Environment Variables

Never commit `.env.local` to GitHub. It is already in `.gitignore` by default in Next.js projects. Share keys privately with teammates over chat.
