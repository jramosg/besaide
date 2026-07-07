import { z } from 'astro/zod';

const heroSlideSchema = z.object({
	titleEu: z.string().nonempty('Izenburua euskeraz beharrezkoa da'),
	titleEs: z.string().nonempty('Izenburua espanolaz beharrezkoa da'),
	descriptionEu: z.string().optional(),
	descriptionEs: z.string().optional(),
	buttonLabelEu: z.string().optional(),
	buttonLabelEs: z.string().optional(),
	buttonLinkEu: z.string().optional(),
	buttonLinkEs: z.string().optional()
});

export const homepageSchema = z.object({
	slides: z.array(heroSlideSchema).min(1)
});
