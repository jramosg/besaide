import * as React from 'react';
import Layout from './components/Layout';
import Header from './components/Header';
import Footer from './components/Footer';
import Section from './components/Section';
import Field from './components/Field';
import { Text } from '@react-email/components';

interface ContactEmailProps {
	name: string;
	email: string;
	phone?: string;
	subject: string;
	message: string;
	language?: 'es' | 'eu';
}

const translations = {
	es: {
		heading: 'Hemos recibido tu mensaje',
		intro:
			'Gracias por contactar con nosotros. Hemos recibido tu mensaje correctamente:',
		section: 'Tu Información de Contacto',
		labels: {
			name: 'Nombre',
			email: 'Correo Electrónico',
			phone: 'Teléfono',
			subject: 'Asunto',
			message: 'Mensaje'
		}
	},
	eu: {
		heading: 'Zure mezua jaso dugu',
		intro:
			'Eskerrik asko gurekin harremanetan jartzeagatik. Zure mezua ondo jaso dugu:',
		section: 'Zure Kontaktu Informazioa',
		labels: {
			name: 'Izena',
			email: 'Helbide Elektronikoa',
			phone: 'Telefonoa',
			subject: 'Gaia',
			message: 'Mezua'
		}
	}
};

export const ContactEmail = ({
	name = '{{name}}',
	email = '{{email}}',
	phone = '{{phone}}',
	subject = '{{subject}}',
	message = '{{message}}',
	language = 'es'
}: ContactEmailProps) => {
	const t = translations[language];

	return (
		<Layout preview={`Nuevo mensaje de contacto de ${name}`}>
			<Header />

			<div style={contentArea}>
				<Text style={heading}>{t.heading}</Text>
				<Text style={intro}>{t.intro}</Text>

				<Section title={t.section} variant="accent">
					<Field label={t.labels.name} value={name} fullWidth />
					<div style={fieldGrid}>
						<Field label={t.labels.email} value={email} />
						<Field label={t.labels.phone} value={phone || '—'} />
					</div>
					<Field label={t.labels.subject} value={subject} fullWidth />
					<div style={messageContainer}>
						<Text style={messageLabel}>{t.labels.message}</Text>
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
