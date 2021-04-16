import ndarray from 'ndarray';

export type GetPixelsCallback = (err: string | Event | null, pixels?: ndarray) => void;

const MimeType = {
	png: 'image/png',
	jpg: 'image/jpeg',
	jpeg: 'image/jpeg',
	webp: 'image/webp'
};

export function getPixels(path: string, callback: GetPixelsCallback): void;
export function getPixels(path: Uint8Array, type: 'png' | 'jpeg' | 'jpg' | 'webp', callback: GetPixelsCallback): void;
export function getPixels(
		path: string | Uint8Array,
		typeOrCallback: 'png' | 'jpeg' | 'jpg' | 'webp' | GetPixelsCallback,
		callback?: GetPixelsCallback
): void {

	// Callback.
	callback = callback || typeOrCallback as GetPixelsCallback;

	// Construct a Blob URL for Uint8Array inputs.
	if (path instanceof Uint8Array) {
		if (typeof typeOrCallback !== 'string') {
			throw new Error('[ndarray-pixels] Type must be given for Uint8Array image data');
		}
		const mimeType = typeOrCallback in MimeType
			? MimeType[typeOrCallback]
			: `image/${typeOrCallback}`;
		const blob = new Blob([path], {type: mimeType});
		path = URL.createObjectURL(blob);
	}

	// Decode image with Canvas API.
	const img = new Image();
	img.crossOrigin = 'anonymous';
	img.onload = function() {
		const canvas = document.createElement('canvas');
		canvas.width = img.width;
		canvas.height = img.height;
		const context = canvas.getContext('2d')!;
		context.drawImage(img, 0, 0);
		const pixels = context.getImageData(0, 0, img.width, img.height)
		callback!(null, ndarray(new Uint8Array(pixels.data), [img.width, img.height, 4], [4, 4*img.width, 1], 0));
	}
	img.onerror = (err) => callback!(err);
	img.src = path;
}
