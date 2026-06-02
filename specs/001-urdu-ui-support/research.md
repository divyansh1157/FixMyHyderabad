# Research: Urdu Language Support

## Decision: Machine Translation
- **Chosen**: Google Translate API (Cloud Translation API)
- **Rationale**: Best-in-class support for Urdu, high reliability, and a generous free tier (500k characters/mo).
- **Alternatives considered**:
  - DeepL: High quality but geographically restricted free tier.
  - LibreTranslate: Self-hosted option available but lower quality for Urdu and higher maintenance.

## Decision: RTL Implementation
- **Chosen**: Tailwind CSS v4 Logical Properties + `dir` attribute on `html` tag.
- **Rationale**: Tailwind v4 natively supports CSS logical properties (e.g., `ms-4` instead of `ml-4`), which automatically handle RTL/LTR based on the `dir` attribute. `next-intl` will provide the current locale to the root layout.
- **Implementation**:
  - Update `layout.tsx` to set `<html dir={locale === 'ur' ? 'rtl' : 'ltr'}>`.
  - Use `margin-inline-start` (ms), `padding-inline-end` (pe), etc., in components.

## Decision: Typography
- **Chosen**: Noto Sans Arabic via `next/font/google`.
- **Rationale**: Highly legible, standard for Urdu digital content, and integrates seamlessly with Next.js.
- **Implementation**: Define a secondary font variable in `layout.tsx` and apply it conditionally when locale is `ur`.

## Decision: next-intl Integration
- **Chosen**: Locale-based routing (already partially implemented).
- **Rationale**: Cleanest way to handle SEO and state preservation across refreshes.
