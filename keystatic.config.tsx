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
			label: 'Berriak / Noticias',
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
		})
	},
	singletons: {
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
							props.fields.positionEu.value || 'Kidea / Miembro'
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
		})
	}
});
