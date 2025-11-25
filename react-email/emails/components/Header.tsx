import { Img, Text } from '@react-email/components';

export const Header = () => {
	return (
		<div style={header}>
			<div style={logoContainer}>
				<Img
					src="https://besaide.eus/favicon.png"
					width="40"
					height="40"
					alt="Besaide Logo"
					style={logo}
				/>
				<Text style={brandName}>Besaide</Text>
			</div>
		</div>
	);
};

const header = {
	padding: '32px 32px 24px',
	borderBottom: '1px solid #e9eaec'
};

const logoContainer = {
	display: 'flex',
	alignItems: 'center',
	gap: '12px'
};

const logo = {
	display: 'block'
};

const brandName = {
	margin: '0',
	fontSize: '24px',
	fontWeight: '700',
	color: '#232427',
	lineHeight: '1'
};

export default Header;
