import { z } from 'astro:schema';

export const membershipFormSchema = z.object({
	dni: z.string().min(1, 'required'),
	name: z.string().min(1, 'required'),
	surnames: z.string().min(1, 'required'),
	birthdate: z
		.string()
		.min(1, 'required')
		.pipe(z.coerce.date({ invalid_type_error: 'required' })),
	address: z.string().min(1, 'required'),
	town: z.string().min(1, 'required'),
	postalCode: z
		.string()
		.min(1, 'required')
		.length(5, 'postalCodeLength')
		.regex(/^\d{5}$/u, 'postalCodeInvalid'),
	province: z.string().min(1, 'required'),
	phone1: z.string().min(1, 'required').min(9, 'phone'),
	phone2: z
		.string()
		.transform(val => val.trim())
		.pipe(z.string().min(9, 'phone').or(z.literal('')))
		.optional(),
	email: z.string().email('email').min(1, 'required'),
	infoSpanish: z.enum(['on', 'off']).default('off'),
	membership: z.enum(['on', 'off']).default('off'),
	language: z.enum(['es', 'eu']).default('eu'),
	terms: z.literal('on', { errorMap: () => ({ message: 'terms.required' }) })
});

export type MembershipFormData = z.infer<typeof membershipFormSchema>;
