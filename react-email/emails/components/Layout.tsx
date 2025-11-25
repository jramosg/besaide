import {
	Body,
	Container,
	Head,
	Html,
	Preview,
	Font
} from '@react-email/components';
import type { ReactNode } from 'react';

interface LayoutProps {
	preview?: string;
	children: ReactNode;
}

export const Layout = ({ preview, children }: LayoutProps) => {
	return (
		<Html>
			<Head>
				<Font
					fontFamily="Roboto"
					fallbackFontFamily="Arial"
					webFont={{
						url: 'https://fonts.gstatic.com/s/roboto/v30/KFOmCnqEu92Fr1Mu4mxKKTU1Kg.woff2',
						format: 'woff2'
					}}
					fontWeight={400}
					fontStyle="normal"
				/>
				<Font
					fontFamily="Roboto"
					fallbackFontFamily="Arial"
					webFont={{
						url: 'https://fonts.gstatic.com/s/roboto/v30/KFOlCnqEu92Fr1MmWUlfBBc4AMP6lQ.woff2',
						format: 'woff2'
					}}
					fontWeight={600}
					fontStyle="normal"
				/>
				<Font
					fontFamily="Roboto"
					fallbackFontFamily="Arial"
					webFont={{
						url: 'https://fonts.gstatic.com/s/roboto/v30/KFOlCnqEu92Fr1MmWUlfBBc4AMP6lbBP.woff2',
						format: 'woff2'
					}}
					fontWeight={700}
					fontStyle="normal"
				/>
			</Head>
			{preview && <Preview>{preview}</Preview>}
			<Body style={main}>
				<Container style={container}>{children}</Container>
			</Body>
		</Html>
	);
};

const main = {
	backgroundColor: '#f4f5f6',
	fontFamily: 'Roboto, Arial, sans-serif',
	padding: '40px 20px',
	color: '#232427'
};

const container = {
	backgroundColor: '#ffffff',
	borderRadius: '12px',
	margin: '0 auto',
	padding: '0',
	maxWidth: '600px',
	width: '100%',
	boxShadow: '3px 7px 12.8px 4px rgba(0, 0, 0, 0.15)'
};

export default Layout;
