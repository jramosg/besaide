import type { PaginateFunction,  } from 'astro';
import { getCollection } from 'astro:content';
import { getLangFromUrl } from './i18n/utils';
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
    const filtered = allNewsPosts.filter((entry) => {
		const entryLang = entry?.data?.lang ?? entry?.lang ?? null;
		if (!entryLang) return true;
		return entryLang === lang;
	});

	return paginate(filtered, { pageSize: opts.pageSize });
}
