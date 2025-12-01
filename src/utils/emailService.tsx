import { Resend } from 'resend';
import { render, toPlainText } from '@react-email/render';
import MembershipEmail from '@mail/emails/MembershipEmail';
import type { MembershipFormData } from '@/types/Form';
import { useTranslations } from '@/i18n/utils';

const resend = import.meta.env.RESEND_API_KEY
	? new Resend(import.meta.env.RESEND_API_KEY)
	: null;

export async function sendMembershipEmail(data: MembershipFormData) {
	try {
		// Render the React email template to HTML

		const emailHtml = await render(<MembershipEmail {...data} />);
		const plainText = toPlainText(emailHtml);
		const t = useTranslations(data.language || 'eu');

		// Send the email
		const result = resend
			? await resend.emails.send({
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
				})
			: (() => {
					throw new Error('Resend API key is not configured');
				})();

		return { success: true, data: result };
	} catch (error) {
		console.error('Error sending membership email:', error);
		return {
			success: false,
			error: error instanceof Error ? error.message : 'Unknown error occurred'
		};
	}
}
