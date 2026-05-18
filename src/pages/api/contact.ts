import type { APIRoute } from 'astro';

import { contactFormSchema } from '@/schemas/contactForm';
import { sendContactEmail } from '@/services/email';
import { checkFormSpam } from '@/utils/formSpam';

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
	const payload = await request.json().catch(() => null);
	const parsed = contactFormSchema.safeParse(payload);

	if (!parsed.success) {
		return Response.json(
			{
				success: false,
				error: parsed.error.issues[0]?.message || 'Invalid form data'
			},
			{ status: 400 }
		);
	}

	const spamCheck = checkFormSpam(parsed.data);

	if (!spamCheck.ok) {
		return Response.json(
			{
				success: false,
				error: 'Invalid form data'
			},
			{ status: 400 }
		);
	}

	const emailResult = await sendContactEmail(parsed.data);

	if (!emailResult.success) {
		return Response.json(
			{
				success: false,
				error: emailResult.error || emailResult.message || 'An error occurred'
			},
			{ status: emailResult.code === 'FORBIDDEN' ? 403 : 500 }
		);
	}

	return Response.json({
		success: true,
		data: {
			message: emailResult.message || 'email-sent-successfully'
		}
	});
};
