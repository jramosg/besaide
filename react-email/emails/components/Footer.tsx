import { Text, Hr, Link } from '@react-email/components';

export const Footer = () => {
	return (
		<div style={footer}>
			<Hr style={divider} />
			<div style={footerContent}>
				<Text style={footerText}>Besaide Mendizale Elkartea</Text>
				<Text style={footerText}>
					<Link href="https://besaide.eus" style={link}>
						besaide.eus
					</Link>
					{' · '}
					<Link href="mailto:info@besaide.eus" style={link}>
						info@besaide.eus
					</Link>
				</Text>
				<Text style={footerSmall}>
					© {new Date().getFullYear()} Besaide. Eskubide guztiak erreserbatuak.
				</Text>
			</div>
		</div>
	);
};

const footer = {
	padding: '0 32px 32px'
};

const divider = {
	borderColor: '#e9eaec',
	margin: '32px 0 24px'
};

const footerContent = {
	textAlign: 'center' as const
};

const footerText = {
	margin: '0 0 8px',
	fontSize: '14px',
	color: '#6f6f70',
	lineHeight: '1.5'
};

const footerSmall = {
	margin: '16px 0 0',
	fontSize: '12px',
	color: '#969ba3',
	lineHeight: '1.5'
};

const link = {
	color: '#b11cab',
	textDecoration: 'none'
};

export default Footer;
