import type { Langs } from '@/i18n/ui';
import type { ProcessedNewsItem } from '@/types/News';
import { getCollection, type CollectionEntry } from 'astro:content';
import { slugify } from '@/utils/string';
import { getUrlFromID } from '@/i18n/utils';

export const sortedNewsPosts = async (): Promise<CollectionEntry<'news'>[]> => {
	// load collection
	let allNewsPosts = await getCollection('news');

	return allNewsPosts.sort((a, b) => {
		const dateA = new Date(a.data.date);
		const dateB = new Date(b.data.date);
		return dateB.getTime() - dateA.getTime(); // Newest first
	});
};

export function processNewsItem(
	item: CollectionEntry<'news'>,
	lang: Langs,
	newsSection: string
): ProcessedNewsItem {
	return {
		...item,
		slug: `${newsSection}/${slugify(item.id)}${lang === 'eu' ? '' : '-es'}`,
		title: lang === 'es' ? item.data.titleEs : item.data.titleEu,
		summary: lang === 'es' ? item.data.summaryEs : item.data.summaryEu
	};
}

export function processNewsItems(
	news: CollectionEntry<'news'>[],
	lang: Langs
): ProcessedNewsItem[] {
	const newsSection = getUrlFromID('news', lang);

	return news.map(item => processNewsItem(item, lang, newsSection));
}
