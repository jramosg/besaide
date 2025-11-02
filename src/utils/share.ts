import { toast } from './toast';

export interface ShareData {
	title: string;
	text?: string;
	url: string;
}

/**
 * Copies text to clipboard
 */
async function copyToClipboard(text: string): Promise<void> {
	if (!navigator.clipboard) {
		throw new Error('Clipboard API not available');
	}

	const clipboardItem = new ClipboardItem({
		'text/plain': new Blob([text], { type: 'text/plain' })
	});
	await navigator.clipboard.write([clipboardItem]);
}

/**
 * Shares content using the Web Share API or falls back to copying to clipboard
 */
export async function shareContent(shareData: ShareData): Promise<void> {
	try {
		// Try to use Web Share API if available and supported
		if (navigator.canShare && navigator.canShare(shareData)) {
			await navigator.share(shareData);
			console.log('Successful share');
		} else {
			// Fallback to copying URL to clipboard
			await copyToClipboard(shareData.url);
			toast.success('Linka kopiatu da!');
		}
	} catch (error) {
		// If share was cancelled or failed, try clipboard as fallback
		if (error instanceof Error && error.name === 'AbortError') {
			// User cancelled the share dialog, don't show error
			return;
		}

		try {
			await copyToClipboard(shareData.url);
			toast.success('Linka kopiatu da!');
		} catch (clipboardError) {
			console.error('Share error:', error);
			console.error('Clipboard error:', clipboardError);
			toast.error('Ezin da partekatu');
		}
	}
}
