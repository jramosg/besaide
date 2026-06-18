import { readdir, readFile, rm, stat, writeFile } from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

const DEFAULT_MAX = 2560;
const WEBP_QUALITY = 82;
const JPEG_QUALITY = 82;

const imageRoots = ['src/assets/images'];
const referenceRoots = ['src', 'keystatic.config.tsx', 'astro.config.mjs'];
const imageExtensions = new Set(['.jpg', '.jpeg', '.png', '.webp']);
const textExtensions = new Set([
	'.astro',
	'.css',
	'.js',
	'.json',
	'.md',
	'.mdoc',
	'.mjs',
	'.ts',
	'.tsx',
	'.yaml',
	'.yml'
]);

const check = process.argv.includes('--check');
const force = process.argv.includes('--force');

function kb(bytes) {
	return `${Math.round(bytes / 1024)} KB`;
}

function toPosix(filePath) {
	return filePath.split(path.sep).join('/');
}

function shouldConvertToWebp(metadata, extension) {
	if (extension === '.webp') {
		return false;
	}

	return !(extension === '.png' && metadata.hasAlpha);
}

function outputPathFor(filePath, metadata) {
	const extension = path.extname(filePath).toLowerCase();

	if (shouldConvertToWebp(metadata, extension)) {
		return filePath.replace(/\.[^.]+$/, '.webp');
	}

	return filePath;
}

function shouldProcess(filePath, outPath, metadata) {
	const longEdge = Math.max(metadata.width ?? 0, metadata.height ?? 0);

	return force || filePath !== outPath || longEdge > DEFAULT_MAX;
}

function replacementPairs(oldPath, newPath) {
	const oldRel = toPosix(oldPath);
	const newRel = toPosix(newPath);
	const oldAsset = oldRel.replace(/^src\/assets\//, '@/assets/');
	const newAsset = newRel.replace(/^src\/assets\//, '@/assets/');

	return [
		[oldRel, newRel],
		[oldAsset, newAsset],
		[`/${oldRel}`, `/${newRel}`]
	];
}

async function walkFiles(entry) {
	const fileStat = await stat(entry);

	if (fileStat.isFile()) {
		return [entry];
	}

	if (!fileStat.isDirectory()) {
		return [];
	}

	const entries = await readdir(entry, { withFileTypes: true });
	const nested = await Promise.all(
		entries.map(item => walkFiles(path.join(entry, item.name)))
	);

	return nested.flat();
}

async function imageFiles() {
	const files = (await Promise.all(imageRoots.map(walkFiles))).flat();

	return files.filter(file =>
		imageExtensions.has(path.extname(file).toLowerCase())
	);
}

async function referenceFiles() {
	const existing = [];

	for (const root of referenceRoots) {
		try {
			existing.push(...(await walkFiles(root)));
		} catch (error) {
			if (error.code !== 'ENOENT') {
				throw error;
			}
		}
	}

	return existing.filter(file => textExtensions.has(path.extname(file)));
}

async function optimizeImage(filePath) {
	const input = sharp(filePath, { animated: false });
	const metadata = await input.metadata();

	if (!metadata.width || !metadata.height || (metadata.pages ?? 1) > 1) {
		return null;
	}

	const outPath = outputPathFor(filePath, metadata);

	if (!shouldProcess(filePath, outPath, metadata)) {
		return null;
	}

	if (check) {
		return { filePath, outPath, checkOnly: true };
	}

	const before = (await stat(filePath)).size;
	let pipe = sharp(filePath).rotate();

	if (Math.max(metadata.width, metadata.height) > DEFAULT_MAX) {
		pipe = pipe.resize({
			width: DEFAULT_MAX,
			height: DEFAULT_MAX,
			fit: 'inside',
			withoutEnlargement: true
		});
	}

	const outExtension = path.extname(outPath).toLowerCase();

	if (outExtension === '.webp') {
		pipe = pipe.webp({ quality: WEBP_QUALITY, effort: 6 });
	} else if (outExtension === '.png') {
		pipe = pipe.png({ compressionLevel: 9, palette: true });
	} else {
		pipe = pipe.jpeg({ quality: JPEG_QUALITY, mozjpeg: true });
	}

	const buffer = await pipe.toBuffer();
	await writeFile(outPath, buffer);

	if (outPath !== filePath) {
		await rm(filePath);
	}

	const after = (await stat(outPath)).size;
	const outputMetadata = await sharp(outPath).metadata();

	return {
		filePath,
		outPath,
		before,
		after,
		beforeSize: `${metadata.width}x${metadata.height}`,
		afterSize: `${outputMetadata.width}x${outputMetadata.height}`
	};
}

async function updateReferences(changes) {
	const pairs = changes
		.filter(change => change.outPath !== change.filePath)
		.flatMap(change => replacementPairs(change.filePath, change.outPath));

	if (pairs.length === 0 || check) {
		return [];
	}

	const changedFiles = [];

	for (const file of await referenceFiles()) {
		let content = await readFile(file, 'utf8');
		let nextContent = content;

		for (const [oldPath, newPath] of pairs) {
			nextContent = nextContent.split(oldPath).join(newPath);
		}

		if (nextContent !== content) {
			await writeFile(file, nextContent);
			changedFiles.push(file);
		}
	}

	return changedFiles;
}

const changes = [];

for (const file of await imageFiles()) {
	const change = await optimizeImage(file);

	if (change) {
		changes.push(change);
	}
}

const changedReferences = await updateReferences(changes);

if (check && changes.length > 0) {
	console.error('Images need optimization:');
	for (const change of changes) {
		const from = toPosix(change.filePath);
		const to = toPosix(change.outPath);
		console.error(from === to ? `- ${from}` : `- ${from} -> ${to}`);
	}
	console.error('\nRun `pnpm optimize:images` and commit the result.');
	process.exit(1);
}

if (changes.length === 0) {
	console.log('No source images needed optimization.');
} else {
	for (const change of changes) {
		const from = toPosix(change.filePath);
		const to = toPosix(change.outPath);
		const fileLabel = from === to ? to : `${from} -> ${to}`;
		console.log(
			`${fileLabel}  ${change.beforeSize} -> ${change.afterSize}  ${kb(
				change.before
			)} -> ${kb(change.after)}`
		);
	}
}

if (changedReferences.length > 0) {
	console.log('\nUpdated image references:');
	for (const file of changedReferences) {
		console.log(`- ${toPosix(file)}`);
	}
}
