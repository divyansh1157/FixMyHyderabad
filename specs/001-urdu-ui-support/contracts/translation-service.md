# Contract: Translation Service

## Interface: `ITranslationService`

The application interacts with machine translation through this abstract interface.

### `translate(text: string, targetLocale: string): Promise<string>`

Translates a single string to the target locale.

### `translateBatch(texts: string[], targetLocale: string): Promise<string[]>`

Translates multiple strings in a single request to optimize API usage.

## Implementation: `GoogleTranslationService`

Wraps the Google Cloud Translation API.

### Environment Variables Required

- `GOOGLE_TRANSLATE_API_KEY`: API key for authentication.

## Usage in Server Actions

```ts
// lib/actions.ts
const translatedTitle = await translationService.translate(report.title, 'ur');
```
