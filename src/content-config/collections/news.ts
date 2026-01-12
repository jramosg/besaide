import { collection, fields } from '@keystatic/core';
import { createImageOptions } from '../util';

export const news = collection({
	label: 'Albisteak / Noticias',
	slugField: 'titleEu',
	path: 'src/data/news/*',
	schema: {
		titleEu: fields.slug({
			name: { label: 'Izenburua euskeraz' }
		}),
		titleEs: fields.text({
			label: 'Izenburua gaztelaniaz'
		}),
		date: fields.date({
			label: 'Data / Fecha',
			validation: { isRequired: true }
		}),
		image: fields.image({
			label: 'Irudia / Imagen',
			directory: 'src/assets/images/news',
			publicPath: '@/assets/images/news'
		}),
		summaryEu: fields.text({
			label: 'Laburpena euskeraz',
			description: 'Laburpen labur bat',
			validation: { isRequired: true, length: { max: 200 } },
			multiline: true
		}),
		summaryEs: fields.text({
			label: 'Laburpena gaztelaniaz',
			description: 'Resumen breve',
			validation: { isRequired: true, length: { max: 200 } },
			multiline: true
		}),
		contentEu: fields.markdoc({
			label: 'Edukia euskeraz',
			description: 'Albiste osoaren edukia',
			options: createImageOptions('news')
		}),
		contentEs: fields.markdoc({
			label: 'Edukia gaztelaniaz',
			description: 'Contenido completo de la noticia',
			options: createImageOptions('news')
		})
	}
});
