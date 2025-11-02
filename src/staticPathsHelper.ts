import type { PaginateFunction } from 'astro';
import { getCollection, type CollectionEntry } from 'astro:content';
import { slugify } from '@/utils/string';
import type { Langs } from './i18n/ui';
import { processNewsImage } from '@/utils/images';
import type { ImageMetadata } from 'astro';
import { getUrlFromID } from '@/i18n/utils';

type Options = {
	pageSize?: number;
};

export type ProcessedNewsItem = CollectionEntry<'news'> & {
	processedImage: ImageMetadata;
	slug: string;
	title: string;
	summary: string;
};

export const sortedAndFilteredNewsPosts = async (): Promise<
	CollectionEntry<'news'>[]
> => {
	// load collection
	let allNewsPosts = await getCollection('news');

	return allNewsPosts.sort((a, b) => {
		const dateA = new Date(a.data.date);
		const dateB = new Date(b.data.date);
		return dateB.getTime() - dateA.getTime(); // Newest first
	});
};

export async function NewsStaticPaths(
	paginate: PaginateFunction,
	opts: Options = { pageSize: 10 }
): Promise<ReturnType<PaginateFunction>> {
	return paginate(await sortedAndFilteredNewsPosts(), {
		pageSize: opts.pageSize
	});
}

export async function processNewsItem(
	item: CollectionEntry<'news'>,
	lang: Langs,
	newsSection: string
): Promise<ProcessedNewsItem> {
	const processedImage = await processNewsImage(item.id, item.data.image);

	return {
		...item,
		processedImage,
		slug: `${newsSection}/${slugify(item.id)}${lang === 'eu' ? '' : '-es'}`,
		title: lang === 'es' ? item.data.titleEs : item.data.titleEu,
		summary: lang === 'es' ? item.data.summaryEs : item.data.summaryEu
	};
}

export async function processNewsItems(
	news: CollectionEntry<'news'>[],
	lang: Langs
): Promise<ProcessedNewsItem[]> {
	const newsSection = getUrlFromID('news', lang);

	return await Promise.all(
		news.map(item => processNewsItem(item, lang, newsSection))
	);
}

export async function SingleNewsStaticPaths(lang: Langs) {
	const posts = await sortedAndFilteredNewsPosts();

	return posts.map(post => {
		return {
			params: {
				singleNewsId: slugify(`${post.id}${lang === 'eu' ? '' : '-es'}`)
			},
			props: { post }
		};
	});
}

// Events helper functions
export const sortedAndFilteredEvents = async (
	lang: Langs
): Promise<CollectionEntry<'events'>[]> => {
	// load collection
	let allEvents = await getCollection('events');
	allEvents.sort((a, b) => {
		const dateA = new Date(a.data.date);
		const dateB = new Date(b.data.date);
		return dateA.getTime() - dateB.getTime(); // Oldest first (upcoming events)
	});

	// filter by language if entries provide language metadata
	return allEvents.filter(entry => {
		const entryLang = entry?.data?.lang ?? null;
		if (!entryLang) return true;
		return entryLang === lang;
	});
};

export async function EventsStaticPaths(
	lang: Langs,
	paginate: PaginateFunction,
	opts: Options = { pageSize: 10 }
): Promise<ReturnType<PaginateFunction>> {
	return paginate(await sortedAndFilteredEvents(lang), {
		pageSize: opts.pageSize
	});
}

export async function SingleEventStaticPaths(lang: Langs) {
	const events = await sortedAndFilteredEvents(lang);

	return events.map(event => {
		return {
			params: {
				singleEventId: slugify(event.id)
			},
			props: { event }
		};
	});
}
