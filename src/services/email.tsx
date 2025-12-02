import { Resend } from 'resend';
import { render, toPlainText } from '@react-email/render';
import MembershipEmail from '@mail/emails/MembershipEmail';
import { ContactEmail } from '@mail/emails/ContactEmail';
import type { MembershipFormData } from '@/types/Form';
import type { ContactFormData } from '@/schemas/contactForm';
import { useTranslations } from '@/i18n/utils';

const resend = import.meta.env.RESEND_API_KEY
	? new Resend(import.meta.env.RESEND_API_KEY)
	: null;

export async function sendContactEmail(data: ContactFormData) {
	try {
		const emailHtml = await render(<ContactEmail {...data} />);
		const plainText = toPlainText(emailHtml);
		const t = useTranslations(data.language || 'eu');

		if (!resend) {
			return {
				success: false,
				error: 'Error: Resend API key is not configured'
			};
		}

		const result = await resend.emails.send({
			from: import.meta.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev',
			to: import.meta.env.RESEND_TO_EMAIL || 'info@besaide.eus',
			replyTo: data.email,
			subject: `${t('contact.form.subject')}: ${data.subject} - ${data.name}`,
			html: emailHtml,
			text: plainText
		});

		return { success: true, data: result };
	} catch (error) {
		return {
			success: false,
			error: error instanceof Error ? error.message : 'Unknown error occurred'
		};
	}
}

export async function sendMembershipEmail(data: MembershipFormData) {
	try {
		const emailHtml = await render(<MembershipEmail {...data} />);
		const plainText = toPlainText(emailHtml);
		const t = useTranslations(data.language || 'eu');

		if (!resend) {
			return {
				success: false,
				error: 'Error: Resend API key is not configured'
			};
		}

		const result = await resend.emails.send({
			from: import.meta.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev',
			to: data.email, // info@besaide.eus
			subject: `${
				data.federation && data.membership
					? t('email.membership.subject.membership-and-federation')
					: data.federation
						? t('email.membership.subject.federation')
						: t('email.membership.subject.membership')
			} - ${data.name} ${data.surnames}`,
			html: emailHtml,
			text: plainText
		});
		return { success: true, data: result };
	} catch (error) {
		return {
			success: false,
			error: error instanceof Error ? error.message : 'Unknown error occurred'
		};
	}
}
