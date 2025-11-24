import { transformFilename } from '@/utils/string';
import { fields, singleton } from '@keystatic/core';

export const libraryMaps = singleton({
	label: 'Liburutegia / Mapak',
	path: 'src/data/library-maps',
	schema: {
		contentEu: fields.markdoc({
			label: 'Edukia: Liburutegia / Mapa',
			description: 'Liburutegia euskeraz',
			options: {
				image: {
					directory: 'src/assets/images/library-maps',
					publicPath: '@/assets/images/library-maps',
					transformFilename: filename => transformFilename(filename)
				}
			}
		}),
		contentEs: fields.markdoc({
			label: 'Contenido de: Librería / Mapas ',
			description: 'Liburutegia gaztelaniaz',
			options: {
				image: {
					directory: 'src/assets/images/library-maps',
					publicPath: '@/assets/images/library-maps',
					transformFilename: filename => transformFilename(filename)
				}
			}
		})
	}
});
