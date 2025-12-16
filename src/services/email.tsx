import { Resend, type CreateEmailResponse } from 'resend';
import { render, toPlainText } from '@react-email/render';
import MembershipEmail from '@mail/emails/MembershipEmail';
import { ContactEmail } from '@mail/emails/ContactEmail';
import type { MembershipFormData } from '@/types/Form';
import type { ContactFormData } from '@/schemas/contactForm';
import { useTranslations } from '@/i18n/utils';
import { Email } from '@/config/company';

type EmailResponse = {
	success: boolean;
	data?: CreateEmailResponse;
	error?: string;
	message?: string;
	code?: 'FORBIDDEN' | 'INTERNAL_SERVER_ERROR';
};

const resend = import.meta.env.RESEND_API_KEY
	? new Resend(import.meta.env.RESEND_API_KEY)
	: null;

const companyRecipient = import.meta.env.RESEND_TO_EMAIL || Email.name;

const getEmailRecipients = (_data: MembershipFormData | ContactFormData) => {
	// return import.meta.env.PROD	? [data.email, companyRecipient]	: companyRecipient;
	return [companyRecipient];
};

export const emailResultProcessor = (
	result: CreateEmailResponse
): EmailResponse => {
	if (result.error) {
		return {
			success: false,
			code:
				result.error.statusCode === 403 ? 'FORBIDDEN' : 'INTERNAL_SERVER_ERROR',
			error: result.error.message || 'error-sending-email-please-try-again'
		};
	}

	return {
		success: true,
		message: 'email-sent-successfully'
	};
};

export async function sendContactEmail(
	data: ContactFormData
): Promise<EmailResponse> {
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
			to: getEmailRecipients(data),
			replyTo: data.email,
			subject: `${t(data.subject)} - ${data.name}`,
			html: emailHtml,
			text: plainText,
			bcc: companyRecipient
		});
		return emailResultProcessor(result);
	} catch (error) {
		return {
			success: false,
			error: error instanceof Error ? error.message : 'Unknown error occurred'
		};
	}
}

export async function sendMembershipEmail(
	data: MembershipFormData
): Promise<EmailResponse> {
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
			to: getEmailRecipients(data),
			bcc: companyRecipient,
			subject: `${
				data.federation && data.membership
					? t('email.membership.subject.membership-and-federation')
					: data.federation
						? t('email.membership.subject.federation')
						: t('email.membership.subject.membership')
			} - ${data.name} ${data.surnames}`,
			html: emailHtml,
			text: plainText,
			replyTo: data.email
		});
		return emailResultProcessor(result);
	} catch (error) {
		return {
			success: false,
			error: error instanceof Error ? error.message : 'Unknown error occurred'
		};
	}
}
