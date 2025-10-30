// keystatic.config.ts
import { config, fields, collection } from '@keystatic/core';

export default config({
	ui: {
		brand: {
			name: 'Besaide Mendizale Elkartea',
			mark: ({}) => {
				return <img src={'/favicon.png'} height={24} />;
			}
		}
	},

	storage: {
		kind: 'github',
		repo: {
			owner: 'jramosg',
			name: 'besaide'
		}
	},
	collections: {
		events: collection({
			label: 'Gertaerak / Eventos',
			slugField: 'title',
			path: 'src/data/events/*',
			format: { contentField: 'content' },
			schema: {
				title: fields.slug({
					name: { label: 'Izenburua / Título' }
				}),
				lang: fields.select({
					label: 'Hizkuntza / Idioma',
					options: [
						{ label: 'Euskera', value: 'eu' },
						{ label: 'Español', value: 'es' }
					],
					defaultValue: 'eu'
				}),
				date: fields.date({
					label: 'Data / Fecha',
					description: 'Formato: YYYY-MM-DD',
					validation: { isRequired: true }
				}),
				// Optional end date for multi-day events
				endDate: fields.date({
					label: 'Amaiera data / Fecha fin',
					description: 'Formato: YYYY-MM-DD (opcional)'
				}),
				time: fields.text({
					label: 'Ordua / Hora',
					description: 'Adib: 06:30'
				}),
				// Conditional fields based on type
				typeSpecificFields: fields.conditional(
					fields.select({
						label: 'Mota / Tipo',
						description:
							'Zer motatako jarduera den (montaña, ski alpino, etc.)',
						options: [
							{ label: 'Mendia / Montaña', value: 'mountain' },
							{ label: 'Eskia - Ski Alpino', value: 'ski-alpino' }
						],
						defaultValue: 'mountain'
					}),
					{
						mountain: fields.object({
							mountain: fields.text({
								label: 'Mendia / Montaña',
								description: 'Mendi edo gailurraren izena',
								validation: { isRequired: true }
							}),
							difficulty: fields.select({
								label: 'Zailtasuna / Dificultad',
								options: [
									{ label: 'Erraza', value: 'erraza' },
									{ label: 'Ertaina', value: 'ertaina' },
									{ label: 'Zaila', value: 'zaila' },
									{ label: 'Oso zaila', value: 'oso-zaila' }
								],
								defaultValue: 'ertaina'
							}),
							elevation: fields.text({
								label: 'Altuera / Altitud',
								description: 'Adib: 2507 m',
								validation: { isRequired: true }
							})
						}),
						'ski-alpino': fields.object({
							location: fields.text({
								label: 'Kokalekua / Ubicación',
								description: 'Herria edo kokalekua',
								validation: { isRequired: true }
							})
						})
					}
				),
				distance: fields.text({
					label: 'Distantzia / Distancia',
					description: 'Adib: 16 km',
					validation: { isRequired: true }
				}),
				duration: fields.text({
					label: 'Iraupena / Duración',
					description: 'Adib: 8-9 ordu',
					validation: { isRequired: true }
				}),
				meetingPoint: fields.text({
					label: 'Bilketa puntua / Punto de encuentro',
					description: 'Non eta noiz bildu',
					validation: { isRequired: true }
				}),
				image: fields.image({
					label: 'Irudia / Imagen',
					directory: 'src/assets/images/events',
					validation: { isRequired: true }
				}),
				content: fields.markdoc({
					label: 'Edukia / Contenido',
					description: 'Gertaeraren deskribapen osoa'
				})
			}
		})
	}
});
