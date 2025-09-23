export const nav = [
	{
		title: 'nav.news',
		slug: 'news'
	}
] as const;

export type Nav = typeof nav;
export type NavItem = {
	title: string;
	slug: string;
};
