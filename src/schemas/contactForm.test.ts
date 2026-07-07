import { describe, expect, it } from 'vitest';

import { contactFormSchema } from '@/schemas/contactForm';

const validPayload = () => ({
	name: 'Jon',
	email: 'jon@example.com',
	website: '',
	startedAt: String(Date.now() - 5000),
	phone: '666777888',
	subject: 'contact.form.subject.membership',
	message: 'Kaixo, bazkidetza informazioa jaso nahi nuke.',
	language: 'eu',
	terms: 'on'
});

describe('contactFormSchema', () => {
	it('accepts a normal contact payload', () => {
		expect(contactFormSchema.safeParse(validPayload()).success).toBe(true);
	});

	it('rejects low-quality contact messages before submit', () => {
		const result = contactFormSchema.safeParse({
			...validPayload(),
			message: 'jkhhlklhk'
		});

		expect(result.success).toBe(false);
		if (!result.success) {
			expect(result.error.issues[0]?.message).toBe('messageQuality');
		}
	});
});
