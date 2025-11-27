import { Img } from '@react-email/components';
import { logoUrl } from '../constants';

export const Header = () => {
	return (
		<div style={header}>
			<div style={logoContainer}>
				<Img
					src={logoUrl}
					width="auto"
					height="40"
					alt="Besaide Logo"
					style={logo}
				/>
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
	display: 'block',
	aspectRatio: '583 / 157'
};

export default Header;
