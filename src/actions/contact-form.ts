import { contactFormSchema } from '@/schemas/contactForm';
import { sendContactEmail } from '@/services/email';
import { ActionError, defineAction } from 'astro:actions';
import { createLogger } from '@/lib/logger';

const logger = createLogger('action:contact');

export const contactFormAction = defineAction({
	accept: 'form',
	input: contactFormSchema,
	handler: async input => {
		logger.info({
			type: 'form_submission',
			form: 'contact',
			subject: input.subject
		});

		const emailResult = await sendContactEmail(input);

		if (!emailResult.success) {
			logger.error({
				type: 'form_error',
				form: 'contact',
				code: emailResult.code,
				error: emailResult.error
			});
			throw new ActionError({
				code: emailResult.code || 'INTERNAL_SERVER_ERROR',
				message: emailResult.error || 'error-sending-email-please-try-again'
			});
		}

		logger.info({
			type: 'form_success',
			form: 'contact'
		});

		return {
			success: true,
			message: 'email-sent-successfully'
		};
	}
});
