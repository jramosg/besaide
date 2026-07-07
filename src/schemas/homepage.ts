import { z } from 'astro/zod';

const heroSlideSchema = z.object({
	titleEu: z.string(),
	titleEs: z.string(),
	descriptionEu: z.string().optional(),
	descriptionEs: z.string().optional(),
	buttonLabelEu: z.string().optional(),
	buttonLabelEs: z.string().optional(),
	buttonLinkEu: z.string().optional(),
	buttonLinkEs: z.string().optional()
});

export const homepageSchema = z.object({
	slides: z.array(heroSlideSchema)
});
