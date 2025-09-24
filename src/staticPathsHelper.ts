import type { PaginateFunction } from 'astro';
import { getCollection } from 'astro:content';
import { slugify } from '@/utils/string';
import type { Langs } from './i18n/ui';

type Options = {
	pageSize?: number;
};

const sortedAndFilteredNewsPosts = async (lang: Langs) => {
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
