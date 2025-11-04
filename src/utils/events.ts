import type { CollectionEntry } from 'astro:content';
import type { ProcessedEvent } from '@/types/Events';
import { processEventImage } from './images';
import { slugify } from './string';

/**
 * Process a single event with image processing and slug generation
 */
export const processEvent = async (
	item: CollectionEntry<'events'>,
	agendaSection: string,
	today?: Date
): Promise<ProcessedEvent> => {
	const processedImage = await processEventImage(item.id, item.data.image);
	const isPast = today ? new Date(item.data.date) < today : false;

	return {
		...item,
		processedImage,
		slug: `${agendaSection}/${slugify(item.id)}`,
		isPast
	};
};
