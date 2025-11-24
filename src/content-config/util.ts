function transformFilename(originalFilename: string): string {
	const extension = originalFilename.split('.').pop();
	return self.crypto.randomUUID() + '.' + extension;
}

export const createImageOptions = (subdirectory: string) => ({
	image: {
		directory: `src/assets/images/${subdirectory}`,
		publicPath: `@/assets/images/${subdirectory}`,
		transformFilename: (filename: string) => transformFilename(filename)
	}
});
