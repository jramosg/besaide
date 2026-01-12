import { z, type ImageFunction } from 'astro:content';

// Base Zod schema for events
export const eventsSchema = (image: ImageFunction) =>
	z
		.object({
			title: z.string(),
			date: z.date(),
			endDate: z.date().optional(),
			time: z.string().optional(),
			type: z.enum([
				'mountain',
				'mountain-martxa',
				'ski-alpino',
				'event',
				'course',
				'speleology'
			]),
			mountain: z.string().optional(),
			location: z.string().optional(),
			duration: z.string().optional(),
			meetingPoint: z.string().optional(),
			elevationGain: z.string().optional(),
			distance: z.string().optional(),
			image: image().optional(),
			summaryEu: z.string(),
			summaryEs: z.string(),
			prices: z
				.array(
					z.object({
						labelEu: z.string(),
						labelEs: z.string(),
						price: z.number()
					})
				)
				.optional(),
			priceDescriptionEu: z.string().optional(),
			priceDescriptionEs: z.string().optional(),
			inscriptionEu: z.string().optional(),
			inscriptionEs: z.string().optional(),
			routes: z
				.array(
					z.object({
						labelEu: z.string(),
						labelEs: z.string(),
						url: z.string().url(),
						image: image()
					})
				)
				.optional()
		})
		.refine(data => !data.endDate || data.endDate >= data.date, {
			message: 'endDate must be after date',
			path: ['endDate']
		});
