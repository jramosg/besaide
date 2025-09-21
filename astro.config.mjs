// @ts-check
import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
	server: { port: 1234, host: true },
	site: 'https://example.com',
	prefetch: {
		prefetchAll: true
	}
});
