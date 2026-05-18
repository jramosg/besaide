import { describe, expect, it } from 'vitest';
import { formatEventDate } from '@/utils/date';

describe('formatEventDate', () => {
	it('formats single-day date in Spanish', () => {
		const start = new Date('2026-02-08T10:00:00.000Z');
		const month = start.toLocaleDateString('es-ES', { month: 'long' });

		expect(formatEventDate(start, null, 'es')).toBe(`8 de ${month}`);
	});

	it('formats single-day date in Basque', () => {
		const start = new Date('2026-02-08T10:00:00.000Z');
		const month = start.toLocaleDateString('eu-ES', { month: 'long' });

		expect(formatEventDate(start, null, 'eu')).toBe(`${month}k 8`);
	});

	it('formats same-month range in Spanish', () => {
		const start = new Date('2026-02-08T10:00:00.000Z');
		const end = new Date('2026-02-09T10:00:00.000Z');
		const month = start.toLocaleDateString('es-ES', { month: 'long' });

		expect(formatEventDate(start, end, 'es')).toBe(`8-9 de ${month}`);
	});

	it('formats cross-month range in Basque', () => {
		const start = new Date('2026-02-28T10:00:00.000Z');
		const end = new Date('2026-03-02T10:00:00.000Z');
		const startMonth = start.toLocaleDateString('eu-ES', { month: 'long' });
		const endMonth = end.toLocaleDateString('eu-ES', { month: 'long' });

		expect(formatEventDate(start, end, 'eu')).toBe(
			`${startMonth}k 28 - ${endMonth}k 2`
		);
	});
});
