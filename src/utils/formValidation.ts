export interface ValidationRule {
	type:
		| 'required'
		| 'email'
		| 'phone'
		| 'postalCode'
		| 'minLength'
		| 'maxLength'
		| 'pattern'
		| 'checkbox.required';
	message: string;
	value?: number | string | RegExp;
}

export interface FieldValidation {
	[fieldName: string]: ValidationRule[];
}

export function validateField(value: string, rules: ValidationRule[]): string {
	for (const rule of rules) {
		switch (rule.type) {
			case 'required':
				if (!value || value.trim().length === 0) {
					return rule.message;
				}
				break;
			case 'checkbox.required':
				if (value !== 'on' && value !== 'true') {
					return rule.message;
				}
				break;
			case 'email':
				if (value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
					return rule.message;
				}
				break;
			case 'phone':
				if (value && value.length > 0) {
					// Must have at least 9 digits and only contain valid phone characters
					const digitsOnly = value.replace(/[\s-()]/g, '');
					if (digitsOnly.length < 9 || !/^\+?[\d\s-()]+$/.test(value)) {
						return rule.message;
					}
				}
				break;
			case 'postalCode':
				if (value && !/^\d{5}$/.test(value)) {
					return rule.message;
				}
				break;
			case 'minLength':
				if (
					value &&
					typeof rule.value === 'number' &&
					value.length < rule.value
				) {
					return rule.message;
				}
				break;
			case 'maxLength':
				if (
					value &&
					typeof rule.value === 'number' &&
					value.length > rule.value
				) {
					return rule.message;
				}
				break;
			case 'pattern':
				if (value && rule.value instanceof RegExp && !rule.value.test(value)) {
					return rule.message;
				}
				break;
		}
	}
	console.log('No validation errors found');
	return '';
}

export function setupFormValidation(
	formId: string,
	validationRules: FieldValidation,
	onSubmit?: (formData: FormData) => void | Promise<void>
) {
	const form = document.getElementById(formId) as HTMLFormElement;
	if (!form) return;

	// Store validation state
	const errors: Record<string, string> = {};

	// Store blur state for all fields
	const blurredFields: Record<string, boolean> = {};

	// Helper to show error with animation
	function showError(fieldName: string, message: string) {
		const field = form.querySelector(`[name="${fieldName}"]`) as HTMLElement;
		if (!field) return;

		const formField = field.closest('.form-field');
		if (!formField) return;

		// Remove existing error if any with different message
		const existingError = formField.querySelector('.form-error');
		if (existingError && existingError.textContent !== message) {
			existingError.remove();
		}

		// Create new error if none exists or message changed
		if (!existingError || existingError.textContent !== message) {
			const errorEl = document.createElement('p');
			errorEl.className = 'form-error';
			errorEl.setAttribute('role', 'alert');
			errorEl.textContent = message;
			errorEl.style.opacity = '0';
			errorEl.style.transform = 'translateY(-4px)';
			errorEl.style.transition = 'opacity 0.3s ease, transform 0.3s ease';

			// Add to DOM
			const input = formField.querySelector('input, textarea, select');
			const checkboxWrapper = formField.querySelector('.checkbox-wrapper');
			if (checkboxWrapper) {
				// For checkboxes, append to checkbox-wrapper for proper grid positioning
				checkboxWrapper.appendChild(errorEl);
			} else if (input) {
				input.parentElement?.appendChild(errorEl);
			} else {
				formField.appendChild(errorEl);
			}

			// Trigger animation
			requestAnimationFrame(() => {
				errorEl.style.opacity = '1';
				errorEl.style.transform = 'translateY(0)';
			});
			const inputEl = formField.querySelector('input, textarea, select');
			inputEl?.classList.add('input-error');
		}
	}

	// Helper to hide error with animation
	function hideError(fieldName: string) {
		const field = form.querySelector(`[name="${fieldName}"]`) as HTMLElement;
		if (!field) return;

		const formField = field.closest('.form-field');

		if (!formField) return;

		const errorEl = formField.querySelector('.form-error') as HTMLElement;
		if (errorEl) {
			errorEl.style.opacity = '0';
			errorEl.style.transform = 'translateY(-4px)';
			setTimeout(() => errorEl.remove(), 300);
		}

		// Remove error styling from input
		const inputEl = formField.querySelector('input, textarea, select');
		inputEl?.classList.remove('input-error');
	}

	// Validate single field
	function validateSingleField(fieldName: string, value: string): boolean {
		const rules = validationRules[fieldName];
		if (!rules) return true;

		const errorMessage = validateField(value, rules);
		if (errorMessage) {
			errors[fieldName] = errorMessage;
			showError(fieldName, errorMessage);
			return false;
		} else {
			delete errors[fieldName];
			hideError(fieldName);
			return true;
		}
	}

	// Add blur event listeners to all fields with validation rules
	Object.keys(validationRules).forEach(fieldName => {
		const field = form.querySelector(
			`[name="${fieldName}"]`
		) as HTMLInputElement;
		if (!field) return;

		blurredFields[fieldName] = false;

		field.addEventListener('blur', (e: FocusEvent) => {
			blurredFields[fieldName] = true;
			const isCheckbox = field.type === 'checkbox';
			const value = isCheckbox
				? (e.target as HTMLInputElement).checked
					? 'on'
					: 'off'
				: field.value;
			console.log('Blur event on', fieldName, value);

			validateSingleField(fieldName, value);
		});

		field.addEventListener('input', (e: Event) => {
			if (blurredFields[fieldName]) {
				const target = e.target as HTMLInputElement;
				const isCheckbox = field.type === 'checkbox';
				// Only validate after userconst isCheckbox = field.type === 'checkbox';
				const value = isCheckbox
					? target.checked
						? 'on'
						: 'off'
					: target.value;
				validateSingleField(fieldName, value);
			}
		});
	});

	// Handle form submission
	form.addEventListener('submit', async e => {
		e.preventDefault();

		// Ensure all fields are considered "blurred" for validation
		Object.keys(validationRules).forEach(fieldName => {
			blurredFields[fieldName] = true;
		});

		// Validate all fields
		let isValid = true;
		Object.keys(validationRules).forEach(fieldName => {
			const field = form.querySelector(
				`[name="${fieldName}"]`
			) as HTMLInputElement;
			if (field) {
				const isCheckbox = field.type === 'checkbox';
				const value = isCheckbox
					? (field as HTMLInputElement).checked
						? 'on'
						: 'off'
					: field.value;
				const fieldValid = validateSingleField(fieldName, value);
				if (!fieldValid) {
					isValid = false;
				}
			}
		});

		// If all valid, submit
		if (isValid) {
			const formData = new FormData(form);
			if (onSubmit) {
				await onSubmit(formData);
			} else {
				form.submit();
			}
		} else {
			// Scroll to first error
			const firstError = form.querySelector('.form-error');
			if (firstError) {
				firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
			}
		}
	});
}
