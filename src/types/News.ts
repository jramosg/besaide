export type NewsPost = {
	id: string;
	data: {
		title: string;
		date: string;
		lang: string;
		summary: string;
		image: string;
		imageAlt: string;
		content: string;
	};
};
