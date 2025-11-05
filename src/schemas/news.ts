import { z, type ImageFunction } from 'astro:content';

export const newsSchema = (image: ImageFunction) =>
	z.object({
		titleEu: z.string(),
		titleEs: z.string(),
		date: z.date(),
		image: image(),
		summaryEu: z.string().max(200),
		summaryEs: z.string().max(200)
	});
