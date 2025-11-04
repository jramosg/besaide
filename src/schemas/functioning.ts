import { z } from 'astro:content';

export const functioningSchema = z.object({
	introductionEu: z.string(),
	introductionEs: z.string(),
	boardMembers: z.array(
		z.object({
			positionEu: z.string(),
			positionEs: z.string(),
			name: z.string()
		})
	),
	closingTextEu: z.string(),
	closingTextEs: z.string()
});
