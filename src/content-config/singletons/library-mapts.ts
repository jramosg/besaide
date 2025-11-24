import { fields, singleton } from '@keystatic/core';
import { createImageOptions } from '../util';

export const libraryMaps = singleton({
	label: 'Liburutegia / Mapak',
	path: 'src/data/library-maps',
	schema: {
		contentEu: fields.markdoc({
			label: 'Edukia: Liburutegia / Mapa',
			description: 'Liburutegia euskeraz',
			options: createImageOptions('library-maps')
		}),
		contentEs: fields.markdoc({
			label: 'Contenido de: Librería / Mapas ',
			description: 'Liburutegia gaztelaniaz',
			options: createImageOptions('library-maps')
		})
	}
});
