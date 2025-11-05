export const nav = [
	{
		title: 'nav.home',
		slug: '',
		children: []
	},
	{
		title: 'nav.agenda',
		slug: 'agenda',
		children: []
	},
	{
		title: 'nav.news',
		slug: 'news',
		children: []
	},
	{
		title: 'nav.besaide',
		slug: 'besaide',
		children: [
			{
				title: 'nav.historia',
				slug: 'besaide'
			},
			{
				title: 'nav.membership-federation',
				slug: 'membership-federation'
			}
		]
	},
	{
		title: 'nav.services',
		slug: 'material-rent',
		children: [
			{ title: 'nav.leixagarate-aterpea', slug: 'leixagarate' },
			{ title: 'nav.material-rent', slug: 'material-rent' },
			{ title: 'nav.library-maps', slug: 'library-maps' }
		]
	},
	{ title: 'nav.routes', slug: 'courses', children: [] }
] as const;

export type Nav = typeof nav;

export type NavItem = {
	title: string;
	slug: string;
	children: readonly {
		title: string;
		slug: string;
	}[];
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
