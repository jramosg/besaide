
# Besaide

Besaide is a multilingual (Basque/Spanish) content-driven website built with Astro. It uses simple markdown content files for news and other pages and ships a lightweight, accessible component set.

This README covers quick setup, where content lives, contribution notes, and a proposed future improvement to add a content-editing workflow using Keystatic.

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

Build for production:

```bash
pnpm build
pnpm preview
```

## Project layout (important parts)

- `src/` — main source files (components, pages, layouts)
- `src/data/news/` — markdown content for news articles (there are language variants, e.g. `.md` and `-es.md` or language-specific files)
- `src/components/` — reusable UI components and page fragments
- `public/` — static assets served as-is

If you add new content, follow the existing files in `src/data/news/` for frontmatter keys and filename conventions.

## Writing content

Content in this site is currently authored as Markdown files in `src/data/news/` (and other data folders). Each file contains frontmatter used by the site to render lists and pages. When adding new content:

- Add the markdown file to the appropriate folder (for news: `src/data/news/`).
- Follow the existing frontmatter fields (title, date, language, summary, etc.).
- If your site uses language variants, add matching translated files (e.g. `article.md` and `article-es.md`).

Example frontmatter:

```md
---
title: "Sample News Item"
date: "2025-09-22"
language: "eu"
summary: "Short summary shown in listings."
---

Markdown content goes here.
```

## Future improvement — Keystatic (content editor)

Consider adding Keystatic for a simple, file-backed content editing experience. Keystatic (https://github.com/Thinkmill/keystatic) provides an admin UI for managing markdown content stored in your repository. It can speed up non-technical contributors adding news or pages while still keeping content in Git.

Suggested next steps to evaluate Keystatic:

1. Read Keystatic docs and examples: https://github.com/Thinkmill/keystatic
2. Prototype a small Keystatic config that maps to `src/data/news/` frontmatter fields
3. Add an optional admin route and restrict access (or run locally for editors)

Benefits:

- Simple UI for editors
- Keeps content as Markdown in the repo (Git-first workflow)
- Low operational overhead compared with a headless CMS

## Contributing

If you'd like to contribute:

1. Fork the repo and create a branch for your feature/fix.
2. Make changes and keep commits focused.
3. Open a PR describing the change.

If you're adding content, please follow the existing filename and frontmatter conventions.

## License

This project is licensed under the MIT License — see the [LICENSE](./LICENSE) file for details.

---