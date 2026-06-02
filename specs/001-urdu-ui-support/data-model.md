# Data Model: Urdu Support

## Translations (Static UI)
Static UI translations are stored in JSON files under the `messages/` directory.
- `en.json`: English base translations.
- `te.json`: Telugu translations.
- `ur.json`: Urdu translations.

### Schema Example (`ur.json`)
```json
{
  "ReportForm": {
    "title": "ایک مسئلہ کی اطلاع دیں",
    "submit": "رپورٹ جمع کروائیں",
    "useLocation": "میری لوکیشن استعمال کریں"
  },
  "Categories": {
    "pothole": "گڑھا",
    "garbage": "کوڑا کرکٹ",
    "waterlogging": "پانی کا جمع ہونا",
    "streetlight": "اسٹریٹ لائٹ",
    "other": "دیگر"
  }
}
```

## User Content Translation (Dynamic)
User-generated content (titles and descriptions) will be translated on-the-fly or cached.

### Entity: TranslatedContent
Since we are using machine translation for user content, we should avoid redundant API calls.

| Field | Type | Description |
|---|---|---|
| original_id | uuid | Reference to `reports.id` |
| target_locale | string | `ur`, `te`, or `en` |
| translated_title | text | Machine-translated title |
| translated_description | text | Machine-translated description |
| created_at | timestamptz | Cache timestamp |

**Note**: For the initial implementation, we will perform on-the-fly translation in a Server Action or Edge Function to simplify the stack, considering the 500k char/mo limit is ample for hackathon scale.
