// keystatic.config.ts
import { config, fields, collection } from '@keystatic/core';

export default config({
	storage: {
		kind: 'local'
	},
	collections: {
		events: collection({
			label: 'Gertaerak / Eventos',
			slugField: 'title',
			path: 'src/data/events/*',
			format: { contentField: 'content' },
			schema: {
				title: fields.slug({ name: { label: 'Izenburua / Título' } }),
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
					description: 'Gertaeraren data'
				}),
				time: fields.text({
					label: 'Ordua / Hora',
					description: 'Adib: 06:30'
				}),
				location: fields.text({
					label: 'Kokalekua / Ubicación',
					description: 'Herria edo kokalekua'
				}),
				mountain: fields.text({
					label: 'Mendia / Montaña',
					description: 'Mendi edo gailurraren izena'
				}),
				region: fields.select({
					label: 'Eskualdea / Región',
					options: [
						{ label: 'Pirineoak', value: 'pirineoak' },
						{ label: 'Euskal Herriko mendiak', value: 'euskal-mendiak' },
						{ label: 'Kantauriar mendiak', value: 'kantauriar-mendiak' },
						{ label: 'Sistema Zentrala', value: 'sistema-zentrala' },
						{ label: 'Besteak', value: 'besteak' }
					],
					defaultValue: 'euskal-mendiak'
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
				distance: fields.text({
					label: 'Distantzia / Distancia',
					description: 'Adib: 16 km'
				}),
				elevation: fields.text({
					label: 'Altuera / Altitud',
					description: 'Adib: 2507 m'
				}),
				duration: fields.text({
					label: 'Iraupena / Duración',
					description: 'Adib: 8-9 ordu'
				}),
				meetingPoint: fields.text({
					label: 'Bilketa puntua / Punto de encuentro',
					description: 'Non eta noiz bildu'
				}),
				image: fields.text({
					label: 'Irudia / Imagen',
					description: 'Irudiaren bidea, adib: @/assets/udalaitz.webp'
				}),
				imageAlt: fields.text({
					label: 'Irudiaren azalpena / Alt de imagen',
					description: 'Irudiaren deskribapen laburra'
				}),
				summary: fields.text({
					label: 'Laburpena / Resumen',
					description: 'Gertaeraren laburpen motza',
					multiline: true
				}),
				featured: fields.checkbox({
					label: 'Nabarmendu / Destacar',
					description: 'Gertaera hau nabarmendu nahi al duzu?',
					defaultValue: false
				}),
				content: fields.markdoc({ 
					label: 'Edukia / Contenido',
					description: 'Gertaeraren deskribapen osoa'
				})
			}
		})
	}
});
