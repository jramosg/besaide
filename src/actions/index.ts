import { defineAction, ActionError } from 'astro:actions';
import { z } from 'astro:schema';
import { sendMembershipEmail } from '@/utils/emailService';

export const server = {
	submitMembership: defineAction({
		accept: 'form',
		input: z.object({
			dni: z.string().min(1, 'DNI es requerido'),
			name: z.string().min(1, 'Nombre es requerido'),
			surnames: z.string().min(1, 'Apellidos son requeridos'),
			birthdate: z.coerce.date(),
			address: z.string().min(1, 'Dirección es requerida'),
			town: z.string().min(1, 'Localidad es requerida'),
			postalCode: z
				.string()
				.length(5, 'El código postal debe tener 5 dígitos')
				.regex(/^\d{5}$/, 'El código postal debe contener solo números'),
			province: z.string().min(1, 'Provincia es requerida'),
			phone1: z.string().min(9, 'El teléfono debe tener al menos 9 dígitos'),
			phone2: z.string().optional(),
			email: z.string().email('Email no válido'),
			infoSpanish: z.boolean().default(false),
			membership: z.boolean().default(false),
			federation: z.boolean().default(false),
			language: z.enum(['es', 'eu']).default('eu')
		}),
		handler: async input => {
			// Format birthdate to string for email
			const formattedData = {
				...input,
				birthdate: input.birthdate.toLocaleDateString('es-ES'),
				language: input.language
			};

			// Send the email
			const emailResult = await sendMembershipEmail(formattedData);

			if (!emailResult.success) {
				throw new ActionError({
					code: 'INTERNAL_SERVER_ERROR',
					message: 'Error al enviar el email. Por favor, inténtalo de nuevo.'
				});
			}

			return {
				success: true,
				message: 'Solicitud de membresía enviada correctamente'
			};
		}
	})
};
