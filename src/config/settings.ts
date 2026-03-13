export const url = 'https://besaide.vercel.app/';

export const settings = {
	title: `Besaide Mendizale Elkartea`,
	description: `settings.description`,
	descriptionBillingual:
		'Besaide Mendizale Elkartea - Club de montaña en Arrasate-Mondragón. Salidas, socios, refugio de Leixargarate y servicios para montañeros.',
	url: url,
	name: `Besaide Mendizale Elkartea`,
	keywords: {
		es: 'Besaide, club de montaña Arrasate, asociación montañismo Gipuzkoa, excursiones montaña País Vasco, Leixargarate refugio, esquí alpino, federación montaña, senderismo Arrasate, mendizale elkartea',
		eu: 'Besaide, mendizale elkartea Arrasate, mendi taldea Gipuzkoa, mendi irteerak Euskal Herria, Leixargarate aterpea, eski alpinoa, mendi federazioa, mendizaletasuna Arrasate'
	}
} as const;

export type Settings = typeof settings;
