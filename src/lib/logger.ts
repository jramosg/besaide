import pino from 'pino';
import { existsSync } from 'fs';
import { join } from 'path';

const isDevelopment = process.env.NODE_ENV !== 'production';
const logLevel = process.env.LOG_LEVEL || 'info';
const logRetentionDays = Number(process.env.LOG_RETENTION_DAYS) || 7;

// Determine log file path based on environment
// Production (Docker): /app/logs/app.log
// Development: ./logs/app.log (relative to project root)
const getLogFilePath = () => {
	if (existsSync('/app/logs')) {
		return '/app/logs/app.log';
	}
	return join(process.cwd(), 'logs', 'app.log');
};

// Check if we should enable file logging
// Don't log to file during build/prerendering
const shouldLogToFile = () => {
	// Check if logs directory is accessible
	const logsDir = existsSync('/app/logs')
		? '/app/logs'
		: join(process.cwd(), 'logs');

	return existsSync(logsDir);
};

// During build/prerendering, only log to stdout
// At runtime, log to both stdout and file
const getTransportConfig = () => {
	if (!shouldLogToFile()) {
		// Build time or logs directory not available - stdout only
		return {
			target: isDevelopment ? 'pino-pretty' : 'pino/file',
			options: isDevelopment
				? {
						colorize: true,
						translateTime: 'HH:MM:ss',
						ignore: 'pid,hostname'
					}
				: { destination: 1 } // stdout
		};
	}

	// Runtime - both stdout and file
	return {
		targets: [
			// stdout target: pretty in dev, JSON in prod
			{
				target: isDevelopment ? 'pino-pretty' : 'pino/file',
				options: isDevelopment
					? {
							colorize: true,
							translateTime: 'HH:MM:ss',
							ignore: 'pid,hostname'
						}
					: { destination: 1 } // stdout
			},
			// file target: JSON logs with rotation
			{
				target: 'pino-roll',
				options: {
					file: getLogFilePath(),
					frequency: 'daily',
					mkdir: true,
					size: '10m', // max size before rotation
					limit: {
						count: logRetentionDays // keep N days of logs
					}
				}
			}
		]
	};
};

export const logger = pino({
	level: logLevel,
	timestamp: pino.stdTimeFunctions.isoTime,
	transport: getTransportConfig()
});

/**
 * Create a child logger for a specific module
 * @param name - Module name (e.g., 'http', 'email', 'action:contact')
 */
export const createLogger = (name: string) => logger.child({ module: name });
