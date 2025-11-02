import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { eventsSchema } from '@/schemas/events';
import { newsSchema } from '@/schemas/news';

const news = defineCollection({
	loader: glob({ pattern: '**/*.yaml', base: './src/data/news' }),
	schema: newsSchema
});

const newsContent = defineCollection({
	loader: glob({ pattern: '**/*.mdoc', base: './src/data/news' })
});

const events = defineCollection({
	loader: glob({ pattern: '**/*.mdoc', base: './src/data/events' }),
	schema: eventsSchema
});

// Expose your defined collection to Astro
// with the `collections` export
export const collections = { news, newsContent, events };
