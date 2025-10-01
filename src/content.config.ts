import { z, defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';

const news = defineCollection({
	loader: glob({ pattern: '**/*.md', base: './src/data/news' }),
	schema: z.object({
		title: z.string(),
		lang: z.enum(['eu', 'es']),
		date: z.string(),
		image: z.string().optional(),
		imageAlt: z.string().optional(),
		summary: z.string()
	})
});

const events = defineCollection({
	loader: glob({ pattern: '**/*.md', base: './src/data/events' }),
	schema: z.object({
		title: z.string(),
		lang: z.string(),
		date: z.string(),
		time: z.string().optional(),
		location: z.string(),
		mountain: z.string(),
		region: z.string(), // 'euskal-mendiak' or 'pirineoak'
		difficulty: z.enum(['erraza', 'ertaina', 'zaila']),
		distance: z.string().optional(),
		elevation: z.string().optional(),
		duration: z.string().optional(),
		meetingPoint: z.string().optional(),
		image: z.string().optional(),
		imageAlt: z.string().optional(),
		summary: z.string(),
		featured: z.boolean().optional()
	})
});

// Expose your defined collection to Astro
// with the `collections` export
export const collections = { news, events };
