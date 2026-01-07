import { contactFormSchema } from '@/schemas/contactForm';
import { sendContactEmail } from '@/services/email';
import { ActionError, defineAction } from 'astro:actions';

export const contactFormAction = defineAction({
	accept: 'form',
	input: contactFormSchema,
	handler: async input => {
		const emailResult = await sendContactEmail(input);

		if (!emailResult.success) {
			throw new ActionError({
				code: emailResult.code || 'INTERNAL_SERVER_ERROR',
				message: emailResult.error || 'error-sending-email-please-try-again'
			});
		}
		return {
			success: true,
			message: 'email-sent-successfully'
		};
	}
});
