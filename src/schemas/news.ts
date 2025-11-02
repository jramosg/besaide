import { z } from 'astro:content';

// News schema for Astro content collections
// Matches Keystatic CMS structure with separate EU/ES content
export const newsSchema = z.object({
	titleEu: z.string(),
	titleEs: z.string(),
	date: z.date(),
	image: z.string().optional(),
	summaryEu: z.string().max(200),
	summaryEs: z.string().max(200)
});
