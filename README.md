# Besaide

Besaide is a multilingual (Basque/Spanish) content-driven website built with Astro. It uses simple markdown content files for news and events, and includes Keystatic for content management. The site ships a lightweight, accessible component set.

This README covers quick setup, where content lives, how to use the content editor, and contribution notes.

## Quick start

Prerequisites:

- Node.js 18+ (recommended)
- pnpm (preferred package manager)

Install and run locally:

```bash
pnpm install
pnpm dev
```

The dev server will start on http://localhost:4321 by default.

**Content management:** Access the Keystatic admin interface at http://localhost:4321/keystatic to manage events and other content.

Build for production:

```bash
pnpm build
pnpm preview
```

## Project layout (important parts)

- `src/` — main source files (components, pages, layouts)
- `src/data/news/` — markdown content for news articles (there are language variants, e.g. `.md` and `-es.md` or language-specific files)
- `src/data/events/` — markdown content for events/activities, managed via Keystatic
- `src/components/` — reusable UI components and page fragments
- `public/` — static assets served as-is
- `keystatic.config.ts` — Keystatic configuration for content management

If you add new content manually, follow the existing files in the respective data folders for frontmatter keys and filename conventions.

## Internationalization (i18n)

This project implements a custom multilingual URL system supporting Basque (eu) and Spanish (es). The implementation includes:

### Multilingual URL Architecture

The site uses **language-specific URLs** rather than query parameters or subdomains:

- **Basque (default):** `/` → `/ibilbideak` → `/berriak`
- **Spanish:** `/es` → `/rutas` → `/noticias`

Each page has a unique slug per language that maps to a shared page ID internally. This approach provides:

- SEO-friendly URLs in each language
- Clear language context for users and search engines
- No confusion between language variants

### How It Works

The i18n system is built on three core utilities in `src/i18n/utils.ts`:

1. **`getLangFromUrl(url)`** — Detects the current language from the URL path
2. **`getUrlFromID(slug, lang)`** — Generates the correct URL for a page ID in a specific language
3. **`switchLanguage(url)`** — Creates the alternate language URL for the current page

A central `langMapping` object maintains the relationship between URL slugs, languages, and page IDs:

```typescript
const langMapping = {
  'agenda': { lang: 'eu', id: 'agenda' },
  'agenda-es': { lang: 'es', id: 'agenda' },
  'berriak': { lang: 'eu', id: 'news' },
  'noticias': { lang: 'es', id: 'news' },
  // ... more mappings
};
```

### Usage in Components

```astro
---
import { getLangFromUrl, getUrlFromID, useTranslations } from '@/i18n/utils';

const url = Astro.url;
const lang = getLangFromUrl(url);
const t = useTranslations(lang);
---

<!-- Get translated text -->
<h1>{t('Welcome')}</h1>

<!-- Generate language-specific URLs -->
<a href={getUrlFromID('news', lang)}>{t('News')}</a>
```

### Adding New Translated Pages

1. Create the page files with language-specific slugs (e.g., `my-page.astro` and `my-page-es.astro`)
2. Add entries to the `langMapping` in `src/i18n/utils.ts`:
   ```typescript
   'my-page': { lang: 'eu', id: 'my-page' },
   'my-page-es': { lang: 'es', id: 'my-page' },
   ```
3. Add translations to `src/i18n/ui.ts` if needed

The language switcher and navigation will automatically work with the new pages.

## Content management

### Using Keystatic (recommended for events)

The site includes Keystatic for easy content management, especially for events. To use the content editor:

1. **Start the development server:**

   ```bash
   pnpm dev
   ```

2. **Access the admin interface:**
   Navigate to `http://localhost:4321/keystatic` in your browser

3. **Manage events:**
   - Create, edit, and delete events through the web interface
   - All fields are properly labeled in both Basque and Spanish
   - Events are automatically saved as `.mdoc` files in `src/data/events/`

### Manual content editing

Content can also be authored directly as Markdown files:

- **News articles:** `src/data/news/` (with language variants like `.md` and `-es.md`)
- **Events:** `src/data/events/` (use `.mdoc` format for Keystatic compatibility)

When adding content manually:

- Follow the existing frontmatter fields in similar files
- For multilingual content, create separate files for each language
- Use consistent filename conventions

Example news frontmatter:

```md
---
title: 'Sample News Item'
date: '2025-09-22'
language: 'eu'
summary: 'Short summary shown in listings.'
---

Markdown content goes here.
```

### Keystatic features

- **File-based:** All content remains as Markdown files in Git
- **Multilingual support:** Built-in language selection for Basque/Spanish
- **Rich editing:** User-friendly interface with validation
- **Local storage:** No external dependencies or databases required

## Contributing

If you'd like to contribute:

1. Fork the repo and create a branch for your feature/fix.
2. Make changes and keep commits focused.
3. Open a PR describing the change.

If you're adding content, please follow the existing filename and frontmatter conventions.

## License

This project is licensed under the MIT License — see the [LICENSE](./LICENSE) file for details.

---
