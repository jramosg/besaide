import type { ImageMetadata } from 'astro';
import UdalaitzImg from '@/assets/udalaitz.webp';

/**
 * Import all event images using glob pattern
 */
const getEventImages = () => {
	return import.meta.glob<{ default: ImageMetadata }>(
		'/src/assets/images/events/*/image.{jpeg,jpg,png,gif,webp}'
	);
};

export const EventImages = getEventImages();

/**
 * Import all news images using glob pattern
 */
export const getNewsImages = () => {
	return import.meta.glob<{ default: ImageMetadata }>(
		'/src/assets/images/news/*/image.{jpeg,jpg,png,gif,webp}'
	);
};

export const NewsImages = getNewsImages();

/**
 * Get image path for a specific event
 */
export const getEventImagePath = (eventId: string): string => {
	return `/src/assets/images/events/${eventId}/image`;
};

/**
 * Process event image from event data
 */
export const processEventImage = async (
	eventId: string,
	imageFileName: string | undefined
): Promise<ImageMetadata> => {
	if (!imageFileName) {
		return UdalaitzImg;
	}

	const imagePath = `/src/assets/images/events/${eventId}/${imageFileName}`;

	try {
		if (EventImages[imagePath]) {
			return (await EventImages[imagePath]()).default;
		}
	} catch (error) {
		console.warn(`Could not import image: ${imageFileName}`, error);
	}

	return UdalaitzImg;
};

/**
 * Process event image from event data
 */
export const processNewsImage = async (
	eventId: string,
	imageFileName: string | undefined
): Promise<ImageMetadata> => {
	if (!imageFileName) {
		return UdalaitzImg;
	}

	const imagePath = `/src/assets/images/news/${eventId}/${imageFileName}`;

	try {
		if (NewsImages[imagePath]) {
			return (await NewsImages[imagePath]()).default;
		}
	} catch (error) {
		console.warn(`Could not import image: ${imageFileName}`, error);
	}

	return UdalaitzImg;
};
