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
		a: 'a'
	},
	eu: {
		'Besaide Mendizale Elkartea - Hasiera':
			'Besaide Mendizale Elkartea - Hasiera',
		'switch-language': 'Hizkuntza aldatu',
		'language-euskera': 'Euskera',
		'language-espanol': 'Gaztelania'
	}
} as const;

export type Langs = keyof typeof ui;

// All possible UI keys across any language (union of keys from all language objects)
export type UIKeys = {
	[K in keyof typeof ui]: keyof (typeof ui)[K];
}[keyof typeof ui];
