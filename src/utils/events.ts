import { getCollection, type CollectionEntry } from 'astro:content';
import type { ProcessedEvent } from '@/types/Events';
import { slugify } from './string';

/**
 * Process a single event with image processing and slug generation
 */
export const processEvent = async (
	item: CollectionEntry<'events'>,
	agendaSection: string,
	today?: Date
): Promise<ProcessedEvent> => {
	const isPast = today ? new Date(item.data.date) < today : false;

	return {
		...item,
		slug: `${agendaSection}/${slugify(item.id)}`,
		isPast
	};
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
		const isPast = new Date(entry.data.date) < today;
		processedEvents.push({
			...entry,
			slug: `${agendaSection}/${slugify(entry.id)}`,
			isPast
		});
	}

	// Sort by date (oldest first)
	processedEvents.sort((a, b) => {
		const dateA = new Date(a.data.date);
		const dateB = new Date(b.data.date);
		return dateA.getTime() - dateB.getTime();
	});

	return processedEvents;
};
