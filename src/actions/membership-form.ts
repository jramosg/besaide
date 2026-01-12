import { membershipFormSchema } from '@/schemas/membershipForm';
import { sendMembershipEmail } from '@/services/email';
import { ActionError, defineAction } from 'astro:actions';

export const membershipFormAction = defineAction({
	accept: 'form',
	input: membershipFormSchema,
	handler: async input => {
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
