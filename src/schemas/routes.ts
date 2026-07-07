import type { ImageFunction } from 'astro:content';
import { z } from 'astro/zod';

export const routesSchema = (image: ImageFunction) =>
	z.object({
		titleEu: z.string(),
		titleEs: z.string(),
		image: image(),
		wikilocUrl: z.url(),
		fromLeixargarate: z.boolean().default(false),
		descriptionEu: z.string().optional(),
		descriptionEs: z.string().optional()
	});
