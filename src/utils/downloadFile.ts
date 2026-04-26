/**
 * Trigger a file download by creating a temporary anchor element.
 * @param url - The file URL to download.
 * @param filename - The suggested filename for the downloaded file.
 */
export function downloadFile(url: string, filename: string): void {
	const link = document.createElement('a');
	link.href = url;
	link.download = filename;
	document.body.appendChild(link);
	link.click();
	document.body.removeChild(link);
}
