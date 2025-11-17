import { z, type ImageFunction } from 'astro:content';

export const routesSchema = (image: ImageFunction) =>
	z.object({
		titleEu: z.string(),
		titleEs: z.string(),
		image: image(),
		wikilocUrl: z.string().url(),
		fromLeixargarate: z.boolean().default(false),
		descriptionEu: z.string().optional(),
		descriptionEs: z.string().optional()
	});
