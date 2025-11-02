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
const getNewsImages = () => {
	return import.meta.glob<{ default: ImageMetadata }>(
		'/src/assets/images/news/*/image.{jpeg,jpg,png,gif,webp}'
	);
};

export const NewsImages = getNewsImages();

/**
 * Generic helper to process images
 */
const processImage = async (
	type: 'events' | 'news',
	images: Record<string, () => Promise<{ default: ImageMetadata }>>,
	itemId: string,
	imageFileName: string | undefined
): Promise<ImageMetadata> => {
	if (!imageFileName) {
		return UdalaitzImg;
	}

	const imagePath = `/src/assets/images/${type}/${itemId}/${imageFileName}`;

	try {
		if (images[imagePath]) {
			return (await images[imagePath]()).default;
		}
	} catch (error) {
		console.warn(`Could not import image: ${imageFileName}`, error);
	}

	return UdalaitzImg;
};

/**
 * Process event image from event data
 */
export const processEventImage = async (
	eventId: string,
	imageFileName: string | undefined
): Promise<ImageMetadata> => {
	return processImage('events', EventImages, eventId, imageFileName);
};

/**
 * Process news image from news data
 */
export const processNewsImage = async (
	newsId: string,
	imageFileName: string | undefined
): Promise<ImageMetadata> => {
	return processImage('news', NewsImages, newsId, imageFileName);
};
