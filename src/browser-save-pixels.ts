import type { NdArray } from 'ndarray';
import { putPixelData } from './common';
import type { ImageEncodeOptions } from './common';

export async function savePixelsInternal(
	pixels: NdArray<Uint8Array | Uint8ClampedArray>,
	options: ImageEncodeOptions,
): Promise<Uint8Array> {
	// Create OffscreenCanvas and write pixel data.
	const canvas = new OffscreenCanvas(pixels.shape[0], pixels.shape[1]);

	const context = canvas.getContext('2d')!;
	const imageData = context.getImageData(0, 0, canvas.width, canvas.height);

	putPixelData(pixels, imageData.data);
	context.putImageData(imageData, 0, 0);

	return streamCanvas(canvas, options);
}

/** Creates readable stream from given OffscreenCanvas and options. */
async function streamCanvas(
	canvas: OffscreenCanvas,
	options: ImageEncodeOptions,
): Promise<Uint8Array> {
	const blob = await canvas.convertToBlob(options);
	const ab = await blob.arrayBuffer();
	return new Uint8Array(ab);
}
