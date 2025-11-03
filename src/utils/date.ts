/**
 * Formats an event date or date range in Basque or Spanish
 * @param startDate - The event start date
 * @param endDate - Optional end date for multi-day events
 * @param lang - Language code ('eu' or 'es')
 * @returns Formatted date string
 */
export function formatEventDate(
	startDate: Date,
	endDate: Date | null,
	lang: 'eu' | 'es'
): string {
	const locale = lang === 'eu' ? 'eu-ES' : 'es-ES';

	const startDay = startDate.getDate();
	const startMonth = startDate.toLocaleDateString(locale, { month: 'long' });

	if (!endDate) {
		// single-day event
		return lang === 'es'
			? `${startDay} de ${startMonth}`
			: `${startMonth}k ${startDay}`;
	}

	const endDay = endDate.getDate();
	const endMonth = endDate.toLocaleDateString(locale, { month: 'long' });

	const sameMonth =
		startDate.getMonth() === endDate.getMonth() &&
		startDate.getFullYear() === endDate.getFullYear();

	if (sameMonth) {
		// Show compact range within same month: "OTSAILAK 8-9" or "8-9 de febrero"
		return lang === 'es'
			? `${startDay}-${endDay} de ${startMonth}`
			: `${startMonth}k ${startDay}-${endDay}`;
	}

	// Different months: show both sides of the range
	if (lang === 'es') {
		return `${startDay} ${startMonth} - ${endDay} ${endMonth}`;
	}

	// For Basque, keep a readable order similar to "otsailak 8 - martxoak 9"
	return `${startMonth}k ${startDay} - ${endMonth}k ${endDay}`;
}
