import type { APIRoute } from 'astro';

import { membershipFormSchema } from '@/schemas/membershipForm';
import { sendMembershipEmail } from '@/services/email';

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
	const payload = await request.json().catch(() => null);
	const parsed = membershipFormSchema.safeParse(payload);

	if (!parsed.success) {
		return Response.json(
			{
				success: false,
				error: parsed.error.issues[0]?.message || 'Invalid form data'
			},
			{ status: 400 }
		);
	}

	const formattedData = {
		...parsed.data,
		birthdate: parsed.data.birthdate.toLocaleDateString('es-ES'),
		language: parsed.data.language,
		infoSpanish: parsed.data.infoSpanish === 'on',
		membership: parsed.data.membership === 'on'
	};

	const emailResult = await sendMembershipEmail(formattedData);

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
