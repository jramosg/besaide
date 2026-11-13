import { mkdir, readFile, writeFile } from 'node:fs/promises';
import sharp from 'sharp';

const source = await readFile(
	new URL('../src/assets/udalaitz.webp', import.meta.url)
);
const output = new URL('../src/assets/generated/hero/', import.meta.url);
const widths = [640, 750, 1080, 1280, 1920, 2560];

await mkdir(output, { recursive: true });

// Generate once before Astro builds, including when the page uses SSR.
// Importing these files gives them hashed URLs served directly by Nginx.
for (const width of widths) {
	for (const format of ['avif', 'webp']) {
		const resized = sharp(source).resize({ width, withoutEnlargement: true });
		const image =
			format === 'avif'
				? resized.avif({ quality: 50, effort: 4 })
				: resized.webp({ quality: 72, effort: 5 });

		await writeFile(
			new URL(`udalaitz-${width}.${format}`, output),
			await image.toBuffer()
		);
	}
}

console.log(`Generated ${widths.length} hero sizes in AVIF and WebP.`);
