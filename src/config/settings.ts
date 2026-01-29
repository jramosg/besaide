export const url = 'https://besaide.eus';

export const settings = {
	title: `a`,
	description: `a`,
	descriptionBillingual: 'a',
	url: url,
	name: `a`,
	keywords: {
		es: 'a',
		eu: 'a'
	}
} as const;

export type Settings = typeof settings;
