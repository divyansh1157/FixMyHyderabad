# Tasks: Urdu Language Support and UI Improvements

## Implementation Strategy
We will follow an incremental approach, starting with the foundational RTL and i18n setup, followed by translating the UI components, and finally implementing the dynamic machine translation for user-generated content.

## Phase 1: Setup
- [x] T001 Configure Google Cloud Translation API and add `GOOGLE_TRANSLATE_API_KEY` to `.env.local`
- [x] T002 [P] Install and configure Noto Sans Arabic font in `app/layout.tsx` using `next/font/google`

## Phase 2: Foundational
- [x] T003 [P] Define `ITranslationService` interface in `lib/translation.ts`
- [x] T004 Implement `GoogleTranslationService` using `@google-cloud/translate` in `lib/translation.ts`
- [x] T005 [P] Create `messages/ur.json` with base translations for common UI elements
- [x] T006 Update `app/[locale]/layout.tsx` to set `dir="rtl"` and apply Urdu font conditionally when `locale === 'ur'`

## Phase 3: [US1] Reporting in Urdu
**Goal**: Allow users to submit reports using an Urdu interface.
**Test Criteria**: Switch to Urdu, navigate to `/report`, verify form is in Urdu and RTL, submit a report successfully.

- [X] T007 [US1] Add `ReportForm` translations to `messages/ur.json`
- [X] T008 [P] [US1] Update `app/[locale]/report/page.jsx` to use `useTranslations` for labels and placeholders
- [X] T009 [US1] Refactor `app/[locale]/report/page.jsx` and related components to use Tailwind logical properties (`ms-*`, `me-*`) for RTL support

## Phase 4: [US2] Browsing Feed in Urdu
**Goal**: Users can browse the feed with Urdu translations and RTL layout.
**Test Criteria**: Switch to Urdu on the home page, verify categories, status badges, and report content are translated and displayed RTL.

- [X] T010 [US2] Add `Categories`, `Status`, and `Filters` translations to `messages/ur.json`
- [X] T011 [US2] Integrate `TranslationService` into `lib/actions.ts` to translate report titles and descriptions
- [X] T012 [P] [US2] Update `components/ReportCard.tsx` to display translated content and apply RTL styles
- [X] T013 [P] [US2] Update `components/FeedFilters.tsx` and `components/LanguageSwitcher.tsx` to include and support Urdu

## Phase 5: Polish & Cross-Cutting Concerns
- [ ] T014 [P] Audit all UI components for RTL layout regressions and fix using logical properties
- [ ] T015 Implement error boundaries and fallbacks for translation service failures in `lib/actions.ts`

## Dependencies
- Phase 2 (Foundational) must be completed before starting US1 or US2.
- T004 (GoogleTranslationService) is a prerequisite for T011 (User Content Translation).

## Parallel Execution Examples
- T002, T003, and T005 can be worked on simultaneously.
- T008 (US1 UI) and T012 (US2 UI) can be worked on in parallel once Phase 2 is complete.
- T014 (Audit) can start as soon as UI components begin adopting RTL styles.
