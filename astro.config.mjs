// @ts-check
import { defineConfig } from 'astro/config';

import react from '@astrojs/react';
import markdoc from '@astrojs/markdoc';
import keystatic from '@keystatic/astro';
//import node from '@astrojs/node';

import node from '@astrojs/node';

// https://astro.build/config
export default defineConfig({
	server: { port: 1234, host: true },
	site: 'https://besaide.eus',
	security: {
		allowedDomains: [
			{
				hostname: 'besaide.eus',
				protocol: 'https'
			},
			{
				hostname: 'www.besaide.eus',
				protocol: 'https'
			}
		]
	},

	prefetch: {
		prefetchAll: true,
		defaultStrategy: 'viewport'
	},

	integrations: [react(), markdoc(), keystatic()],
	adapter: node({
		mode: 'standalone'
	}),
	image: {
		layout: 'constrained'
	}
});
