import { z } from 'astro/zod';

export const federationCollectionSchema = z.object({
	pricingTable: z.array(
		z.object({
			regionEu: z.string(),
			regionEs: z.string(),

			priceChildren: z.number(),
			priceYouth: z.number(),
			priceAdults: z.number(),
			priceSeniors: z.number()
		})
	),
	infoCardEu: z.string(),
	infoCardEs: z.string(),
	extras: z.array(
		z.object({
			nameEu: z.string(),
			nameEs: z.string(),
			descriptionEu: z.string().optional(),
			descriptionEs: z.string().optional(),
			pricing: z.discriminatedUnion('discriminant', [
				z.object({
					discriminant: z.literal('fourColumn'),
					value: z.object({
						priceChildren: z.number().optional(),
						priceYouth: z.number().optional(),
						priceAdults: z.number().optional(),
						priceSeniors: z.number().optional()
					})
				}),
				z.object({
					discriminant: z.literal('twoColumn'),
					value: z.object({
						priceAll: z.number().optional()
					})
				})
			])
		})
	)
});
