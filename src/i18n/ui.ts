export const defaultLang = 'eu';

export const ui = {
	es: {
		'Besaide Mendizale Elkartea - Hasiera':
			'Asociación de Montañismo Besaide - Inicio',
		'Besaide Mendizale Elkartea - Lege oharra eta pribatutasun politika':
			'Asociación de Montañismo Besaide - Aviso legal y política de privacidad',
		'switch-language': 'Cambiar idioma',
		'language-euskera': 'Euskera',
		'language-espanol': 'Español',
		// Pagination
		'pagination.pages': 'Páginas',
		'pagination.results-total': 'resultados en total',
		'pagination.per-page': 'por página',
		'pagination.page-of': 'Página',
		'pagination.of': 'de',
		'pagination.first': 'Primera',
		'pagination.last': 'Última',
		'pagination.previous': 'Anterior',
		'pagination.next': 'Siguiente',
		'pagination.first-page': 'Primera página',
		'pagination.last-page': 'Última página',
		'pagination.previous-page': 'Página anterior',
		'pagination.next-page': 'Página siguiente',
		'pagination.page': 'Página',
		eu: 'Euskera',
		es: 'Español',
		'settings.description': 'setting.description',
		a: 'a',
		'Orri nagusira joan': 'Ir a la página principal',
		'Menua itxi': 'Cerrar menú',
		'Menua ireki': 'Abrir menú',
		'nav.news': 'Noticias',
		'nav.home': 'Inicio',
		'Zure enpresak edo erakundeak gure mendizale elkarteko babesle izan nahi badu, jar zaitez gurekin harremanetan. Elkarrekin, mendizaletasuna bultzatu eta naturaren kultura zabal dezakegu.':
			'Si tu empresa o entidad quiere ser patrocinador de nuestra asociación de montañismo, ponte en contacto con nosotros. Juntos, podemos promover el montañismo y difundir la cultura de la naturaleza.'
	},
	eu: {
		'Besaide Mendizale Elkartea - Hasiera':
			'Besaide Mendizale Elkartea - Hasiera',
		'switch-language': 'Hizkuntza aldatu',
		'language-euskera': 'Euskera',
		'language-espanol': 'Gaztelania',
		// Pagination
		'pagination.pages': 'Orrialdeak',
		'pagination.results-total': 'emaitza guztira',
		'pagination.per-page': 'orrialde bakoitzeko',
		'pagination.page-of': 'orria',
		'pagination.of': 'tik',
		'pagination.first': 'Lehena',
		'pagination.last': 'Azkena',
		'pagination.previous': 'Aurrekoa',
		'pagination.next': 'Hurrengoa',
		'pagination.first-page': 'Lehen orria',
		'pagination.last-page': 'Azken orria',
		'pagination.previous-page': 'Aurreko orria',
		'pagination.next-page': 'Hurrengo orria',
		'pagination.page': 'orria',
		eu: 'Euskera',
		es: 'Gaztelania',
		'settings.description': 'setting.description',
		a: 'a',
		'nav.news': 'Berriak',
		'nav.home': 'Hasiera'
	}
} as const;

export type Langs = keyof typeof ui;

// All possible UI keys across any language (union of keys from all language objects)
export type UIKeys = {
	[K in keyof typeof ui]: keyof (typeof ui)[K];
}[keyof typeof ui];
