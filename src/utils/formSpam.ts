import type { ContactFormData } from '@/schemas/contactForm';
import type { MembershipFormData } from '@/schemas/membershipForm';

const minimumCompletionMs = 3500;
const maximumAgeMs = 1000 * 60 * 60 * 3;

type SpamCheckResult =
	| {
			ok: true;
	  }
	| {
			ok: false;
			reason: string;
	  };

const normalize = (value: string) => value.trim();

const hasMostlyConsonants = (value: string) => {
	const letters = normalize(value)
		.toLowerCase()
		.replace(/[^a-záéíóúüñàèìòùâêîôûäëïöü]/gi, '');

	if (letters.length < 8) return false;

	const vowels = letters.match(/[aeiouáéíóúüàèìòùâêîôûäëïö]/g)?.length ?? 0;
	return vowels / letters.length < 0.18;
};

const hasLongConsonantRun = (value: string) =>
	/[bcdfghjklmnpqrstvwxyzñ]{5,}/i.test(value);

const hasRepeatedCharacters = (value: string) => /(.)\1{5,}/i.test(value);

const hasUrl = (value: string) =>
	/https?:\/\/|www\.|[a-z0-9-]+\.(com|net|org|info|ru|cn|xyz|top)\b/i.test(
		value
	);

const isLowQualityText = (value: string) => {
	const text = normalize(value);
	return (
		text.length < 10 ||
		hasMostlyConsonants(text) ||
		hasLongConsonantRun(text) ||
		hasRepeatedCharacters(text) ||
	);
};

const isSuspiciousName = (value: string) => {
	const text = normalize(value);
	return (
		text.length > 80 ||
		hasMostlyConsonants(text) ||
		hasLongConsonantRun(text) ||
		hasRepeatedCharacters(text) ||
		hasUrl(text)
	);
};

type ProtectedFormData = Pick<
	ContactFormData | MembershipFormData,
	'name' | 'website' | 'startedAt'
> & {
	message?: string;
	surnames?: string;
};

export const checkFormSpam = (data: ProtectedFormData): SpamCheckResult => {
	if (data.website) return { ok: false, reason: 'honeypot' };

	const now = Date.now();
	if (
		!data.startedAt ||
		data.startedAt > now ||
		now - data.startedAt < minimumCompletionMs ||
		now - data.startedAt > maximumAgeMs
	) {
		return { ok: false, reason: 'timing' };
	}

	if (
		isSuspiciousName(data.name) ||
		(data.surnames && isSuspiciousName(data.surnames)) ||
		(data.message && isLowQualityText(data.message))
	) {
		return { ok: false, reason: 'low-quality-content' };
	}

	return { ok: true };
};
