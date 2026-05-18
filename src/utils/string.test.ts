import { describe, expect, it } from 'vitest';
import { capitalizeFirstLetter, slugify } from '@/utils/string';

describe('slugify', () => {
	it('converts text to lowercase hyphenated slug', () => {
		expect(slugify('Kaixo Besaide Taldea')).toBe('kaixo-besaide-taldea');
	});

	it('normalizes special characters and trims separators', () => {
		expect(slugify('  AÑO ñandú !!  ')).toBe('ano-nand');
	});

	it('collapses repeated separators', () => {
		expect(slugify('foo   bar---baz')).toBe('foo-bar-baz');
	});
});

describe('capitalizeFirstLetter', () => {
	it('capitalizes first character and keeps the rest', () => {
		expect(capitalizeFirstLetter('besaide')).toBe('Besaide');
	});

	it('returns empty string unchanged', () => {
		expect(capitalizeFirstLetter('')).toBe('');
	});
});
