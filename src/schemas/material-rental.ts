import { z } from 'astro:content';

// Base Zod schema for material rental items
export const materialRentalSchema = z.object({
	name_eu: z.string(),
	name_es: z.string(),
	icon: z.enum(['ice-axe', 'other', 'snowshoe', 'shovel', 'helmet', 'cramps']),
	description_eu: z.string().optional(),
	description_es: z.string().optional(),
	price: z.number(),
	available: z.boolean().default(true),
	order: z.number().default(0)
});
