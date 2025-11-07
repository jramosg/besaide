<div align="center">

# 🏔️ Besaide - Production-Ready Multilingual Astro Website

**A modern, accessible, and SEO-optimized content management solution built with Astro, TypeScript, and Keystatic CMS**

[![Astro](https://img.shields.io/badge/Astro-FF5D01?style=flat&logo=astro&logoColor=white)](https://astro.build)
[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![pnpm](https://img.shields.io/badge/pnpm-F69220?style=flat&logo=pnpm&logoColor=white)](https://pnpm.io/)

[Live Demo](#) · [Report Bug](../../issues) · [Request Feature](../../issues)

</div>

---

## 📖 Table of Contents

- [Overview](#-overview)
- [Key Features](#-key-features)
- [Tech Stack](#-tech-stack)
- [Quick Start](#-quick-start)
- [Project Structure](#-project-structure)
- [Internationalization (i18n)](#-internationalization-i18n)
- [Content Management](#-content-management)
- [Accessibility](#-accessibility)
- [Performance](#-performance)
- [Deployment](#-deployment)
- [Contributing](#-contributing)
- [License](#-license)

---

## 🌟 Overview

Besaide is a **production-ready, multilingual content management website** showcasing modern web development best practices with Astro. Originally built for a Basque mountaineering club, this project demonstrates a complete implementation of i18n, headless CMS integration, and accessible component architecture.

Perfect for developers looking to build **SEO-friendly multilingual websites** with modern tooling and minimal JavaScript overhead.

### Why This Project?

- ✅ **Reference implementation** of custom i18n routing in Astro
- ✅ **Real-world example** of Keystatic CMS integration
- ✅ **Accessible-first** component library with ARIA support
- ✅ **Type-safe** multilingual content management
- ✅ **Zero-JS navigation** with progressive enhancement
- ✅ **Production-tested** patterns and architecture

---

## ✨ Key Features

### 🌍 Advanced Internationalization

- **Custom multilingual URL routing** with language-specific slugs (`/berriak` vs `/noticias`)
- **Type-safe translation system** with TypeScript
- **SEO-optimized** with proper `hreflang` tags and language meta tags
- **No query parameters** - clean URLs for better UX and SEO
- **Bidirectional language switching** with automatic URL mapping

### 📝 Headless CMS Integration

- **Keystatic CMS** for visual content editing
- **Git-based workflow** - all content stored as Markdown/MDX
- **No database required** - fully static generation
- **Live preview** in development mode
- **Multilingual content** editing with validation

### ♿ Accessibility & Performance

- **WCAG 2.1 Level AA compliant** components
- **Keyboard navigation** throughout
- **Focus management** for modals and dropdowns
- **Screen reader optimized** with proper ARIA attributes
- **Semantic HTML** structure
- **Minimal JavaScript** - most interactions work without JS

### 🎨 Developer Experience

- **TypeScript** for type safety
- **Component-driven** architecture
- **Hot module replacement** in development
- **Path aliases** (`@/components`, `@/config`)
- **Consistent code formatting** with Prettier
- **Type checking** with Astro Check

---

## 🛠️ Tech Stack

| Category | Technologies |
|----------|-------------|
| **Framework** | [Astro](https://astro.build) - Static Site Generator |
| **Language** | [TypeScript](https://www.typescriptlang.org/) |
| **CMS** | [Keystatic](https://keystatic.com/) - Git-based Headless CMS |
| **Content** | Markdoc, Markdown, YAML |
| **Styling** | CSS with design tokens, CSS nesting |
| **UI Components** | Astro components, React (Keystatic only) |
| **Icons** | [Lucide Icons](https://lucide.dev/) |
| **Deployment** | [Vercel](https://vercel.com) (adaptable to any platform) |
| **CI/CD** | GitHub Actions for automated builds and deployments |
| **Package Manager** | pnpm |

---

## 🚀 Quick Start

### Prerequisites

- **Node.js** 18.0 or higher
- **pnpm** 9.0 or higher (recommended)

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/besaide.git
cd besaide

# Install dependencies
pnpm install

# Start development server
pnpm dev
```

The site will be available at `http://localhost:1234`

### Content Management

Access the Keystatic admin interface at `http://localhost:1234/keystatic` to manage events and content visually.

### Build for Production

```bash
# Type check and build
pnpm build

# Preview production build
pnpm preview
```

---

## 📁 Project Structure

```
besaide/
├── src/
│   ├── assets/              # Images, icons, static assets
│   │   ├── icons/           # SVG icons
│   │   └── images/          # Optimized images
│   ├── components/          # Reusable Astro components
│   │   ├── buttons/         # Button components
│   │   ├── events/          # Event-specific components
│   │   ├── head/            # SEO and meta components
│   │   └── theme-switcher/  # Dark mode toggle
│   ├── components-pages/    # Page-specific components
│   ├── config/              # Configuration files
│   │   ├── company.ts       # Business info
│   │   ├── nav.ts           # Navigation structure
│   │   └── settings.ts      # Site settings
│   ├── data/                # Content collections
│   │   ├── events/          # Event markdown files
│   │   ├── news/            # News articles
│   │   └── library-maps/    # Static content
│   ├── i18n/                # Internationalization
│   │   ├── ui.ts            # Translation strings
│   │   └── utils.ts         # i18n utilities
│   ├── layouts/             # Page layouts
│   │   ├── Base.astro       # Base HTML template
│   │   └── Page.astro       # Page wrapper
│   ├── pages/               # File-based routing
│   │   ├── index.astro      # Homepage (Basque)
│   │   ├── es.astro         # Homepage (Spanish)
│   │   ├── agenda/          # Event listings
│   │   └── berriak/         # News (Basque)
│   ├── schemas/             # TypeScript schemas
│   ├── styles/              # Global styles
│   │   ├── global.css       # Base styles
│   │   ├── theme.css        # Design tokens
│   │   └── typography.css   # Type system
│   ├── types/               # TypeScript types
│   └── utils/               # Utility functions
├── public/                  # Static files
├── astro.config.mjs         # Astro configuration
├── keystatic.config.tsx     # Keystatic CMS config
├── tsconfig.json            # TypeScript config
└── package.json             # Dependencies
```

### Key Architecture Decisions

- **Component composition** - Small, reusable components over large monoliths
- **Type safety** - TypeScript throughout for better DX and fewer bugs
- **Design tokens** - CSS variables for consistent theming
- **Progressive enhancement** - Core functionality works without JavaScript

---

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

---

## 📝 Content Management

Besaide uses **Keystatic**, a Git-based headless CMS that stores content as Markdown files. This approach combines the benefits of a visual editor with version control.

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

---

## ♿ Accessibility

This project prioritizes **accessibility** as a core feature, not an afterthought:

### WCAG 2.1 Level AA Compliance

- ✅ **Keyboard navigation** - All interactive elements accessible via keyboard
- ✅ **Focus management** - Visual focus indicators and logical tab order
- ✅ **Screen reader support** - Proper ARIA labels, roles, and live regions
- ✅ **Semantic HTML** - Correct use of headings, landmarks, and lists
- ✅ **Color contrast** - Meets WCAG AA standards (4.5:1 minimum)
- ✅ **Responsive typography** - Readable at any zoom level

### Accessible Components

All interactive components follow accessibility best practices:

- **Navigation dropdown** - Arrow key navigation, Escape to close, proper ARIA
- **Mobile drawer menu** - Focus trap, keyboard controls, aria-modal
- **Language switcher** - Clear labels, expanded/collapsed states
- **Forms** - Associated lhttps://www.linkedin.com/in/jon-ramos-8ba55a14a/abels, error messaging, keyboard submission
- **Modals/Dialogs** - Focus restoration, backdrop clicks, ESC handling

## ⚡ Performance

Besaide is optimized for speed and Core Web Vitals:

### Build Output

- **Zero JavaScript** on most pages (only Keystatic admin requires JS)
- **Optimized images** - WebP/AVIF with lazy loading
- **Critical CSS** inlined for faster FCP
- **Prefetching** - Automatic link prefetching for instant navigation

### Performance Features

| Feature | Implementation |
|---------|---------------|
| **Image optimization** | Sharp + Astro Image |
| **Font loading** | Font subset + `font-display: swap` |
| **Code splitting** | Automatic per-route JS bundles |
| **CSS optimization** | Minified + unused CSS removal |
| **Caching** | Aggressive caching headers |
| **CDN** | Static assets on Vercel Edge Network |

### Lighthouse Scores

Typical Lighthouse scores (production build):

- **Performance:** 95-100
- **Accessibility:** 100
- **Best Practices:** 100
- **SEO:** 100

## 🚢 Deployment

### Deploy to Vercel (Recommended)

The project is configured for Vercel deployment:

```bash
# Install Vercel CLI
pnpm add -g vercel

# Deploy
vercel
```

Or use the [Vercel Dashboard](https://vercel.com/new):

1. Import your repository
2. Framework preset: **Astro**
3. Build command: `pnpm build`
4. Output directory: `dist`

### Deploy to Netlify

```bash
# Build command
pnpm build

# Publish directory
dist

# Environment variables (if needed)
# None required for basic deployment
```

### Deploy to Cloudflare Pages

```bash
# Build command
pnpm build

# Build output directory
dist

# Environment variables
NODE_VERSION=18
```

### Static Hosting (Any Platform)

Build the site and upload the `dist` folder:

```bash
pnpm build
# Upload ./dist to your static host
```

Compatible with: GitHub Pages, AWS S3, DigitalOcean, etc.

---

## 🏗️ Development Best Practices

### Code Organization

- **Atomic components** - Start small, compose upward
- **Colocation** - Keep related files together
- **Naming conventions** - PascalCase for components, camelCase for utils
- **TypeScript strict mode** - Catch errors at compile time

### Styling Conventions

- **CSS custom properties** for theming (`--theme-primary`, `--s4`)
- **BEM-inspired naming** for component styles
- **Mobile-first** responsive design
- **Utility-first** where appropriate (but not utility CSS framework)

### i18n Patterns

When adding new translatable content:

1. Add translation keys to `src/i18n/ui.ts`
2. Update `langMapping` for new routes
3. Create language-specific page files
4. Test language switching thoroughly

### Content Structure

- **Frontmatter first** - Metadata at the top of markdown files
- **Consistent dates** - ISO 8601 format (`YYYY-MM-DD`)
- **Image references** - Relative paths from content files

---

## 🤝 Contributing

Contributions are welcome! This project aims to be a **reference implementation** for the Astro community.

### How to Contribute

1. **Fork the repository**
2. **Create a feature branch** (`git checkout -b feature/amazing-feature`)
3. **Make your changes** - Follow existing patterns
4. **Test thoroughly** - Build, accessibility, i18n
5. **Commit with clear messages** (`git commit -m 'Add amazing feature'`)
6. **Push to your fork** (`git push origin feature/amazing-feature`)
7. **Open a Pull Request**

### Contribution Ideas

- 📚 Improve documentation
- 🌍 Add support for more languages
- ♿ Enhance accessibility
- 🎨 Create new component patterns
- 🐛 Fix bugs
- ⚡ Performance optimizations
- 🧪 Add tests

### Code Style

- Run `pnpm format` before committing
- Follow existing TypeScript patterns
- Document complex logic with comments
- Keep components focused and reusable

---

## 📚 Learn More

### Astro Resources

- [Astro Documentation](https://docs.astro.build)
- [Astro Discord Community](https://astro.build/chat)
- [Astro Blog](https://astro.build/blog)

### Related Projects

- [Keystatic](https://keystatic.com/) - Git-based CMS
- [Markdoc](https://markdoc.dev/) - Markdown-based authoring framework

---

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](./LICENSE) file for details.

You are free to use this code for personal or commercial projects. Attribution appreciated but not required.

---

## 🙏 Acknowledgments

- **Design** by [Nerea Dorronsoro](https://es.linkedin.com/in/nerea-dorronsoro) - UI/UX Design
- **Development** by [Jon Ramos](https://www.linkedin.com/in/jon-ramos-8ba55a14a/) - Full Stack Development
- Built with [Astro](https://astro.build) - The web framework for content-driven websites
- CMS powered by [Keystatic](https://keystatic.com/)
- Icons from [Lucide](https://lucide.dev/)
- Deployed on [Vercel](https://vercel.com)

---

<div align="center">

**⭐ If you found this project helpful, please consider giving it a star!**

</div>
