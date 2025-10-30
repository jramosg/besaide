import { z } from 'astro:content';

// Base Zod schema for events
export const eventsSchema = z
	.object({
		title: z.string(),
		lang: z.string(),
		date: z.date(),
		endDate: z.date().optional(),
		time: z.string().optional(),
		// Keystatic conditional field structure
		typeSpecificFields: z.discriminatedUnion('discriminant', [
			z.object({
				discriminant: z.literal('mountain'),
				value: z.object({
					mountain: z.string(),
					difficulty: z.enum(['erraza', 'ertaina', 'zaila']),
					elevation: z.string()
				})
			}),
			z.object({
				discriminant: z.literal('ski-alpino'),
				value: z.object({
					location: z.string()
				})
			})
		]),
		distance: z.string().optional(),
		duration: z.string().optional(),
		meetingPoint: z.string().optional(),
		image: z.string().optional(),
		imageAlt: z.string().optional(),
		featured: z.boolean().optional()
	})
	.refine(data => !data.endDate || data.endDate > data.date, {
		message: 'endDate must be after date',
		path: ['endDate']
	});
