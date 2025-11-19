import { fields, singleton } from '@keystatic/core';

export const libraryMaps = singleton({
	label: 'Liburutegia / Mapak',
	path: 'src/data/library-maps',
	schema: {
		contentEu: fields.markdoc({
			label: 'Edukia: Liburutegia / Mapa',
			description: 'Liburutegia euskeraz'
		}),
		contentEs: fields.markdoc({
			label: 'Contenido de: Librería / Mapas ',
			description: 'Liburutegia gaztelaniaz'
		})
	}
});
