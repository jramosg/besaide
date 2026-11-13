export const eventThumbnailImageOptions = {
	width: 768,
	widths: [320, 480, 640, 768],
	sizes: '(max-width: 768px) 100vw, (max-width: 1024px) 200px, 236px',
	layout: 'constrained' as const,
	fit: 'cover' as const,
	position: 'center'
};
