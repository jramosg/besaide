import type { APIContext } from 'astro';
import { getCollection } from 'astro:content';

interface AlternateLink {
	hreflang: string;
	href: string;
}

interface SitemapUrl {
	loc: string;
	changefreq?: string;
	priority?: number;
	alternates?: AlternateLink[];
}

export async function GET(context: APIContext) {
	const site = (
		context.site?.toString() || 'https://besaide.vercel.app'
	).replace(/\/$/, '');

	// Get all collections
	const news = await getCollection('news');
	const events = await getCollection('events');

	// Generate URLs for all content
	const urls: SitemapUrl[] = [];

	// Define page pairs with alternates (Euskera / Spanish)
	// Spanish pages are commented out until they go to production
	const pagePairs = [
		{
			eu: '/',
			// es: '/es',
			changefreq: 'weekly',
			priority: 1.0
		},
		{
			eu: '/besaide',
			// es: '/besaide-es',
			changefreq: 'monthly',
			priority: 0.8
		},
		{
			eu: '/albisteak',
			// es: '/noticias',
			changefreq: 'weekly',
			priority: 0.9
		},
		{
			eu: '/agenda',
			// es: '/agenda-es',
			changefreq: 'weekly',
			priority: 0.9
		},
		{
			eu: '/ibilbideak',
			// es: '/rutas',
			changefreq: 'monthly',
			priority: 0.8
		},
		{
			eu: '/bazkidetza-federatzea',
			// es: '/hacerse-socio-federarse',
			changefreq: 'monthly',
			priority: 0.8
		},
		{
			eu: '/leixagarate-aterpea',
			// es: '/refugio-de-leixagarate',
			changefreq: 'monthly',
			priority: 0.8
		},
		{
			eu: '/material-alokairua',
			// es: '/alquiler-de-material',
			changefreq: 'monthly',
			priority: 0.8
		},
		{
			eu: '/liburutegia-mapak',
			// es: '/biblioteca-mapas',
			changefreq: 'monthly',
			priority: 0.7
		},
		{
			eu: '/kontaktua',
			// es: '/contacto',
			changefreq: 'monthly',
			priority: 0.7
		},
		{
			eu: '/lege-oharra-eta-pribatutasun-politika',
			// es: '/aviso-legal-y-politica-de-privacidad',
			changefreq: 'yearly',
			priority: 0.3
		}
	];

	// Add static pages with alternates
	pagePairs.forEach(pair => {
		const euUrl = `${site}${pair.eu}`;
		// const esUrl = `${site}${pair.es}`;

		// Euskera page (Spanish alternates commented out until production)
		urls.push({
			loc: euUrl,
			changefreq: pair.changefreq,
			priority: pair.priority,
			alternates: [
				{ hreflang: 'eu', href: euUrl },
				// { hreflang: 'es', href: esUrl },
				{ hreflang: 'x-default', href: euUrl }
			]
		});

		// Spanish page with Euskera alternate (commented out until production)
		/* urls.push({
			loc: esUrl,
			changefreq: pair.changefreq,
			priority: pair.priority,
			alternates: [
				{ hreflang: 'eu', href: euUrl },
				{ hreflang: 'es', href: esUrl },
				{ hreflang: 'x-default', href: euUrl }
			]
		}); */
	});

	// News pages with alternates
	// Spanish versions commented out until production
	news.forEach(newsItem => {
		const euUrl = `${site}/albisteak/${newsItem.id}`;
		// const esUrl = `${site}/noticias/${newsItem.id}`;

		// Euskera version
		urls.push({
			loc: euUrl,
			changefreq: 'monthly',
			priority: 0.7,
			alternates: [
				{ hreflang: 'eu', href: euUrl },
				// { hreflang: 'es', href: esUrl },
				{ hreflang: 'x-default', href: euUrl }
			]
		});

		// Spanish version (commented out until production)
		/* urls.push({
			loc: esUrl,
			changefreq: 'monthly',
			priority: 0.7,
			alternates: [
				{ hreflang: 'eu', href: euUrl },
				{ hreflang: 'es', href: esUrl },
				{ hreflang: 'x-default', href: euUrl }
			]
		}); */
	});

	// Event pages with alternates
	// Spanish versions commented out until production
	// Get unique years from events
	const eventYears = new Set<number>(
		events.map(event => new Date(event.data.date).getFullYear())
	);
	const currentYear = new Date().getFullYear();
	events.forEach(event => {
		const eventYear = event.data.date.getFullYear();
		const euUrl = `${site}/agenda/${eventYear}/${event.id}`;
		// const esUrl = `${site}/agenda-es/${eventYear}/${event.id}`;

		// Euskera version
		urls.push({
			loc: euUrl,
			changefreq: 'monthly',
			priority: 0.7,
			alternates: [
				{ hreflang: 'eu', href: euUrl },
				// { hreflang: 'es', href: esUrl },
				{ hreflang: 'x-default', href: euUrl }
			]
		});

		// Spanish version (commented out until production)
		/* urls.push({
			loc: esUrl,
			changefreq: 'monthly',
			priority: 0.7,
			alternates: [
				{ hreflang: 'eu', href: euUrl },
				{ hreflang: 'es', href: esUrl },
				{ hreflang: 'x-default', href: euUrl }
			]
		}); */
	});

	// Add agenda year pages with alternates
	// Spanish versions commented out until production
	eventYears.forEach(year => {
		const euUrl = `${site}/agenda/${year}`;
		// const esUrl = `${site}/agenda-es/${year}`;

		// Euskera version
		urls.push({
			loc: euUrl,
			changefreq: year === currentYear ? 'weekly' : 'monthly',
			priority: year === currentYear ? 0.9 : 0.6,
			alternates: [
				{ hreflang: 'eu', href: euUrl },
				// { hreflang: 'es', href: esUrl },
				{ hreflang: 'x-default', href: euUrl }
			]
		});

		// Spanish version (commented out until production)
		/* urls.push({
			loc: esUrl,
			changefreq: year === currentYear ? 'weekly' : 'monthly',
			priority: year === currentYear ? 0.9 : 0.6,
			alternates: [
				{ hreflang: 'eu', href: euUrl },
				{ hreflang: 'es', href: esUrl },
				{ hreflang: 'x-default', href: euUrl }
			]
		}); */
	});

	// Generate sitemap XML with xhtml namespace for alternates
	const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
${urls
	.map(
		url => `  <url>
    <loc>${url.loc}</loc>${
			url.changefreq
				? `
    <changefreq>${url.changefreq}</changefreq>`
				: ''
		}${
			url.priority !== undefined
				? `
    <priority>${url.priority}</priority>`
				: ''
		}${
			url.alternates && url.alternates.length > 0
				? `
${url.alternates
	.map(
		alt =>
			`    <xhtml:link rel="alternate" hreflang="${alt.hreflang}" href="${alt.href}" />`
	)
	.join('\n')}`
				: ''
		}
  </url>`
	)
	.join('\n')}
</urlset>`;

	return new Response(sitemap, {
		status: 200,
		headers: {
			'Content-Type': 'application/xml',
			'Cache-Control': 'public, max-age=3600' // Cache for 1 hour
		}
	});
}
