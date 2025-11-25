import Layout from './components/Layout';
import Header from './components/Header';
import Footer from './components/Footer';
import Section from './components/Section';
import Field from './components/Field';
import { Text } from '@react-email/components';

interface MembershipEmailProps {
	dni: string;
	name: string;
	surnames: string;
	birthdate: string;
	address: string;
	town: string;
	postalCode: string;
	province: string;
	phone1: string;
	phone2?: string;
	email: string;
	infoSpanish: boolean;
	membership: boolean;
	federation: boolean;
	language?: 'es' | 'eu';
}

const translations = {
	es: {
		heading: 'Solicitud de Membresía Recibida',
		intro:
			'Gracias por tu solicitud. Hemos registrado los siguientes datos en nuestro sistema:',
		sections: {
			personalData: 'Datos Personales',
			membership: 'Membresía',
			federation: 'Federación'
		},
		labels: {
			dni: 'DNI',
			name: 'Nombre',
			surnames: 'Apellidos',
			birthdate: 'Fecha de Nacimiento',
			address: 'Dirección',
			town: 'Localidad',
			postalCode: 'Código Postal',
			province: 'Provincia',
			phone1: 'Teléfono Principal',
			phone2: 'Teléfono Secundario',
			email: 'Correo Electrónico',
			infoSpanish: 'Recibir Información en Español',
			membership: 'Solicita Membresía',
			federation: 'Solicita Federación'
		}
	},
	eu: {
		heading: 'Bazkidetza Eskaera Jasota',
		intro:
			'Eskerrik asko zure eskaeragatik. Datu hauek erregistratu ditugu gure sisteman:',
		sections: {
			personalData: 'Datu Pertsonalak',
			membership: 'Bazkidetza',
			federation: 'Federazioa'
		},
		labels: {
			dni: 'NAN',
			name: 'Izena',
			surnames: 'Abizenak',
			birthdate: 'Jaiotze Data',
			address: 'Helbidea',
			town: 'Herria',
			postalCode: 'Posta Kodea',
			province: 'Probintzia',
			phone1: 'Telefono Nagusia',
			phone2: 'Bigarren Telefonoa',
			email: 'Helbide Elektronikoa',
			infoSpanish: 'Informazioa Gaztelaniaz Jaso',
			membership: 'Bazkidetza Eskatzen Du',
			federation: 'Federazioa Eskatzen Du'
		}
	}
};

export const MembershipEmail = ({
	dni = '{{dni}}',
	name = '{{name}}',
	surnames = '{{surnames}}',
	birthdate = '{{birthdate}}',
	address = '{{address}}',
	town = '{{town}}',
	postalCode = '{{postalCode}}',
	province = '{{province}}',
	phone1 = '{{phone1}}',
	phone2 = '{{phone2}}',
	email = '{{email}}',
	infoSpanish = true,
	membership = true,
	federation = false,
	language = 'es'
}: MembershipEmailProps) => {
	const t = translations[language];

	return (
		<Layout preview={`Nueva solicitud de membresía de ${name} ${surnames}`}>
			<Header />

			<div style={contentArea}>
				<Text style={heading}>{t.heading}</Text>
				<Text style={intro}>{t.intro}</Text>

				<Section title={t.sections.personalData} variant="accent">
					<div style={fieldGrid}>
						<Field label={t.labels.dni} value={dni} />
						<Field label={t.labels.birthdate} value={birthdate} />
					</div>
					<Field label={t.labels.name} value={name} fullWidth />
					<Field label={t.labels.surnames} value={surnames} fullWidth />
					<Field label={t.labels.address} value={address} fullWidth />
					<div style={fieldGrid}>
						<Field label={t.labels.town} value={town} />
						<Field label={t.labels.postalCode} value={postalCode} />
					</div>
					<Field label={t.labels.province} value={province} fullWidth />
					<div style={fieldGrid}>
						<Field label={t.labels.phone1} value={phone1} />
						<Field label={t.labels.phone2} value={phone2 || '—'} />
					</div>
					<Field label={t.labels.email} value={email} fullWidth />
					<Field label={t.labels.infoSpanish} value={infoSpanish} fullWidth />
				</Section>

				<Section title={t.sections.membership}>
					<Field label={t.labels.membership} value={membership} fullWidth />
				</Section>

				<Section title={t.sections.federation}>
					<Field label={t.labels.federation} value={federation} fullWidth />
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

export default MembershipEmail;
