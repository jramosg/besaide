import { z, type infer as ZodInfer } from 'astro/zod';

import { isLowQualityText, isSuspiciousName } from '@/utils/formSpam';

export const contactFormSchema = z.object({
	name: z
		.string()
		.min(1, 'required')
		.refine(value => !isSuspiciousName(value), {
			message: 'fieldQuality'
		}),
	email: z.email('email').min(1, 'required'),
	website: z.string().max(0).optional(),
	startedAt: z.coerce.number().optional(),
	phone: z
		.string()
		.transform((val: string) => val.trim())
		.pipe(z.string().min(9, 'phone').or(z.literal('')))
		.optional(),
	subject: z.enum(
		[
			'contact.form.subject.membership',
			'contact.form.subject.services',
			'contact.form.subject.activities',
			'contact.form.subject.rental',
			'contact.form.subject.shelter',
			'contact.form.subject.other',
			'{{subject}}'
		],
		{ error: 'required' }
	),
	message: z
		.string()
		.min(1, { error: 'required' })
		.refine(value => !isLowQualityText(value), {
			message: 'messageQuality'
		}),
	language: z.enum(['es', 'eu']).default('eu'),
	terms: z.literal('on', { error: 'terms.required' })
});

export type ContactFormData = ZodInfer<typeof contactFormSchema>;
