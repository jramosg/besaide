import type { PaginateFunction } from 'astro';
import { slugify } from '@/utils/string';
import type { Langs } from './i18n/ui';
import { sortedAndFilteredEvents } from './utils/events';
import { sortedNewsPosts } from './utils/news';

type Options = {
	pageSize?: number;
};

export async function NewsStaticPaths(
	paginate: PaginateFunction,
	opts: Options = { pageSize: 10 }
): Promise<ReturnType<PaginateFunction>> {
	return paginate(await sortedNewsPosts(), {
		pageSize: opts.pageSize
	});
}

export async function SingleNewsStaticPaths(lang: Langs) {
	const posts = await sortedNewsPosts();

	return posts.map(post => {
		return {
			params: {
				singleNewsId: slugify(`${post.id}${lang === 'eu' ? '' : '-es'}`)
			},
			props: { post }
		};
	});
}

export async function SingleEventStaticPaths() {
	const events = await sortedAndFilteredEvents();

	return events.map(event => {
		return {
			params: {
				singleEventId: slugify(event.id)
			},
			props: { event }
		};
	});
}
