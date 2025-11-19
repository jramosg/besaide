import { fields, singleton } from '@keystatic/core';

export const homepage = singleton({
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
});
