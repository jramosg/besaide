import { defineMiddleware } from 'astro:middleware';

type RateLimitStore = Map<string, number[]>;
// In-memory store for rate limiting: IP -> array of timestamps
const rateLimitStore: RateLimitStore = new Map();

const RATE_LIMIT_WINDOW_MS = 60 * 1000; // 1 minute
const RATE_LIMIT_MAX_REQUESTS =
	Number(import.meta.env.RATE_LIMIT_MAX_REQUESTS) || 5;

export const onRequest = defineMiddleware((context, next) => {
	if (context.url.pathname.startsWith('/_actions/')) {
		const clientIP = context.clientAddress;

		// Get or initialize the timestamps array for this IP
		let timestamps = rateLimitStore.get(clientIP) || [];

		// Remove timestamps older than the window
		const now = Date.now();
		timestamps = timestamps.filter(ts => now - ts < RATE_LIMIT_WINDOW_MS);

		// Check if rate limit exceeded
		if (timestamps.length >= RATE_LIMIT_MAX_REQUESTS) {
			return new Response('Too many requests. Please try again later.', {
				status: 429,
				headers: {
					'Content-Type': 'text/plain',
					'Retry-After': Math.ceil(RATE_LIMIT_WINDOW_MS / 1000).toString()
				}
			});
		}

		// Add current timestamp
		timestamps.push(now);
		rateLimitStore.set(clientIP, timestamps);
	}

	// Proceed with the request
	return next();
});
