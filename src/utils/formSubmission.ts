/**
 * Form submission utilities with loading state management
 */

import type { UIKeys } from '@/i18n/ui';

export interface FormSubmissionResult<T = unknown> {
	data?: T;
	error?: string;
}

export interface FormSubmissionOptions<T = unknown, D = FormData> {
	/** The button element to show loading state on */
	button: HTMLButtonElement;
	/** The submit function to call */
	action: (input: D) => Promise<FormSubmissionResult<T>>;
	/** The data to submit */
	data: D;
	/** Callback for successful submission */
	onSuccess?: (data?: T) => void;
	/** Callback for error handling */
	onError?: (error: string) => void;
	/** Translation function */
	t: (key: UIKeys) => string;
}

/**
 * Submits a form with loading state management
 *
 * Handles button loading state, calls the action, and manages success/error callbacks.
 * Automatically resets the button state in a finally block.
 */
export async function submitFormWithLoadingState<T = unknown, D = FormData>({
	button,
	action,
	data,
	onSuccess,
	onError,
	t
}: FormSubmissionOptions<T, D>): Promise<void> {
	const originalHTML = button.innerHTML;

	try {
		// Set loading state
		button.disabled = true;
		button.classList.add('btn-loading');
		button.innerHTML = `
			<span class="spinner"></span>
			<span class="loading-text">${t('loading')}</span>
		`;

		// Execute the action
		const result = await action(data);

		if (result.data) {
			onSuccess?.(result.data);
			return;
		}

		if (result.error) {
			onError?.(result.error);
			return;
		}

		onError?.('An error occurred');
	} finally {
		// Always reset loading state
		button.disabled = false;
		button.classList.remove('btn-loading');
		button.innerHTML = originalHTML;
	}
}

export async function submitJsonForm<T = unknown>(
	url: string,
	data: FormData
): Promise<FormSubmissionResult<T>> {
	try {
		const payload = Object.fromEntries(data.entries());
		const response = await fetch(url, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				Accept: 'application/json'
			},
			body: JSON.stringify(payload)
		});

		const result = (await response.json().catch(() => null)) as
			| {
					success?: boolean;
					data?: T;
					error?: string;
					message?: string;
			  }
			| null;

		if (!response.ok || !result?.success) {
			return {
				error: result?.error || result?.message || 'An error occurred'
			};
		}

		return {
			data: result.data
		};
	} catch {
		return {
			error: 'An error occurred'
		};
	}
}
