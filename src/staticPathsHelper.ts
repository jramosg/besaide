import type { PaginateFunction } from 'astro';
import { getCollection } from 'astro:content';
import { slugify } from '@/utils/string';
import type { Langs } from './i18n/ui';

type Options = {
	pageSize?: number;
};

export async function NewsStaticPaths(
	lang: Langs,
	paginate: PaginateFunction,
	opts: Options = { pageSize: 10 }
): Promise<ReturnType<PaginateFunction>> {
	// load collection
	const allNewsPosts = await getCollection('news');
	const sortedAllNewsPosts = allNewsPosts.sort((a, b) => {
		const dateA = new Date(a.data.date);
		const dateB = new Date(b.data.date);
		return dateB.getTime() - dateA.getTime(); // Newest first
	});

	// filter by language if entries provide language metadata
	const filtered = sortedAllNewsPosts.filter(entry => {
		const entryLang = entry?.data?.lang ?? null;
		if (!entryLang) return true;
		return entryLang === lang;
	});

	return paginate(filtered, { pageSize: opts.pageSize });
}

export async function SingleNewsStaticPaths(lang: Langs) {
	// load collection
	const allNewsPosts = await getCollection('news');

	// filter by language if entries provide language metadata
	const filtered = allNewsPosts.filter(entry => {
		const entryLang = entry?.data?.lang ?? null;
		if (!entryLang) return true;
		return entryLang === lang;
	});

	return filtered.map(post => {
		return {
			params: {
				singleNewsId: slugify(post.id)
			},
			props: { post }
		};
	});
}
