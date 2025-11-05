import type { CollectionEntry } from 'astro:content';

export type ProcessedEvent = CollectionEntry<'events'> & {
	slug: string;
	isPast: boolean;
};
