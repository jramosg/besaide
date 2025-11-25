import { Text } from '@react-email/components';

interface SectionProps {
	title: string;
	children: React.ReactNode;
	variant?: 'default' | 'accent';
}

export const Section = ({
	title,
	children,
	variant = 'default'
}: SectionProps) => {
	return (
		<div style={section}>
			<div style={variant === 'accent' ? titleBarAccent : titleBar}>
				<Text style={titleText}>{title}</Text>
			</div>
			<div style={content}>{children}</div>
		</div>
	);
};

const section = {
	marginBottom: '24px'
};

const titleBar = {
	backgroundColor: '#f4f5f6',
	padding: '12px 20px',
	borderRadius: '8px 8px 0 0'
};

const titleBarAccent = {
	backgroundColor: '#fbe3fc',
	padding: '12px 20px',
	borderRadius: '8px 8px 0 0'
};

const titleText = {
	margin: '0',
	fontSize: '14px',
	fontWeight: '600',
	color: '#5c5f66',
	textTransform: 'uppercase' as const,
	letterSpacing: '0.05em'
};

const content = {
	backgroundColor: '#ffffff',
	border: '1px solid #e9eaec',
	borderTop: 'none',
	borderRadius: '0 0 8px 8px',
	padding: '20px'
};

export default Section;
