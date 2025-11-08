import { z } from 'astro:content';

export const membershipSchema = z.object({
	benefitsEu: z.string(),
	benefitsEs: z.string(),
	prices: z.array(
		z.object({
			labelEu: z.string(),
			labelEs: z.string(),
			price: z.number()
		})
	)
});
