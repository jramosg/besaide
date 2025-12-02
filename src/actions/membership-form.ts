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
			membership: input.membership === 'on',
			federation: input.federation === 'on'
		};

		// Send the email
		const emailResult = await sendMembershipEmail(formattedData);

		if (!emailResult.success) {
			throw new ActionError({
				code: 'INTERNAL_SERVER_ERROR',
				message:
					emailResult.error ||
					'Error al enviar el email. Por favor, inténtalo de nuevo.'
			});
		}

		return {
			success: true,
			message: 'Solicitud de membresía enviada correctamente'
		};
	}
});
