import type { ImageFunction } from 'astro:content';
import { z } from 'astro/zod';

export const newsSchema = (image: ImageFunction) =>
	z.object({
		titleEu: z.string(),
		titleEs: z.string().optional(),
		date: z.date(),
		image: image().optional(),
		summaryEu: z.string().max(200),
		summaryEs: z.string().max(200)
	});
