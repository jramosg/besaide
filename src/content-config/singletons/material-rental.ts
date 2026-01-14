import { fields, singleton } from '@keystatic/core';
import { createImageOptions } from '../util';

export const materialRental = singleton({
	label: 'Material alokairu deskribapena',
	path: 'src/data/material-rental',
	schema: {
		contentEu: fields.markdoc({
			label: 'Deskribapena',
			options: createImageOptions('material-rental')
		}),
		contentEs: fields.markdoc({
			label: 'Descripción',
			options: createImageOptions('material-rental')
		})
	}
});
