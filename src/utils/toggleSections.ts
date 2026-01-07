export function toggleSections(formSectionId: string) {
	const formSection = document.getElementById(formSectionId);
	const successSectionId = formSectionId + '-success-section';
	const successSection = document.getElementById(successSectionId);

	if (!formSection || !successSection) return;

	const isFormVisible = formSection.style.display !== 'none';

	// Add transition styles if not present
	if (!formSection.style.transition) {
		formSection.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
		successSection.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
	}

	if (isFormVisible) {
		// Hide form, show success with animation
		formSection.style.pointerEvents = 'none';
		formSection.style.opacity = '0';
		formSection.style.transform = 'translateY(-20px)';
		setTimeout(() => {
			formSection.style.display = 'none';
			successSection.style.display = 'block';
			successSection.style.opacity = '0';
			successSection.style.transform = 'translateY(20px)';
			requestAnimationFrame(() => {
				successSection.style.opacity = '1';
				successSection.style.transform = 'translateY(0)';
				// Scroll to success section
				setTimeout(
					() =>
						successSection.scrollIntoView({
							behavior: 'smooth',
							block: 'start'
						}),
					100
				);
			});
		}, 500);
	} else {
		// Hide success, show form with animation
		successSection.style.opacity = '0';
		successSection.style.transform = 'translateY(-20px)';
		setTimeout(() => {
			successSection.style.display = 'none';
			formSection.style.display = 'block';
			formSection.style.opacity = '0';
			formSection.style.transform = 'translateY(20px)';
			formSection.style.pointerEvents = 'auto';
			requestAnimationFrame(() => {
				setTimeout(
					() =>
						formSection.scrollIntoView({
							behavior: 'smooth',
							block: 'start'
						}),
					100
				);

				formSection.style.opacity = '1';
				formSection.style.transform = 'translateY(0)';
				// Scroll to form section
			});
		}, 500);
	}
}
