import type { z, ZodObject, ZodRawShape } from 'astro:schema';

import type { UIKeys } from '@/i18n/ui';

/**
 * Attach blur/input/submit handlers to validate a form with a Zod object schema.
 */
export function setupSchemaFormValidation<T extends ZodRawShape>(
	formId: string,
	schema: ZodObject<T>,
	t: (key: UIKeys) => string,
	onSubmit?: (formData: FormData) => void
) {
	const form = document.getElementById(formId) as HTMLFormElement | null;
	if (!form) return;

	// Find submit button to disable immediately on submit
	const submitButton = form.querySelector('[type="submit"]') as HTMLButtonElement | null;

	// Map of fieldName -> HTMLElement utilities
	function findField(name: string): {
		input: HTMLElement | null;
		field: HTMLElement | null;
	} {
		const input = form?.querySelector(`[name="${name}"]`) as HTMLElement | null;
		const field = input?.closest('.form-field') as HTMLElement | null;
		return { input, field };
	}

	function showError(fieldName: string, message: string) {
		const { field } = findField(fieldName);
		if (!field) return;

		const inputEl = field.querySelector('input, textarea, select');
		const errorId = `${fieldName}-error`;

		// Remove existing if different
		const existing = field.querySelector('.form-error');
		if (existing && existing.textContent !== message) existing.remove();

		if (!existing || existing.textContent !== message) {
			const p = document.createElement('p');
			p.className = 'form-error';
			p.id = errorId;
			p.setAttribute('role', 'alert');
			p.textContent = message;
			p.style.opacity = '0';
			p.style.transform = 'translateY(-4px)';
			p.style.transition = 'opacity 0.3s ease, transform 0.3s ease';

			const checkboxWrapper = field.querySelector('.checkbox-wrapper');
			if (checkboxWrapper) checkboxWrapper.appendChild(p);
			else if (inputEl?.parentElement) inputEl.parentElement.appendChild(p);
			else field.appendChild(p);

			requestAnimationFrame(() => {
				p.style.opacity = '1';
				p.style.transform = 'translateY(0)';
			});

			inputEl?.classList.add('input-error');
			inputEl?.setAttribute('aria-describedby', errorId);
			inputEl?.setAttribute('aria-invalid', 'true');
		}
	}

	function hideError(fieldName: string) {
		const { field } = findField(fieldName);
		if (!field) return;
		const el = field.querySelector('.form-error') as HTMLElement | null;
		if (el) {
			el.style.opacity = '0';
			el.style.transform = 'translateY(-4px)';
			setTimeout(() => el.remove(), 300);
		}
		const inputEl = field.querySelector('input, textarea, select');
		inputEl?.classList.remove('input-error');
		inputEl?.removeAttribute('aria-describedby');
		inputEl?.removeAttribute('aria-invalid');
	}

	function getShape() {
		return (schema as any)._def.shape();
	}

	function coerceValue(
		input: HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
	): unknown {
		if (input.type === 'checkbox')
			return (input as HTMLInputElement).checked ? 'on' : undefined;
		return input.value;
	}

	// Field-level validate using each field's Zod type
	function validateField(fieldName: string): boolean {
		const { input } = findField(fieldName);
		if (!input) return true;

		const shape = getShape();
		const zodField: z.ZodType | undefined = shape[fieldName];
		if (!zodField) return true; // unknown field to schema

		const native = input as
			| HTMLInputElement
			| HTMLTextAreaElement
			| HTMLSelectElement;
		const value = coerceValue(native);

		const r = zodField.safeParse(value);
		if (!r.success) {
			const message = r.error.issues[0]?.message || 'required';
			showError(fieldName, t(message as UIKeys));
			return false;
		}
		hideError(fieldName);
		return true;
	}

	// Attach blur/input handlers for each schema field
	const shape = getShape();
	Object.keys(shape).forEach(fieldName => {
		const { input } = findField(fieldName);
		if (!input) return;
		const native = input as HTMLInputElement;

		native.addEventListener('blur', () => validateField(fieldName));
		native.addEventListener('input', () => {
			// validate on input only if previously errored
			const hadError = !!native
				.closest('.form-field')
				?.querySelector('.form-error');
			if (hadError) validateField(fieldName);
		});
	});

	function clearAllErrors() {
		form?.querySelectorAll('.form-error').forEach(el => el.remove());
		form
			?.querySelectorAll('.input-error')
			.forEach(el => el.classList.remove('input-error'));
	}

	let isSubmitting = false;

	form.addEventListener('submit', async e => {
		e.preventDefault();

		if (isSubmitting) return;
		isSubmitting = true;

		if (submitButton) {
			submitButton.disabled = true;
		}

		// Global validation with the whole schema to catch cross-field issues
		clearAllErrors();

		const dataObj: Record<string, unknown> = {};
		const fd = new FormData(form);
		for (const [key, v] of fd.entries()) {
			if (typeof v === 'string') dataObj[key] = v;
		}

		// Add checkboxes from DOM (because unchecked checkboxes are not in FormData)
		Object.keys(shape).forEach(fieldName => {
			const el = form.querySelector(
				`[name="${fieldName}"]`
			) as HTMLInputElement | null;
			if (el && el.type === 'checkbox')
				dataObj[fieldName] = el.checked ? 'on' : undefined;
		});

		// Validate with schema
		const result = (schema as any).safeParse(dataObj) as {
			success: boolean;
			error?: any;
		};
		let isValid = result.success;

		if (!result.success) {
			// Show per-field messages
			const issues = result.error.issues as Array<{
				path: (string | number)[];
				message: string;
			}>;
			issues.forEach(issue => {
				const field = String(issue.path[0] ?? '');
				if (field)
					showError(field, t(issue.message as UIKeys) || issue.message);
			});
		}

		if (isValid) {
			if (onSubmit) {
				onSubmit(fd);
								isSubmitting = false;

			} else {
				form.submit();
				isSubmitting = false;
			}
		} else {
			isSubmitting = false;
			if (submitButton) {
				submitButton.disabled = false;
			}
			const firstError = form.querySelector('.form-error');
			firstError?.scrollIntoView({ behavior: 'smooth', block: 'center' });
		}
	});
}
