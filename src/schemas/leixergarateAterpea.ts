import { z } from 'astro:content';

export const leixergarateAterpeaSchema = z.object({
	descriptionEu: z.string(),
	descriptionEs: z.string(),
	contributionEu: z.string(),
	contributionEs: z.string(),
	prices: z.array(
		z.object({
			labelEu: z.string(),
			labelEs: z.string(),
			price: z.number(),
			descriptionEu: z.string().optional(),
			descriptionEs: z.string().optional()
		})
	)
});
