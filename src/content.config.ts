import { z, defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import type { Langs } from './i18n/ui';

const news = defineCollection({
	loader: glob({ pattern: '**/*.md', base: './src/data/news' }),
	schema: z.object({
		title: z.string(),
        lang: z.string(),
        date: z.string(),
		image: z.string().optional(),
		imageAlt: z.string().optional(),
        summary: z.string(),
	})
});

// Expose your defined collection to Astro
// with the `collections` export
export const collections = { news };
