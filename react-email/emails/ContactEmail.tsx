import Layout from './components/Layout';
import Header from './components/Header';
import Footer from './components/Footer';
import Section from './components/Section';
import Field from './components/Field';
import { Text } from '@react-email/components';
import { useTranslations } from '@/i18n/utils';
import type { ContactFormData } from '@/schemas/contactForm';

export const ContactEmail = ({
	name = '{{name}}',
	email = '{{email}}',
	phone = '—',
	subject = '{{subject}}',
	message = '{{message}}',
	language = 'eu'
}: ContactFormData) => {
	const t = useTranslations(language);
	return (
		<Layout preview={t('email.contact.preview').replace('{name}', name)}>
			<Header />

			<div style={contentArea}>
				<Text style={heading}>{t('email.contact.heading')}</Text>
				<Text style={intro}>{t('email.contact.intro')}</Text>

				<Section title={t('email.contact.section')} variant="accent">
					<Field
						label={t('email.contact.labels.name')}
						value={name}
						fullWidth
					/>
					<div style={fieldGrid}>
						<Field label={t('email.contact.labels.email')} value={email} />
						<Field label={t('email.contact.labels.phone')} value={phone} />
					</div>
					<Field
						label={t('email.contact.labels.subject')}
						value={t(subject)}
						fullWidth
					/>
					<div style={messageContainer}>
						<Text style={messageLabel}>
							{t('email.contact.labels.message')}
						</Text>
						<Text style={messageText}>{message}</Text>
					</div>
				</Section>
			</div>

			<Footer />
		</Layout>
	);
};

const contentArea = {
	padding: '32px'
};

const heading = {
	margin: '0 0 12px',
	fontSize: '28px',
	fontWeight: '700',
	color: '#0f172a',
	lineHeight: '1.2'
};

const intro = {
	margin: '0 0 32px',
	fontSize: '16px',
	color: '#475569',
	lineHeight: '1.6'
};

const fieldGrid = {
	display: 'grid',
	gridTemplateColumns: '1fr 1fr',
	gap: '16px',
	marginBottom: '16px'
};

const messageContainer = {
	marginTop: '16px',
	padding: '16px',
	backgroundColor: '#f8fafc',
	borderRadius: '8px',
	border: '1px solid #e2e8f0'
};

const messageLabel = {
	margin: '0 0 8px',
	fontSize: '12px',
	fontWeight: '600',
	color: '#64748b',
	textTransform: 'uppercase' as const,
	letterSpacing: '0.05em'
};

const messageText = {
	margin: '0',
	fontSize: '15px',
	color: '#0f172a',
	lineHeight: '1.6',
	whiteSpace: 'pre-wrap' as const
};

export default ContactEmail;
