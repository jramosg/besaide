import { Text } from '@react-email/components';

interface FieldProps {
	label: string;
	value: string | number | boolean;
	fullWidth?: boolean;
	lang?: 'es' | 'eu';
}

export const Field = ({
	label,
	value,
	fullWidth = false,
	lang = 'eu'
}: FieldProps) => {
	const displayValue =
		typeof value === 'boolean'
			? value
				? lang === 'es'
					? 'Sí'
					: 'Bai'
				: lang === 'es'
					? 'No'
					: 'Ez'
			: value;

	return (
		<div style={fullWidth ? fieldFullWidth : field}>
			<Text style={labelText}>{label}</Text>
			<Text style={valueText}>{displayValue}</Text>
		</div>
	);
};

const field = {
	marginBottom: '16px'
};

const fieldFullWidth = {
	marginBottom: '16px',
	width: '100%'
};

const labelText = {
	margin: '0 0 4px',
	fontSize: '12px',
	fontWeight: '600',
	color: '#6f6f70',
	textTransform: 'uppercase' as const,
	letterSpacing: '0.05em'
};

const valueText = {
	margin: '0',
	fontSize: '15px',
	color: '#232427',
	lineHeight: '1.5',
	fontWeight: '400'
};

export default Field;
