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
