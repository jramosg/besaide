import { getCollection, type CollectionEntry } from 'astro:content';
import type { ProcessedEvent } from '@/types/Events';
import { slugify } from './string';

// Extract common logic for processing events into a helper function
const processEventEntry = (
	entry: CollectionEntry<'events'>,
	agendaSection: string,
	today: Date
): ProcessedEvent => {
	const isPast = new Date(entry.data.date) < today;
	return {
		...entry,
		slug: `${agendaSection}/${entry.data.date.getFullYear()}/${slugify(entry.id)}`,
		isPast
	};
};

export const processEvent = async (
	item: CollectionEntry<'events'>,
	agendaSection: string,
	today?: Date
): Promise<ProcessedEvent> => {
	return processEventEntry(item, agendaSection, today || new Date());
};

export const sortedAndFilteredEvents = async (
	agendaSection: string = 'agenda',
	today: Date = new Date(),
	{ yearFilter }: { yearFilter?: number } = {}
): Promise<ProcessedEvent[]> => {
	// load collection
	const allEvents = await getCollection('events');
	const processedEvents: ProcessedEvent[] = [];

	for (const entry of allEvents) {
		// Filter by language

		if (yearFilter && entry.data.date.getFullYear() !== yearFilter) {
			continue;
		}
		// Add isPast and slug
		processedEvents.push(processEventEntry(entry, agendaSection, today));
	}

	// Sort by date (oldest first)
	processedEvents.sort((a, b) => {
		const dateA = new Date(a.data.date);
		const dateB = new Date(b.data.date);
		return dateA.getTime() - dateB.getTime();
	});

	return processedEvents;
};

// Parse time and create a date with time for calendar
export const calculateStartDateWithTime = (
	eventDate: Date,
	time?: string
): Date => {
	if (!time) return eventDate;

	// Try to parse time in HH:MM or H:MM format
	const timeMatch = time.match(/(\d{1,2}):(\d{2})/);
	if (timeMatch) {
		const [, hours, minutes] = timeMatch;
		const dateWithTime = new Date(eventDate);
		dateWithTime.setHours(parseInt(hours, 10), parseInt(minutes, 10), 0, 0);
		return dateWithTime;
	}

	// If time format is not parseable, return date without time
	return eventDate;
};

// Calculate end date/time for calendar
export const calculateEndDateForCalendar = (
	endDate: Date | null,
	startDateWithTime: Date,
	durationHours?: number
): Date | null => {
	// If there's an explicit endDate, use end of that day
	if (endDate) {
		const endOfDay = new Date(endDate);
		endOfDay.setHours(23, 59, 59, 999);
		return endOfDay;
	}

	// If there's a durationHours, calculate end time from start time
	if (durationHours && durationHours > 0) {
		const calculatedEnd = new Date(startDateWithTime);
		calculatedEnd.setHours(calculatedEnd.getHours() + durationHours);
		return calculatedEnd;
	}

	return null;
};

// Format date as local ISO string (without UTC conversion)
export const formatLocalISOString = (date: Date): string => {
	const year = date.getFullYear();
	const month = String(date.getMonth() + 1).padStart(2, '0');
	const day = String(date.getDate()).padStart(2, '0');
	const hours = String(date.getHours()).padStart(2, '0');
	const minutes = String(date.getMinutes()).padStart(2, '0');
	const seconds = String(date.getSeconds()).padStart(2, '0');

	return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;
};
