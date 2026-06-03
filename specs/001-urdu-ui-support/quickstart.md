# Quickstart: Urdu Support

## Prerequisites

- Google Cloud Project with Cloud Translation API enabled.
- API Key added to `.env.local` as `GOOGLE_TRANSLATE_API_KEY`.

## Development

1. **Translations**: Add new keys to `messages/en.json` first, then provide translations in `ur.json`.
2. **Typography**: Ensure Noto Sans Arabic is used for Urdu text.
3. **RTL**: Use Tailwind's logical properties (`ms-*`, `me-*`, `ps-*`, `pe-*`) for layout.

## Verification

- Switch language to Urdu using the language switcher.
- Verify that the layout flips to RTL.
- Verify that issue categories and status badges are in Urdu.
- Verify that user-generated reports show Urdu translations.
