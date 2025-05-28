import type { NdArray } from 'ndarray';
import { getPixelsInternal } from './node-get-pixels';
import { savePixelsInternal } from './node-save-pixels';

/**
 * Decodes image data to an `ndarray`.
 *
 * MIME type is optional when given a path or URL, and required when given a Uint8Array.
 *
 * Accepts `image/png` or `image/jpeg` in Node.js, and additional formats on browsers with
 * the necessary support in Canvas 2D.
 *
 * @param data
 * @param mimeType `image/jpeg`, `image/png`, etc.
 * @returns
 */
async function getPixels(data: Uint8Array, mimeType: string): Promise<NdArray<Uint8Array>> {
	return getPixelsInternal(data, mimeType);
}

/**
 * Encodes an `ndarray` as image data in the given format.
 *
 * If the source `ndarray` was constructed manually with default stride, use
 * `ndarray.transpose(1, 0)` to reshape it and ensure an identical result from getPixels(). For an
 * ndarray created by getPixels(), this isn't necessary.
 *
 * Accepts `image/png` or `image/jpeg` in Node.js, and additional formats on browsers with
 * the necessary support in Canvas 2D.
 *
 * @param pixels ndarray of shape W x H x 4.
 * @param typeOrOptions object with encoding options or just the type
 * @param typeOrOptions.type target format (`image/jpeg`, `image/png`, `image/webp`, etc.)
 * @param typeOrOptions.quality quality as a number from 0 to 1, inclusive
 * @returns
 */
async function savePixels(
	pixels: NdArray<Uint8Array | Uint8ClampedArray>,
	typeOrOptions: string | { type?: string; quality?: number },
): Promise<Uint8Array> {
	let options: { type?: string; quality?: number };
	if (typeof typeOrOptions === 'string') {
		options = {
			type: typeOrOptions,
			quality: undefined,
		};
	} else {
		options = {
			type: typeOrOptions.type,
			quality: typeOrOptions.quality,
		};
	}
	return savePixelsInternal(pixels, options);
}

export { getPixels, savePixels };
