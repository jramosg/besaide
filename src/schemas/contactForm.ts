import { z } from 'astro:schema';

export const contactFormSchema = z.object({
	name: z.string().min(1, 'required'),
	email: z.string().email('email').min(1, 'required'),
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
		{ errorMap: () => ({ message: 'required' }) }
	),
	message: z.string().min(1, { message: 'required' }),
	language: z.enum(['es', 'eu']).default('eu'),
	terms: z.literal('on', { errorMap: () => ({ message: 'terms.required' }) })
});

export type ContactFormData = z.infer<typeof contactFormSchema>;
