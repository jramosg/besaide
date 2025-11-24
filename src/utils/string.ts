export function slugify(text: string): string {
	return text
		.toString()
		.toLowerCase()
		.replace(/ñ/g, 'n') // Replace ñ with n
		.replace(/\s+/g, '-') // Replace spaces with -
		.replace(/[^\w\-]+/g, '') // Remove all non-word chars
		.replace(/\-\-+/g, '-') // Replace multiple - with single -
		.replace(/^-+/, '') // Trim - from start of text
		.replace(/-+$/, ''); // Trim - from end of text
}

export function capitalizeFirstLetter(text: string): string {
	if (text.length === 0) return text;
	return text.charAt(0).toUpperCase() + text.slice(1);
}

export function transformFilename(originalFilename: string): string {
	const extension = originalFilename.split('.').pop();
	return self.crypto.randomUUID() + '.' + extension;
}