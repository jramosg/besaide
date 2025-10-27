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
		title: 'nav.besaide',
		slug: 'besaide'
	},
	{ title: 'nav.services', slug: 'services' },
	{ title: 'nav.routes', slug: 'courses' }
] as const;

export type Nav = typeof nav;

export type NavItem = {
	title: string;
	slug: string;
};

export const navActions = [
	{
		title: 'nav.membership-federation',
		slug: 'membership'
	},
	{
		title: 'nav.contact',
		slug: 'contact'
	}
] as const;
