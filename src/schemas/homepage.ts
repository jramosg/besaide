import { z } from 'astro:content';

export const homepageSchema = z.object({
	membershipTitleEu: z.string(),
	membershipTitleEs: z.string(),
	membershipDescriptionEu: z.string().optional(),
	membershipDescriptionEs: z.string().optional()
});
