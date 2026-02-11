import { defineMiddleware, sequence } from 'astro:middleware';
import { createLogger } from './lib/logger';

const httpLogger = createLogger('http');
const rateLimitLogger = createLogger('rate-limit');

type RateLimitStore = Map<string, number[]>;
// In-memory store for rate limiting: IP -> array of timestamps
const rateLimitStore: RateLimitStore = new Map();

const RATE_LIMIT_WINDOW_MS = 60 * 1000; // 1 minute
const RATE_LIMIT_MAX_REQUESTS =
	Number(import.meta.env.RATE_LIMIT_MAX_REQUESTS) || 5;

// Periodic cleanup to prevent memory leaks
// Remove IPs with no recent activity
const CLEANUP_INTERVAL_MS = 5 * 60 * 1000; // 5 minutes
setInterval(() => {
	const now = Date.now();
	for (const [ip, timestamps] of rateLimitStore.entries()) {
		// Remove IPs where all timestamps are older than the window
		const validTimestamps = timestamps.filter(
			ts => now - ts < RATE_LIMIT_WINDOW_MS
		);
		if (validTimestamps.length === 0) {
			rateLimitStore.delete(ip);
		}
	}
}, CLEANUP_INTERVAL_MS);

// HTTP request logging middleware
const logRequest = defineMiddleware(async (context, next) => {
	const start = Date.now();
	const { request } = context;

	// Get client address safely (not available during prerendering)
	let clientAddress = 'unknown';
	try {
		clientAddress = context.clientAddress;
	} catch {
		// clientAddress throws during prerendering - skip logging
		return next();
	}

	try {
		const response = await next();
		const duration = Date.now() - start;

		httpLogger.info({
			type: 'http',
			method: request.method,
			path: context.url.pathname,
			status: response.status,
			duration_ms: duration,
			ip: clientAddress
		});

		return response;
	} catch (error) {
		const duration = Date.now() - start;

		httpLogger.error({
			type: 'http',
			method: request.method,
			path: context.url.pathname,
			duration_ms: duration,
			ip: clientAddress,
			error: error instanceof Error ? error.message : 'Unknown error'
		});
		throw error;
	}
});

// Rate limiting middleware
const rateLimitMiddleware = defineMiddleware((context, next) => {
	if (context.url.pathname.startsWith('/_actions/')) {
		const clientIP = context.clientAddress;

		// Get or initialize the timestamps array for this IP
		let timestamps = rateLimitStore.get(clientIP) || [];

		// Remove timestamps older than the window
		const now = Date.now();
		timestamps = timestamps.filter(ts => now - ts < RATE_LIMIT_WINDOW_MS);

		// Check if rate limit exceeded
		if (timestamps.length >= RATE_LIMIT_MAX_REQUESTS) {
			rateLimitLogger.warn({
				type: 'rate_limit_exceeded',
				ip: clientIP,
				path: context.url.pathname,
				attempts: timestamps.length
			});
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

// Compose middlewares: log requests first, then apply rate limiting
export const onRequest = sequence(logRequest, rateLimitMiddleware);
