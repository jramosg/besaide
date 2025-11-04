import type { CollectionEntry } from 'astro:content';

export type ProcessedNewsItem = CollectionEntry<'news'> & {
	processedImage: ImageMetadata;
	slug: string;
	title: string;
	summary: string;
};
