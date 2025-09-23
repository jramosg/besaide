export function getStoredTheme(): string | null {
	try {
		const localStorageTheme = localStorage.getItem('theme');
		if (localStorageTheme) return localStorageTheme;
		return window.matchMedia('(prefers-color-scheme: dark)').matches
			? 'dark'
			: null;
	} catch (e) {
		return null;
	}
}

export function setTheme(theme: string | null = null): void {
	try {
		if (theme) {
			localStorage.setItem('theme', theme);
		}
		const doc = document.firstElementChild as HTMLElement | null;
		theme = theme ?? getStoredTheme();
		if (doc && theme) {
			doc.setAttribute('data-theme', theme);
		}
	} catch (e) {
		// Ignore when running in non-browser contexts
	}
}
