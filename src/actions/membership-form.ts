import { membershipFormSchema } from '@/schemas/membershipForm';
import { sendMembershipEmail } from '@/services/email';
import { ActionError, defineAction } from 'astro:actions';
import { createLogger } from '@/lib/logger';

const logger = createLogger('action:membership');

export const membershipFormAction = defineAction({
	accept: 'form',
	input: membershipFormSchema,
	handler: async input => {
		logger.info({
			type: 'form_submission',
			form: 'membership'
		});

		const formattedData = {
			...input,
			birthdate: input.birthdate.toLocaleDateString('es-ES'),
			language: input.language,
			infoSpanish: input.infoSpanish === 'on',
			membership: input.membership === 'on'
		};

		// Send the email
		const emailResult = await sendMembershipEmail(formattedData);

		if (!emailResult.success) {
			logger.error({
				type: 'form_error',
				form: 'membership',
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
			form: 'membership'
		});

		return {
			success: true,
			message: 'email-sent-successfully'
		};
	}
});
