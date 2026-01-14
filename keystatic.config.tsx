import { CompanyName } from '@/config/company';
import { events } from '@/content-config/collections/events';
import { news } from '@/content-config/collections/news';
import { homepage } from '@/content-config/singletons/homepage';
import { libraryMaps } from '@/content-config/singletons/library-mapts';
import { createImageOptions } from '@/content-config/util';
import { config, fields, collection, singleton } from '@keystatic/core';

const GitHubConfig = {
	kind: 'local'
} as const;

export default config({
	ui: {
		brand: {
			name: CompanyName,
			mark: ({}) => {
				return <img src={'/favicon.png'} height={24} />;
			}
		}
	},
	storage: GitHubConfig,
	collections: {
		news: news,
		events: events,
		materialRental: collection({
			label: 'Material alokairua / Alquiler de material',
			slugField: 'name_eu',
			path: 'src/data/material-rental/*',
			schema: {
				name_eu: fields.slug({
					name: { label: 'Materiala (euskeraz)' }
				}),
				name_es: fields.text({
					label: 'Material (español)',
					validation: { isRequired: true }
				}),
				icon: fields.select({
					label: 'Ikonoa / Icono',
					description: 'Ikono izena ',
					defaultValue: 'ice-axe',
					options: [
						{ label: 'Pioleta / Piolet', value: 'ice-axe' },
						{ label: 'Pala / Pala', value: 'shovel' },
						{ label: 'Kaskoa / Casco', value: 'helmet' },
						{ label: 'Erraketa / Raquetas', value: 'snowshoe' },
						{ label: 'Kaskoa / Casco', value: 'helmet' },
						{ label: 'Kranpoia / Crampones', value: 'cramps' },
						{ label: 'Foka / Foca', value: 'foka' },
						{ label: 'Beste bat / Otro', value: 'other' }
					]
				}),
				price: fields.number({
					label: 'Prezioa (€) / Precio (€)',
					validation: { isRequired: true, min: 0 }
				}),
				available: fields.checkbox({
					label: 'Eskuragarri / Disponible',
					defaultValue: true
				})
			}
		}),
		routes: collection({
			label: 'Ibilbideak / Rutas',
			slugField: 'titleEu',
			path: 'src/data/routes/*',
			schema: {
				titleEu: fields.slug({
					name: { label: 'Izenburua euskeraz' }
				}),
				titleEs: fields.text({
					label: 'Izenburua gaztelaniaz',
					validation: { isRequired: true }
				}),
				image: fields.image({
					label: 'Irudia / Imagen',
					directory: 'src/assets/images/routes',
					publicPath: '@/assets/images/routes',
					validation: { isRequired: true }
				}),
				wikilocUrl: fields.url({
					label: 'Wikiloc URL',
					description: 'Adib: https://es.wikiloc.com/rutas-senderismo/...',
					validation: { isRequired: true }
				}),
				fromLeixargarate: fields.checkbox({
					label: 'Leixargaratetik abiatzen da? / ¿Sale desde Leixargarate?',
					defaultValue: false
				}),
				descriptionEu: fields.text({
					label: 'Deskribapena euskeraz (aukerakoa)',
					description: 'Ibilbidearen deskribapen laburra',
					multiline: true
				}),
				descriptionEs: fields.text({
					label: 'Descripción en español (opcional)',
					description: 'Breve descripción de la ruta',
					multiline: true
				})
			}
		})
	},
	singletons: {
		homepage: homepage,
		besaideHistory: singleton({
			label: 'Historia / Besaide Historia',
			path: 'src/data/besaide/historia',
			schema: {
				contentEu: fields.markdoc({
					label: 'Historia euskeraz',
					description: 'Besaide Mendizale Elkartearen historia euskeraz',
					options: createImageOptions('besaide/historia')
				}),
				contentEs: fields.markdoc({
					label: 'Historia en español',
					description: 'Historia de la Asociación de Montañismo Besaide',
					options: createImageOptions('besaide/historia')
				})
			}
		}),
		funtzionamendua: singleton({
			label: 'Funtzionamendua / Funcionamiento',
			path: 'src/data/funtzionamendua/funtzionamendua',
			schema: {
				introductionEu: fields.text({
					label: 'Sarrera euskeraz',
					description: 'Sarrera testua',
					multiline: true
				}),
				introductionEs: fields.text({
					label: 'Introducción en español',
					description: 'Texto de introducción',
					multiline: true
				}),
				boardMembers: fields.array(
					fields.object({
						positionEu: fields.text({
							label: 'Kargua euskeraz',
							description: 'Adib: Lehendakaria, Diruzaina...',
							validation: { isRequired: true }
						}),
						positionEs: fields.text({
							label: 'Cargo en español',
							description: 'Ejemplo: Presidente, Tesorero...',
							validation: { isRequired: true }
						}),
						name: fields.text({
							label: 'Izena / Nombre',
							validation: { isRequired: true }
						})
					}),
					{
						label: 'Zuzendaritza Taldea / Equipo Directivo',
						itemLabel: props =>
							props.fields.positionEu.value + ': ' + props.fields.name.value
					}
				),
				closingTextEu: fields.text({
					label: 'Amaiera testua euskeraz',
					description: 'Batzar Orokorrari buruzko informazioa eta bestelakoak',
					multiline: true
				}),
				closingTextEs: fields.text({
					label: 'Texto de cierre en español',
					description: 'Información sobre la Asamblea General y otros detalles',
					multiline: true
				})
			}
		}),
		libraryMaps: libraryMaps,
		membership: singleton({
			label: 'Bazkidetza | Membresía',
			path: 'src/data/membership/membership',
			schema: {
				descriptionEu: fields.text({
					label: 'Bazkidetza deskribapena euskeraz',
					multiline: true
				}),
				descriptionEs: fields.text({
					label: 'Descripción de la membresía en español',
					multiline: true
				}),
				benefitsEu: fields.text({
					label: 'Bazkide izatearen onurak',
					multiline: true,
					validation: { isRequired: true }
				}),
				benefitsEs: fields.text({
					label: 'Beneficios de ser miembro',
					multiline: true,
					validation: { isRequired: true }
				}),
				prices: fields.array(
					fields.object({
						labelEu: fields.text({
							label: 'Prezioaren izena',
							validation: { isRequired: true }
						}),
						labelEs: fields.text({
							label: 'Nombre del precio',
							validation: { isRequired: true }
						}),
						price: fields.number({
							label: 'Prezioa (€) / Precio (€)',
							validation: { isRequired: true, min: 0 }
						})
					}),
					{
						label: 'Prezioak / Precios',
						itemLabel: props =>
							props.fields.labelEu.value +
								': ' +
								props.fields.price.value +
								'€' || 'Prezioa / Precio'
					}
				)
			}
		}),
		leixergarateAterpea: singleton({
			label: 'Leixergarate aterpetxea / Refugio Leixergarate',
			path: 'src/data/leixergarate-aterpea/leixergarate-aterpea',
			schema: {
				descriptionEu: fields.text({
					label: 'Deskribapena euskeraz',
					description: 'Aterpearen deskribapena',
					multiline: true,
					validation: { isRequired: true }
				}),
				descriptionEs: fields.text({
					label: 'Descripción en español',
					description: 'Descripción del refugio',
					multiline: true,
					validation: { isRequired: true }
				}),
				contributionEu: fields.text({
					label: 'Besaidek egindako ekarpena euskeraz',
					description: 'Besaide elkarteak aterpeari egindako ekarpena',
					multiline: true,
					validation: { isRequired: true }
				}),
				contributionEs: fields.text({
					label: 'Contribución de Besaide en español',
					description:
						'Contribución que ha hecho la asociación Besaide al refugio',
					multiline: true,
					validation: { isRequired: true }
				}),
				prices: fields.array(
					fields.object({
						labelEu: fields.text({
							label: 'Prezioaren izena euskeraz',
							validation: { isRequired: true }
						}),
						labelEs: fields.text({
							label: 'Nombre del precio en español',
							validation: { isRequired: true }
						}),
						priceEu: fields.text({
							label: 'Prezioa euskeraz (adib: eguna 25€ / asteburua 50 €)',
							validation: { isRequired: true }
						}),
						priceEs: fields.text({
							label: 'Precio en español (ej: día 25€ / fin de semana 50 €)',
							validation: { isRequired: true }
						}),
						descriptionEu: fields.text({
							label: 'Deskribapena euskeraz (aukerakoa)',
							description: 'Adib: gaua, biak barne, etab.'
						}),
						descriptionEs: fields.text({
							label: 'Descripción en español (opcional)',
							description: 'Ej: noche, ambos inclusive, etc.'
						})
					}),
					{
						label: 'Prezioak / Precios',
						itemLabel: props =>
							props.fields.labelEu.value + ': ' + props.fields.priceEu.value
					}
				),
				termsEu: fields.markdoc({
					label: 'Erabilera baldintzak euskeraz',
					description: 'Aterpearen erabilera baldintzak',
					options: createImageOptions('leixergarate-aterpea/terms')
				}),
				termsEs: fields.markdoc({
					label: 'Términos de uso en español',
					description: 'Términos de uso del refugio',
					options: createImageOptions('leixergarate-aterpea/terms')
				})
			}
		}),
		federation: singleton({
			label: 'Federatzea / Federación',
			path: 'src/data/federation/federation',
			schema: {
				contentEu: fields.markdoc({
					label: 'Edukia euskeraz',
					description: 'Federazioari buruzko informazioa euskeraz',
					options: createImageOptions('federation')
				}),
				contentEs: fields.markdoc({
					label: 'Contenido en español',
					description: 'Información sobre la federación en español',
					options: createImageOptions('federation')
				}),
				infoCardEu: fields.text({
					label: 'Informazio gehigarria euskeraz',
					multiline: true,
					validation: { isRequired: true }
				}),
				infoCardEs: fields.text({
					label: 'Información en español',
					multiline: true,
					validation: { isRequired: true }
				}),
				pricingTable: fields.array(
					fields.object({
						regionEu: fields.text({
							label: 'Eskualdea euskeraz',
							description: 'Adib: Hego Euskal Herria',
							validation: { isRequired: true }
						}),
						regionEs: fields.text({
							label: 'Región en español',
							description: 'Ej: País Vasco Sur',
							validation: { isRequired: true }
						}),
						priceChildren: fields.number({
							label: 'Haurrak / Niños (€)',
							description: 'Haurrak',
							validation: { isRequired: true, min: 0 }
						}),
						priceYouth: fields.number({
							label: 'Gazteak / Jóvenes (€)',
							description: 'Gazteak',
							validation: { isRequired: true, min: 0 }
						}),
						priceAdults: fields.number({
							label: 'Nagusiak / Adultos (€)',
							description: 'Nagusiak',
							validation: { isRequired: true, min: 0 }
						}),
						priceSeniors: fields.number({
							label: 'Nagusiak >65 / Adultos >65 (€)',
							description: 'Nagusiak >65',
							validation: { isRequired: true, min: 0 }
						})
					}),
					{
						label: 'Prezioen taula / Tabla de precios',
						itemLabel: props =>
							props.fields.regionEu.value || 'Eskualdea / Región'
					}
				),
				extras: fields.array(
					fields.object({
						nameEu: fields.text({
							label: 'Gehigarriaren izena euskeraz',
							description: 'Adib: Espainia Mendi Federazioa',
							validation: { isRequired: true }
						}),
						nameEs: fields.text({
							label: 'Nombre del extra en español',
							description: 'Ej: Federación Española de Montaña',
							validation: { isRequired: true }
						}),
						descriptionEu: fields.text({
							label: 'Deskribapena euskeraz (aukerakoa)',
							description: 'Adib: FEDME txartela, refugiotarako',
							multiline: true
						}),
						descriptionEs: fields.text({
							label: 'Descripción en español (opcional)',
							description: 'Ej: Tarjeta FEDME, para refugios',
							multiline: true
						}),
						// Conditional pricing based on table type
						pricing: fields.conditional(
							fields.select({
								label: 'Prezio mota / Tipo de precio',
								options: [
									{
										label: 'Haurrak, Gazteak, Nagusiak',
										value: 'fourColumn'
									},
									{
										label: 'Guztiak / Todos',
										value: 'twoColumn'
									}
								],
								defaultValue: 'fourColumn'
							}),
							{
								fourColumn: fields.object({
									priceChildren: fields.number({
										label: 'Haurrak / Niños (€)',
										validation: { min: 0 }
									}),
									priceYouth: fields.number({
										label: 'Gazteak / Jóvenes (€)',
										validation: { min: 0 }
									}),
									priceAdults: fields.number({
										label: 'Nagusiak / Adultos (€)',
										validation: { min: 0 }
									})
								}),
								twoColumn: fields.object({
									priceAll: fields.number({
										label: 'Guztiak / Todos (€)',
										validation: { min: 0 }
									})
								})
							}
						)
					}),
					{
						label: 'Gehigarriak / Extras',
						itemLabel: props => props.fields.nameEu.value
					}
				)
			}
		})
	}
});
