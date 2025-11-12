/**
 * Formats a number as a localized price string
 * @param value - The number to format
 * @param locale - The locale to use for formatting (default: 'es-ES')
 * @returns Formatted number string
 */
export function formatPrice(value: number, locale: string = 'es-ES'): string {
	return Number(value).toLocaleString(locale, { style: 'currency', currency: 'EUR' });
}
