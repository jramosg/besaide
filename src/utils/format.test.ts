import { describe, expect, it } from 'vitest';
import { formatPrice } from '@/utils/format';

describe('formatPrice', () => {
	it('formats euros using default locale', () => {
		expect(formatPrice(1234)).toBe(
			new Intl.NumberFormat('es-ES', {
				style: 'currency',
				currency: 'EUR',
				useGrouping: true,
				minimumFractionDigits: 0,
				maximumFractionDigits: 2
			}).format(1234)
		);
	});

	it('keeps up to two decimal places', () => {
		expect(formatPrice(12.5, 'es-ES')).toBe(
			new Intl.NumberFormat('es-ES', {
				style: 'currency',
				currency: 'EUR',
				useGrouping: true,
				minimumFractionDigits: 0,
				maximumFractionDigits: 2
			}).format(12.5)
		);
	});

	it('supports custom locales', () => {
		expect(formatPrice(1200, 'eu-ES')).toBe(
			new Intl.NumberFormat('eu-ES', {
				style: 'currency',
				currency: 'EUR',
				useGrouping: true,
				minimumFractionDigits: 0,
				maximumFractionDigits: 2
			}).format(1200)
		);
	});
});
