import { fields, singleton } from '@keystatic/core';

export const homepage = singleton({
	label: 'Hasierako Orria / Página de Inicio',
	path: 'src/data/homepage/homepage',
	schema: {
		slides: fields.array(
			fields.object({
				titleEu: fields.text({
					label: 'Izenburua euskeraz',
					description: 'Bannerrean agertuko den izenburua',
					validation: { isRequired: true }
				}),
				titleEs: fields.text({
					label: 'Título en español',
					description: 'Título que aparecerá en el banner',
					validation: { isRequired: true }
				}),
				descriptionEu: fields.text({
					label: 'Deskribapena euskeraz',
					description: 'Bannerrean agertuko den testua',
					multiline: true
				}),
				descriptionEs: fields.text({
					label: 'Descripción en español',
					description: 'Texto que aparecerá en el banner',
					multiline: true
				}),
				buttonLabelEu: fields.text({
					label: 'Botoiaren testua euskeraz',
					description: 'Adibidez: Izen eman, Informazio gehiago...'
				}),
				buttonLabelEs: fields.text({
					label: 'Texto del botón en español',
					description: 'Por ejemplo: Inscribirse, Más información...'
				}),
				buttonLinkEu: fields.text({
					label: 'Botoiaren esteka euskeraz',
					description: 'Adibidez: /agenda edo kanpoko URL bat'
				}),
				buttonLinkEs: fields.text({
					label: 'Enlace del botón en español',
					description: 'Por ejemplo: /agenda-es o una URL externa'
				})
			}),
			{
				label: 'Hero bannerrak / Banners del hero',
				itemLabel: props =>
					props.fields.titleEu.value || 'Banner berria / Nuevo banner'
			}
		)
	}
});
