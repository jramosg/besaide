import type { ImageMetadata } from 'astro';

/**
 * Import all event images using glob pattern
 */
export const getEventImages = () => {
	return import.meta.glob<{ default: ImageMetadata }>(
		'/src/assets/images/events/*/image.{jpeg,jpg,png,gif,webp}'
	);
};

/**
 * Import all general assets images using glob pattern
 */
export const getGeneralImages = () => {
	return import.meta.glob<{ default: ImageMetadata }>(
		'/src/assets/*.{jpeg,jpg,png,gif,webp}'
	);
};

/**
 * Get image path for a specific event
 */
export const getEventImagePath = (eventId: string): string => {
	return `/src/assets/images/events/${eventId}/image`;
};

/**
 * Process image from glob result
 */
export const getImageFromGlob = async (
	images: Record<string, () => Promise<{ default: ImageMetadata }>>,
	imagePath: string
): Promise<ImageMetadata | null> => {
	// Try different extensions
	const extensions = ['jpeg', 'jpg', 'png', 'gif', 'webp'];

	for (const ext of extensions) {
		const fullPath = `${imagePath}.${ext}`;
		if (images[fullPath]) {
			const imageModule = await images[fullPath]();
			return imageModule.default;
		}
	}

	return null;
};

/**
 * Process event image from event data
 */
export const processEventImage = async (
	images: Record<string, () => Promise<{ default: ImageMetadata }>>,
	eventId: string,
	imageFileName: string | undefined,
	fallbackImage: ImageMetadata
): Promise<ImageMetadata> => {
	if (!imageFileName) {
		return fallbackImage;
	}

	const imagePath = `/src/assets/images/events/${eventId}/${imageFileName}`;

	try {
		if (images[imagePath]) {
			return (await images[imagePath]()).default;
		}
	} catch (error) {
		console.warn(`Could not import image: ${imageFileName}`, error);
	}

	return fallbackImage;
};

/**
 * Process general asset image from asset path
 */
export const processGeneralImage = async (
	images: Record<string, () => Promise<{ default: ImageMetadata }>>,
	imagePath: string | undefined,
	fallbackImage: ImageMetadata
): Promise<ImageMetadata> => {
	if (!imagePath) {
		return fallbackImage;
	}

	let fullPath = imagePath;

	// Handle @/assets/ paths
	if (imagePath.startsWith('@/assets/')) {
		fullPath = `/${imagePath.replace('@/', 'src/')}`;
	}

	try {
		if (images[fullPath]) {
			return (await images[fullPath]()).default;
		} else {
			console.error(
				`Image not found: ${fullPath}. Available images:`,
				Object.keys(images)
			);
		}
	} catch (error) {
		console.warn(`Could not import image: ${imagePath}`, error);
	}

	return fallbackImage;
};
