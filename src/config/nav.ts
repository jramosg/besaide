export const nav = [
	{
		title: 'nav.home',
		slug: ''
	},
	{
		title: 'nav.agenda',
		slug: 'agenda'
	},
	{
		title: 'nav.news',
		slug: 'news'
	},
	{
		title: 'nav.cookies-policy',
		slug: 'cookies-policy'
	}
] as const;

export type Nav = typeof nav;
export type NavItem = {
	title: string;
	slug: string;
};
