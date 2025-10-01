import { ui, defaultLang } from './ui';
import type { Langs, UIKeys } from './ui';

const newLangMap = { es: 'eu', eu: 'es' } as const;

type LangMappingEntry = {
	lang: string;
	id: string;
};
type LangMapping = { [key: string]: LangMappingEntry };

const langMapping: LangMapping = {
	'aviso-legal-y-politica-de-privacidad': {
		lang: 'es',
		id: 'cookies-policy'
	},
	'lege-oharra-eta-pribatutasun-politika': {
		lang: 'eu',
		id: 'cookies-policy'
	},
	es: { lang: 'es', id: '' },
	'': { lang: 'eu', id: '' },
	noticias: { lang: 'es', id: 'news' },
	berriak: { lang: 'eu', id: 'news' },
	'agenda-es': { lang: 'es', id: 'agenda' },
	agenda: { lang: 'eu', id: 'agenda' }
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
		const newLang = newLangMap[currentLang];

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
		if (info.lang !== currentLang && info.id === currentEntry.id) {
			return `/${slug}`;
		}
	}
	return null;
}

export function getUrlFromID(slug: string, lang: Langs): string {
	for (const [urlSlug, info] of Object.entries(langMapping)) {
		if (info.lang === lang && info.id === slug) {
			return `/${urlSlug}`;
		}
	}
	return '';
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

export function getIdfromUrl(url: URL): string | null {
	let [, firstPathSegment] = url.pathname.split('/');
	firstPathSegment = firstPathSegment || '';
	const mappingEntry = langMapping[firstPathSegment] || null;
	return mappingEntry ? mappingEntry.id : null;
}

/**
 * Format a date for the given language.
 * - 'eu' => yyyy-MM-dd
 * - 'es' => dd/MM/yyyy
 * Accepts Date | string | number. If invalid, returns an empty string.
 */
export function formatDate(
	input: Date | string | number,
	lang?: Langs
): string {
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
