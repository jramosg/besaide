// keystatic.config.ts
import { CompanyName } from '@/config/company';
import { config, fields, collection, singleton } from '@keystatic/core';

export default config({
	ui: {
		brand: {
			name: CompanyName,
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
		news: collection({
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
					publicPath: '@/assets/images/news',
					validation: { isRequired: true }
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
					description: 'Albiste osoaren edukia'
				}),
				contentEs: fields.markdoc({
					label: 'Edukia gaztelaniaz',
					description: 'Contenido completo de la noticia'
				})
			}
		}),
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
							}),
							distance: fields.text({
								label: 'Distantzia / Distancia',
								description: 'Adib: 16 km',
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
					publicPath: '@/assets/images/events',
					validation: { isRequired: true }
				}),
				summary: fields.text({
					label: 'Laburpena / Resumen',
					description: 'Laburpen labur bat / Un resumen breve',
					validation: { isRequired: true, length: { max: 200 } },
					multiline: true
				}),
				content: fields.markdoc({
					label: 'Edukia / Contenido',
					description: 'Gertaeraren deskribapen osoa'
				})
			}
		}),
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
		homepage: singleton({
			label: 'Hasierako Orria / Página de Inicio',
			path: 'src/data/homepage/homepage',
			schema: {
				membershipTitleEu: fields.text({
					label: 'Hasierako orriaren izenburua euskeraz',
					description: 'Hasierako orrian agertuko den izenburua',
					validation: { isRequired: true }
				}),
				membershipTitleEs: fields.text({
					label: 'Título de la página de inicio',
					description: 'Título que aparecerá en la página de inicio',
					validation: { isRequired: true }
				}),
				membershipDescriptionEu: fields.text({
					label: 'Hasierako orriaren deskribapena euskeraz',
					description: 'Hasierako orrian agertuko den deskribapena',
					multiline: true
				}),
				membershipDescriptionEs: fields.text({
					label: 'Descripción de la página de inicio',
					description: 'Descripción que aparecerá en la página de inicio',
					multiline: true
				})
			}
		}),
		besaideHistory: singleton({
			label: 'Historia / Besaide Historia',
			path: 'src/data/besaide/historia',
			schema: {
				contentEu: fields.markdoc({
					label: 'Historia euskeraz',
					description: 'Besaide Mendizale Elkartearen historia euskeraz'
				}),
				contentEs: fields.markdoc({
					label: 'Historia en español',
					description: 'Historia de la Asociación de Montañismo Besaide'
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
		libraryMaps: singleton({
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
		}),
		membership: singleton({
			label: 'Bazkidetza / Membresía',
			path: 'src/data/membership/membership',
			schema: {
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
						price: fields.number({
							label: 'Prezioa (€) / Precio (€)',
							validation: { isRequired: true, min: 0 }
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
							props.fields.labelEu.value +
								': ' +
								props.fields.price.value +
								'€' || 'Prezioa / Precio'
					}
				)
			}
		}),
		federation: singleton({
			label: 'Federatzea / Federación',
			path: 'src/data/federation/federation',
			schema: {
				contentEu: fields.markdoc({
					label: 'Edukia euskeraz',
					description: 'Federazioari buruzko informazioa euskeraz'
				}),
				contentEs: fields.markdoc({
					label: 'Contenido en español',
					description: 'Información sobre la federación en español'
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
