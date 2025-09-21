import { ui, defaultLang } from './ui';
import type { Langs, UIKeys } from './ui';

const newLangMap = { es: 'eu', eu: 'es' } as const;

type LangMappingEntry = {
	lang: string;
	slug: string;
};
type LangMapping = { [key: string]: LangMappingEntry };

const langMapping: LangMapping = {
	'aviso-legal-y-politica-de-privacidad': {
		lang: 'es',
		slug: 'cookies-policy'
	},
	'lege-oharra-eta-pribatutasun-politika': {
		lang: 'eu',
		slug: 'cookies-policy'
	},
	es: { lang: 'es', slug: '' },
	'': { lang: 'eu', slug: '' }
};

export function getLangFromUrl(url: URL): Langs {
	const [, firstPathSegment] = url.pathname.split('/');
	const lang = langMapping[firstPathSegment]?.lang;
	if (lang in ui) return lang as Langs;
	return defaultLang;
}

export function switchLanguage(url: URL): string | null {
	const pathParts = url.pathname.split('/').filter(Boolean);

	// Handle homepage routing
	if (pathParts.length === 0 || url.pathname === '/') {
		// We're on the homepage, switch to the other language homepage
		const currentLang = getLangFromUrl(url);
		const newLang = newLangMap[currentLang as keyof typeof newLangMap];

		if (newLang === 'eu') {
			return '/'; // Basque is the default, so root path
		} else if (newLang === 'es') {
			return '/es'; // Spanish gets its own path
		}
	}

	const currentSlug: string = pathParts[pathParts.length - 1];

	// Find the mapping entry for the current slug
	const currentEntry: LangMappingEntry | null =
		langMapping[currentSlug] || null;

	if (!currentEntry) return null;

	const currentLang = currentEntry.lang;

	for (const [slug, info] of Object.entries(langMapping)) {
		if (info.lang !== currentLang && info.slug === currentEntry.slug) {
			return `/${slug}`;
		}
	}
	return null;
}

export function useTranslations(lang: Langs) {
	return function t(key: UIKeys) {
		const langObj = ui[lang] as Record<UIKeys, string>;
		return langObj[key] || key;
	};
}

export function getStaticLangPaths(): { params: { lang: Langs } }[] {
	const langs = Object.keys(ui) as Langs[];

	const toParam = (lang: keyof typeof ui) => ({
		params: { lang }
	});

	return langs.map(toParam);
}

/**
 * Format a date for the given language.
 * - 'eu' => yyyy-MM-dd
 * - 'es' => dd/MM/yyyy
 * Accepts Date | string | number. If invalid, returns an empty string.
 */
export function formatDate(input: Date | string | number, lang?: Langs): string {
	const date = input instanceof Date ? input : new Date(input);
	if (Number.isNaN(date.getTime())) return '';

	const pad = (n: number) => String(n).padStart(2, '0');
	const yyyy = date.getFullYear();
	const mm = pad(date.getMonth() + 1);
	const dd = pad(date.getDate());

	const useLang = lang;

	if (useLang === 'es') {
		return `${dd}/${mm}/${yyyy}`;
	}
	// default 'eu' format
	return `${yyyy}-${mm}-${dd}`;
}
