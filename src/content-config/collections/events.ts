import { collection, fields } from '@keystatic/core';
import { createImageOptions } from '../util';

export const events = collection({
	label: 'Gertaerak / Eventos',
	slugField: 'title',
	path: 'src/data/events/*',
	schema: {
		title: fields.slug({
			name: { label: 'Izenburua / Título' }
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
		type: fields.select({
			label: 'Mota / Tipo',
			description: 'Zer motatako jarduera den (montaña, ski alpino, etc.)',
			options: [
				{ label: 'Mendi irteera / Salida de montaña', value: 'mountain' },
				{ label: 'Mendi martxa', value: 'mountain-martxa' },
				{ label: 'Eski irteera / Salida de esquí', value: 'ski-alpino' },
				{ label: 'Ekintzak / Eventos', value: 'event' },
				{ label: 'Ikastaroak / Cursos', value: 'course' },
				{
					label: 'Espeologia irteera / Salida de espeleología',
					value: 'speleology'
				}
			],
			defaultValue: 'mountain'
		}),
		mountain: fields.text({
			label: 'Mendia / Montaña',
			description: 'Mendi edo gailurraren izena'
		}),
		location: fields.text({
			label: 'Tokia / Lugar',
			description: 'Non egingo den ekitaldia / Dónde se realizará el evento'
		}),
		duration: fields.text({
			label: 'Iraupena / Duración',
			description: 'Adib: 8-9 ordu'
		}),
		meetingPoint: fields.text({
			label: 'Topagunea / Punto de encuentro',
			description: 'Non eta noiz bildu'
		}),
		time: fields.text({
			label: 'Ordua / Hora'
		}),
		elevationGain: fields.text({
			label: 'Desnibela / Desnivel',
			description: 'Adib: +1200 m'
		}),
		distance: fields.text({
			label: 'Distantzia / Distancia',
			description: 'Adib: 16 km'
		}),

		image: fields.image({
			label: 'Irudia / Imagen',
			directory: 'src/assets/images/events',
			publicPath: '@/assets/images/events'
		}),
		summaryEu: fields.text({
			label: 'Laburpena',
			description: 'Laburpen labur bat',
			validation: { isRequired: true, length: { max: 200 } },
			multiline: true
		}),
		summaryEs: fields.text({
			label: 'Resumen',
			description: 'Resumen breve',
			validation: { isRequired: true, length: { max: 200 } },
			multiline: true
		}),
		descriptionEu: fields.markdoc({
			label: 'Deskribapena / Descripción',
			description: 'Gertaeraren deskribapen osoa',
			options: createImageOptions('events')
		}),
		descriptionEs: fields.markdoc({
			label: 'Descripción',
			description: 'Descripción completa del evento',
			options: createImageOptions('events')
		}),
		extraInfoEu: fields.markdoc({
			label: 'Informazio gehigarria',
			description: 'Ekarpen osagarriak, gomendatutako ekipamendua, etab.',
			options: createImageOptions('events')
		}),
		extraInfoEs: fields.markdoc({
			label: 'Información adicional',
			description: 'Aportaciones adicionales, equipo recomendado, etc.',
			options: createImageOptions('events')
		}),
		priceDescriptionEu: fields.markdoc({
			label: 'Prezioaren deskribapena',
			description: 'Prezioari buruzko informazio gehigarria',
			options: createImageOptions('events')
		}),
		priceDescriptionEs: fields.markdoc({
			label: 'Descripción del precio',
			description: 'Información adicional sobre el precio',
			options: createImageOptions('events')
		}),
		prices: fields.array(
			fields.object({
				labelEu: fields.text({
					label: 'Prezioaren izena euskeraz',
					description: 'Adib: Bazkidea, Ez bazkidea...',
					validation: { isRequired: true }
				}),
				labelEs: fields.text({
					label: 'Nombre del precio en español',
					description: 'Ej: Socio, No socio...',
					validation: { isRequired: true }
				}),
				price: fields.number({
					label: 'Prezioa (€) / Precio (€)',
					validation: { isRequired: true, min: 0 }
				})
			}),
			{
				label: 'Prezioak',
				itemLabel: props =>
					props.fields.labelEu.value + ': ' + props.fields.price.value + '€'
			}
		),
		routes: fields.array(
			fields.object({
				labelEu: fields.text({
					label: 'Izena ',
					validation: { isRequired: true }
				}),
				labelEs: fields.text({
					label: 'Nombre',
					validation: { isRequired: true }
				}),
				url: fields.text({
					label: 'URL',
					validation: { isRequired: true }
				}),
				image: fields.image({
					label: 'Irudia / Imagen',
					directory: 'src/assets/images/event-routes',
					publicPath: '@/assets/images/event-routes',
					validation: { isRequired: true }
				})
			}),
			{
				label: 'Ibilbideak / Rutas',
				itemLabel: props => props.fields.labelEu.value
			}
		)
	}
});
