import type { CollectionEntry } from 'astro:content';
import type { ImageMetadata } from 'astro';

export type ProcessedEvent = CollectionEntry<'events'> & {
	slug: string;
	isPast: boolean;
};
