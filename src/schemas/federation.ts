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
	)
});
