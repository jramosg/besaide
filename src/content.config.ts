import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { eventsSchema } from '@/schemas/events';
import { newsSchema } from '@/schemas/news';
import { functioningSchema } from '@/schemas/functioning';
import { membershipSchema } from '@/schemas/membership';
import { leixergarateAterpeaSchema } from '@/schemas/leixergarateAterpea';

const news = defineCollection({
	loader: glob({ pattern: '**/*.yaml', base: './src/data/news' }),
	schema: ({ image }) => newsSchema(image)
});

const newsContent = defineCollection({
	loader: glob({ pattern: '**/*.mdoc', base: './src/data/news' })
});

const events = defineCollection({
	loader: glob({ pattern: '**/*.mdoc', base: './src/data/events' }),
	schema: ({ image }) => eventsSchema(image)
});

const history = defineCollection({
	loader: glob({ pattern: '**/*.mdoc', base: './src/data/besaide/historia' })
});

const functioning = defineCollection({
	loader: glob({ pattern: '**/*.yaml', base: './src/data/funtzionamendua' }),
	schema: functioningSchema
});

const libraryMaps = defineCollection({
	loader: glob({ pattern: '**/*.mdoc', base: './src/data/library-maps' })
});

const membership = defineCollection({
	loader: glob({ pattern: '**/*.yaml', base: './src/data/membership' }),
	schema: membershipSchema
});

const leixergarateAterpea = defineCollection({
	loader: glob({
		pattern: '**/*.yaml',
		base: './src/data/leixergarate-aterpea'
	}),
	schema: leixergarateAterpeaSchema
});

// Expose your defined collection to Astro
// with the `collections` export
export const collections = {
	news,
	newsContent,
	events,
	history,
	functioning,
	libraryMaps,
	membership,
	leixergarateAterpea
};
