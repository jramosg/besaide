import { afterEach, describe, expect, it, vi } from 'vitest';
import { checkFormSpam } from '@/utils/formSpam';

const now = new Date('2026-05-18T10:00:00.000Z').getTime();

const validStartedAt = now - 5000;

const validData = () => ({
	name: 'Jon',
	startedAt: validStartedAt,
	website: ''
});

afterEach(() => {
	vi.restoreAllMocks();
});

describe('checkFormSpam', () => {
	it('accepts a normal contact form submission', () => {
		vi.spyOn(Date, 'now').mockReturnValue(now);

		expect(
			checkFormSpam({
				...validData(),
				message: 'Kaixo, informazioa jaso nahiko nuke ekintzei buruz.'
			})
		).toEqual({ ok: true });
	});

	it('rejects a filled honeypot field', () => {
		vi.spyOn(Date, 'now').mockReturnValue(now);

		expect(
			checkFormSpam({
				...validData(),
				website: 'https://spam.example'
			})
		).toEqual({ ok: false, reason: 'honeypot' });
	});

	it('rejects submissions that arrive too quickly', () => {
		vi.spyOn(Date, 'now').mockReturnValue(now);

		expect(
			checkFormSpam({
				...validData(),
				startedAt: now - 1000
			})
		).toEqual({ ok: false, reason: 'timing' });
	});

	it('rejects submissions with stale timestamps', () => {
		vi.spyOn(Date, 'now').mockReturnValue(now);

		expect(
			checkFormSpam({
				...validData(),
				startedAt: now - 1000 * 60 * 60 * 4
			})
		).toEqual({ ok: false, reason: 'timing' });
	});

	it('rejects names that look like gibberish', () => {
		vi.spyOn(Date, 'now').mockReturnValue(now);

		expect(
			checkFormSpam({
				...validData(),
				name: 'kjadskhgudashaskad'
			})
		).toEqual({ ok: false, reason: 'low-quality-content' });
	});

	it('rejects surnames with long consonant runs', () => {
		vi.spyOn(Date, 'now').mockReturnValue(now);

		expect(
			checkFormSpam({
				...validData(),
				surnames: 'bcdfgh'
			})
		).toEqual({ ok: false, reason: 'low-quality-content' });
	});

	it('rejects repeated-character spam', () => {
		vi.spyOn(Date, 'now').mockReturnValue(now);

		expect(
			checkFormSpam({
				...validData(),
				name: 'aaaaaa'
			})
		).toEqual({ ok: false, reason: 'low-quality-content' });
	});
	it('accepts names with repeated words', () => {
		vi.spyOn(Date, 'now').mockReturnValue(now);

		expect(
			checkFormSpam({
				...validData(),
				name: 'jon jon jon jon jon jooon'
			})
		).toEqual({ ok: true });
	});

	it('rejects names that look like URLs', () => {
		vi.spyOn(Date, 'now').mockReturnValue(now);

		expect(
			checkFormSpam({
				...validData(),
				name: 'spam-site.com'
			})
		).toEqual({ ok: false, reason: 'low-quality-content' });
	});

	it('rejects short contact messages', () => {
		vi.spyOn(Date, 'now').mockReturnValue(now);

		expect(
			checkFormSpam({
				...validData(),
				message: 'Hola'
			})
		).toEqual({ ok: false, reason: 'low-quality-content' });
	});

	it('accepts membership data without a message', () => {
		vi.spyOn(Date, 'now').mockReturnValue(now);

		expect(
			checkFormSpam({
				...validData(),
				surnames: 'Garcia'
			})
		).toEqual({ ok: true });
	});
});
