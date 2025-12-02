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
				code: 'INTERNAL_SERVER_ERROR',
				message:
					emailResult.error ||
					'Error al enviar el email. Por favor, inténtalo de nuevo.'
			});
		}

		return {
			success: true,
			message: 'Mensaje enviado correctamente'
		};
	}
});
