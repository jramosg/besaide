/**
 * Form submission utilities with loading state management
 */

import type { UIKeys } from '@/i18n/ui';
import type { SafeResult } from 'astro:actions';

export interface FormSubmissionOptions<T = any, D = FormData> {
	/** The button element to show loading state on */
	button: HTMLButtonElement;
	/** The action function to call - accepts Astro actions */
	action: (input: D) => Promise<SafeResult<any, T>>;
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
export async function submitFormWithLoadingState<T = any, D = FormData>({
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
		button.classList.add('loading');
		button.innerHTML = `
			<span class="spinner"></span>
			<span class="loading-text">${t('loading')}</span>
		`;

		// Execute the action
		const result: SafeResult<any, T> = await action(data);

		// Handle success - SafeResult has data property
		if (result.data) {
			onSuccess?.(result.data);
		}

		// Handle error - SafeResult has error property (ActionError)
		if (result.error) {
			const errorMessage =
				typeof result.error === 'object' && 'message' in result.error
					? (result.error.message as string)
					: 'An error occurred';
			onError?.(errorMessage);
		}
	} finally {
		// Always reset loading state
		button.disabled = false;
		button.classList.remove('loading');
		button.innerHTML = originalHTML;
	}
}
