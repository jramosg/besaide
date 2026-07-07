import { z } from 'astro/zod';

export const functioningSchema = z.object({
	introductionEu: z.string().optional(),
	introductionEs: z.string().optional(),
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
