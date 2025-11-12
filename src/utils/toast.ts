/**
 * Toast Manager - Utility for creating and managing toast notifications
 * Based on shadcn/ui design but adapted for vanilla JS + CSS custom properties
 */

export interface ToastOptions {
	variant?: 'success' | 'error' | 'warning' | 'info';
	title?: string;
	description?: string;
	duration?: number;
	dismissible?: boolean;
	action?: {
		label: string;
		onClick: () => void;
	};
}

class ToastManager {
	private container: HTMLElement | null = null;
	private toasts: Map<string, HTMLElement> = new Map();
	private toastCounter = 0;

	constructor() {
		this.ensureContainer();
	}

	private ensureContainer(): void {
		// Always check if container exists in DOM, not just if we have a reference
		let existingContainer = document.getElementById('toast-container');

		if (existingContainer) {
			this.container = existingContainer;
		} else if (!this.container || !document.body.contains(this.container)) {
			// Create container if it doesn't exist or was removed from DOM
			this.container = document.createElement('div');
			this.container.id = 'toast-container';
			this.container.className = 'toast-container';
			this.container.setAttribute('aria-live', 'polite');
			this.container.setAttribute('aria-label', 'Notifications');
			document.body.appendChild(this.container);
		}
	}

	private createToastElement(options: ToastOptions): HTMLElement {
		const {
			variant = 'info',
			title,
			description,
			duration = 5000,
			dismissible = true,
			action
		} = options;

		const toast = document.createElement('div');
		toast.className = `toast toast--${variant}`;
		toast.setAttribute('role', 'alert');
		toast.setAttribute('aria-live', 'polite');
		toast.setAttribute('data-dismissible', dismissible.toString());
		toast.setAttribute('data-duration', duration.toString());

		// Create icon
		const iconContainer = document.createElement('div');
		iconContainer.className = 'toast__icon';
		iconContainer.innerHTML = this.getIconSVG(variant);

		// Create content
		const content = document.createElement('div');
		content.className = 'toast__content';

		if (title) {
			const titleEl = document.createElement('div');
			titleEl.className = 'toast__title';
			titleEl.textContent = title;
			content.appendChild(titleEl);
		}

		if (description) {
			const descEl = document.createElement('div');
			descEl.className = 'toast__description';
			descEl.textContent = description;
			content.appendChild(descEl);
		}

		// Create action button if provided
		if (action) {
			const actionBtn = document.createElement('button');
			actionBtn.className = 'toast__action';
			actionBtn.textContent = action.label;
			actionBtn.addEventListener('click', action.onClick);
			content.appendChild(actionBtn);
		}

		// Create close button
		let closeBtn: HTMLElement | null = null;
		if (dismissible) {
			closeBtn = document.createElement('button');
			closeBtn.className = 'toast__close';
			closeBtn.setAttribute('aria-label', 'Close toast');
			closeBtn.innerHTML = `
				<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
					<line x1="18" y1="6" x2="6" y2="18"/>
					<line x1="6" y1="6" x2="18" y2="18"/>
				</svg>
			`;
		}

		toast.appendChild(iconContainer);
		toast.appendChild(content);
		if (closeBtn) {
			toast.appendChild(closeBtn);
		}

		return toast;
	}

	private getIconSVG(variant: string): string {
		const icons = {
			success: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
				<path d="m9 12 2 2 4-4"/>
				<circle cx="12" cy="12" r="10"/>
			</svg>`,
			error: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
				<circle cx="12" cy="12" r="10"/>
				<line x1="15" y1="9" x2="9" y2="15"/>
				<line x1="9" y1="9" x2="15" y2="15"/>
			</svg>`,
			warning: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
				<path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/>
				<line x1="12" y1="9" x2="12" y2="13"/>
				<line x1="12" y1="17" x2="12.01" y2="17"/>
			</svg>`,
			info: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
				<circle cx="12" cy="12" r="10"/>
				<line x1="12" y1="8" x2="12" y2="12"/>
				<line x1="12" y1="16" x2="12.01" y2="16"/>
			</svg>`
		};
		return icons[variant as keyof typeof icons] || icons.info;
	}

	show(options: ToastOptions): string {
		this.ensureContainer();

		const id = `toast-${++this.toastCounter}`;
		const toast = this.createToastElement(options);
		toast.id = id;

		// Add event listeners
		const closeBtn = toast.querySelector('.toast__close');
		if (closeBtn) {
			closeBtn.addEventListener('click', () => this.dismiss(id));
		}

		// Add to container
		this.container!.appendChild(toast);
		this.toasts.set(id, toast);

		// Auto-dismiss if duration is set
		const duration = options.duration ?? 5000;
		if (duration > 0) {
			setTimeout(() => this.dismiss(id), duration);
		}

		return id;
	}

	dismiss(id: string): void {
		const toast = this.toasts.get(id);
		if (!toast) return;

		toast.setAttribute('data-state', 'exiting');

		const cleanup = () => {
			if (toast.parentNode) {
				toast.parentNode.removeChild(toast);
			}
			this.toasts.delete(id);
		};

		// Handle animation end
		const preferredMotion = !window.matchMedia(
			'(prefers-reduced-motion: reduce)'
		).matches;
		if (preferredMotion) {
			toast.addEventListener('animationend', cleanup, { once: true });
		} else {
			cleanup();
		}
	}

	dismissAll(): void {
		for (const id of this.toasts.keys()) {
			this.dismiss(id);
		}
	}

	// Convenience methods
	success(
		title: string,
		description?: string,
		options?: Partial<ToastOptions>
	): string {
		return this.show({ ...options, variant: 'success', title, description });
	}

	error(
		title: string,
		description?: string,
		options?: Partial<ToastOptions>
	): string {
		return this.show({ ...options, variant: 'error', title, description });
	}

	warning(
		title: string,
		description?: string,
		options?: Partial<ToastOptions>
	): string {
		return this.show({ ...options, variant: 'warning', title, description });
	}

	info(
		title: string,
		description?: string,
		options?: Partial<ToastOptions>
	): string {
		return this.show({ ...options, variant: 'info', title, description });
	}
}

// Create and export singleton instance
const toast = new ToastManager();
export { toast };
export default toast;
