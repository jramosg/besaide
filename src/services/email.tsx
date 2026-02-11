import { Resend, type CreateEmailResponse } from 'resend';
import { render, toPlainText } from '@react-email/render';
import MembershipEmail from '@mail/emails/MembershipEmail';
import { ContactEmail } from '@mail/emails/ContactEmail';
import type { MembershipFormData } from '@/types/Form';
import type { ContactFormData } from '@/schemas/contactForm';
import { useTranslations } from '@/i18n/utils';
import { Email } from '@/config/company';
import { createLogger } from '@/lib/logger';

const emailLogger = createLogger('email');
const resendLogger = createLogger('resend');

type EmailResponse = {
	success: boolean;
	data?: CreateEmailResponse;
	error?: string;
	message?: string;
	code?: 'FORBIDDEN' | 'INTERNAL_SERVER_ERROR';
};

const resend = (() => {
	if (import.meta.env.RESEND_API_KEY) {
		resendLogger.info({ type: 'resend_init', source: 'import.meta.env' });
		return new Resend(import.meta.env.RESEND_API_KEY);
	}
	if (process.env.RESEND_API_KEY) {
		resendLogger.info({ type: 'resend_init', source: 'process.env' });
		return new Resend(process.env.RESEND_API_KEY);
	}
	resendLogger.warn({
		type: 'resend_init',
		source: 'none',
		message: 'No RESEND_API_KEY found'
	});
	return null;
})();

const companyRecipient =
	import.meta.env.RESEND_TO_EMAIL || process.env.RESEND_TO_EMAIL;

const getEmailRecipients = (_data: MembershipFormData | ContactFormData) => {
	return [companyRecipient];
};

/**
 * Sanitize email header values to prevent header injection attacks
 * Removes newlines (\r, \n) and other control characters
 */
const sanitizeEmailHeader = (value: string): string => {
	return value.replace(/[\r\n\x00-\x1F\x7F]/g, '');
};

export const emailResultProcessor = (
	result: CreateEmailResponse,
	emailType: string
): EmailResponse => {
	if (result.error) {
		emailLogger.error({
			type: 'email_send_failed',
			email_type: emailType,
			error: result.error.message,
			status_code: result.error.statusCode
		});
		return {
			success: false,
			code:
				result.error.statusCode === 403 ? 'FORBIDDEN' : 'INTERNAL_SERVER_ERROR',
			error: result.error.message || 'error-sending-email-please-try-again'
		};
	}

	emailLogger.info({
		type: 'email_sent',
		email_type: emailType,
		email_id: result.data?.id
	});

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
			emailLogger.error({
				type: 'email_send_failed',
				email_type: 'contact',
				error: 'Resend API key is not configured'
			});
			return {
				success: false,
				error: 'Error: Resend API key is not configured'
			};
		}

		const result = await resend.emails.send({
			from: companyRecipient,
			to: [companyRecipient],
			replyTo: data.email,
			subject: `${t(data.subject)} - ${sanitizeEmailHeader(data.name)}`,
			html: emailHtml,
			text: plainText,
		});
		return emailResultProcessor(result, 'contact');
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
			emailLogger.error({
				type: 'email_send_failed',
				email_type: 'membership',
				error: 'Resend API key is not configured'
			});
			return {
				success: false,
				error: 'Error: Resend API key is not configured'
			};
		}

		const result = await resend.emails.send({
			from: import.meta.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev',
			to: getEmailRecipients(data),
			subject: `${t(
				'email.membership.subject.membership'
			)} - ${sanitizeEmailHeader(data.name)} ${sanitizeEmailHeader(data.surnames)}`,
			html: emailHtml,
			text: plainText,
			replyTo: data.email
		});
		return emailResultProcessor(result, 'membership');
	} catch (error) {
		return {
			success: false,
			error: error instanceof Error ? error.message : 'Unknown error occurred'
		};
	}
}
