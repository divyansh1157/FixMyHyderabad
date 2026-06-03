# FixMyHyderabad Plan: Urdu Language Support and UI Improvements

## Context

Implementing full Urdu language support, including RTL layout, typography, and machine translation for user content.

## Constitution Check

- [ ] Align with Principle 1: Community-Driven Verification
- [ ] Align with Principle 2: Real-Time Transparency
- [ ] Align with Principle 3: Privacy-First Reporting

## Technical Context

- Translation Framework: `next-intl`
- UI Framework: Next.js 14/15, Tailwind CSS v4
- Font: Noto Sans Arabic (Google Fonts)
- Machine Translation: Google Translate API (500k chars/mo free tier)
- RTL Implementation: Tailwind v4 Logical Properties + `dir="rtl"` on `<html>`

## Phase 0: Research

- [x] Research machine translation APIs (Google, DeepL, LibreTranslate)
- [x] Research `next-intl` RTL integration patterns
- [x] Research Tailwind v4 RTL support

## Phase 1: Design & Contracts

- [x] Create data-model.md
- [x] Define interface contracts
- [x] Create quickstart.md
- [x] Update agent context
