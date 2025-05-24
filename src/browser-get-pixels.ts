import ndarray from 'ndarray';
import type { NdArray } from 'ndarray';

function decodeImage(blob: Blob): Promise<HTMLImageElement | ImageBitmap> {
	// Decode image with createImageBitmap API.
	if (typeof createImageBitmap === 'function') {
		return createImageBitmap(blob, {
			premultiplyAlpha: 'none',
		});
	}
	if (typeof Image !== 'function') {
		throw new Error('[ndarray-pixels] Can not decode image.');
	}
	const path = URL.createObjectURL(blob);
	
	// Decode image with Image constructor API.
	return new Promise((resolve, reject) => {
		const img = new Image();
		img.crossOrigin = 'anonymous';
		img.onload = function () {
			URL.revokeObjectURL(path as string);

			resolve(img);
		};
		img.onerror = (err) => {
			URL.revokeObjectURL(path as string);
			reject(err);
		};
		img.src = path;
	});
}

export function getPixelsInternal(
	buffer: Uint8Array,
	mimeType: string
): Promise<NdArray<Uint8Array>> {
	// Warn for Data URIs, URLs, and file paths. Support removed in v3.
	if (!(buffer instanceof Uint8Array)) {
		throw new Error('[ndarray-pixels] Input must be Uint8Array or Buffer.');
	}

	const blob = new Blob([buffer], { type: mimeType });
	return decodeImage(blob).then(img => {
		const canvas = new OffscreenCanvas(img.width, img.height);
		const context = canvas.getContext('2d')!;
		context.drawImage(img, 0, 0);
		const pixels = context.getImageData(0, 0, img.width, img.height);
		return ndarray(
			new Uint8Array(pixels.data),
			[img.width, img.height, 4],
			[4, 4 * img.width, 1],
			0
		);
	});
}
