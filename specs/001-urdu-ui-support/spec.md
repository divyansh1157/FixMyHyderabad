# FixMyHyderabad Specification: Urdu Language Support and UI Improvements

## Overview
This feature introduces comprehensive Urdu language support to the FixMyHyderabad platform, including full UI translation, Right-to-Left (RTL) layout adjustments, and localized typography. This ensures the platform is accessible to a wider segment of the Hyderabad community, particularly Urdu speakers.

## Clarifications
### Session 2026-05-31
- Q: Should user-generated content (issue titles and descriptions) also be translated? → A: Machine Translation: Automatically translate user content to the active UI language.
- Q: Does RTL layout include maps and image placements? → A: Standard RTL: Flip text, sidebars, buttons, and navigation. Keep maps and images as-is.

## User Scenarios
### Scenario 1: Reporting an Issue in Urdu
An Urdu-speaking citizen opens the app and switches the language to Urdu. They see the entire interface, including the report form and instructions, in Urdu. They successfully submit a report for a broken streetlight in their neighborhood using the Urdu interface.

### Scenario 2: Browsing the Live Feed in Urdu
A user prefers reading in Urdu. They browse the live pulse feed, where all status badges, categories (Pothole, Waterlogging, etc.), and navigation elements are displayed in Urdu with a proper RTL layout that feels natural. User-generated content submitted in other languages is automatically translated to Urdu.

## Functional Requirements
- **FR-1: UI Translation**: All hardcoded strings, buttons, and labels MUST be translated into Urdu using `next-intl`.
- **FR-2: RTL Layout Support**: The application layout MUST dynamically switch to Right-to-Left (Standard RTL) when Urdu is selected. This includes flipping text alignment, sidebars, buttons, and navigation, while maintaining the original orientation for maps and images.
- **FR-3: Urdu Font Integration**: A legible Urdu font (e.g., Noto Sans Arabic) MUST be integrated to ensure high readability.
- **FR-4: Language Switcher**: The existing language switcher MUST include Urdu as a selectable option.
- **FR-5: Category Localization**: All civic issue categories MUST be displayed in Urdu.
- **FR-6: Status Badge Localization**: Statuses like "Active", "In Review", and "Resolved" MUST be translated.
- **FR-7: User Content Translation**: Issue titles and descriptions submitted in non-Urdu languages MUST be automatically translated to Urdu when the UI is in Urdu mode.

## Success Criteria
- **SC-1**: 100% of static UI text is translated and correctly displayed in Urdu.
- **SC-2**: The app layout correctly flips to RTL mode when Urdu is active, with no broken UI elements.
- **SC-3**: Urdu text is displayed with proper typography and is easily legible on both mobile and desktop.
- **SC-4**: Users can toggle between English, Telugu, and Urdu without page reload or state loss (except for language state).
- **SC-5**: User-generated content (titles/descriptions) is machine-translated with at least 80% accuracy for common civic terms.

## Key Entities
- **LanguageConfig**: Manages the available locales and RTL settings.
- **TranslationDictionary**: Stores the key-value pairs for Urdu translations.
- **TranslationService**: Abstract interface for machine translation of user content.

## Edge Cases & Failure Handling
- **Translation Failure**: If the machine translation API fails, the original content MUST be displayed with a small indicator that translation is unavailable.
- **Mixed Scripts**: Handle cases where a report contains both Urdu and English/Telugu scripts gracefully.

## Assumptions
- We assume that the existing `next-intl` setup is capable of handling RTL transitions.
- We assume that standard Urdu terminology for civic issues is understood by the target audience.

## Constitution Alignment
- [x] Must align with Community-Driven Verification: Urdu support allows a larger community to participate in verification.
- [x] Must align with Real-Time Transparency: The Urdu feed must update in real-time just like the English version.
- [x] Must align with Privacy-First Reporting: Language support does not change the anonymous nature of reporting.
