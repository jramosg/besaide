import type { CollectionEntry } from 'astro:content';

export type ProcessedNewsItem = CollectionEntry<'news'> & {
	slug: string;
	title: string;
	summary: string;
};
