import type { PaginateFunction } from 'astro';
import { getCollection, type CollectionEntry } from 'astro:content';
import { slugify } from '@/utils/string';
import type { Langs } from './i18n/ui';

type Options = {
	pageSize?: number;
};

export const sortedAndFilteredNewsPosts = async (
	lang: Langs
): Promise<CollectionEntry<'news'>[]> => {
	// load collection
	let allNewsPosts = await getCollection('news');
	allNewsPosts.sort((a, b) => {
		const dateA = new Date(a.data.date);
		const dateB = new Date(b.data.date);
		return dateB.getTime() - dateA.getTime(); // Newest first
	});

	// filter by language if entries provide language metadata
	return allNewsPosts.filter(entry => {
		const entryLang = entry?.data?.lang ?? null;
		if (!entryLang) return true;
		return entryLang === lang;
	});
};

export async function NewsStaticPaths(
	lang: Langs,
	paginate: PaginateFunction,
	opts: Options = { pageSize: 10 }
): Promise<ReturnType<PaginateFunction>> {
	return paginate(await sortedAndFilteredNewsPosts(lang), {
		pageSize: opts.pageSize
	});
}

export async function SingleNewsStaticPaths(lang: Langs) {
	const posts = await sortedAndFilteredNewsPosts(lang);

	return posts.map(post => {
		return {
			params: {
				singleNewsId: slugify(post.id)
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
