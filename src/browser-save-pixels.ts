import type { NdArray } from 'ndarray';
import { putPixelData } from './common';

export interface EncoderOptions {
	quality?: number;
}

export async function savePixelsInternal(
	pixels: NdArray<Uint8Array | Uint8ClampedArray>,
	mimeType: string
): Promise<Uint8Array>;
export async function savePixelsInternal(
	pixels: NdArray<Uint8Array | Uint8ClampedArray>,
	mimeType: string,
	options?: EncoderOptions
): Promise<Uint8Array>;
export async function savePixelsInternal(
	pixels: NdArray<Uint8Array | Uint8ClampedArray>,
	mimeType: string,
	options: EncoderOptions = {}
): Promise<Uint8Array> {
	// Create OffscreenCanvas and write pixel data.
	const canvas = new OffscreenCanvas(pixels.shape[0], pixels.shape[1])

	const context = canvas.getContext('2d')!;
	const imageData = context.getImageData(0, 0, canvas.width, canvas.height);

	putPixelData(pixels, imageData.data);
	context.putImageData(imageData, 0, 0);

	const quality = options.quality ? options.quality / 100 : undefined;

	// Encode to target format.
	switch (mimeType) {
		case 'image/jpeg':
			return streamCanvas(canvas, 'image/jpeg', quality);
		default:
			return streamCanvas(canvas, mimeType);
	}
}

/** Creates readable stream from given OffscreenCanvas and options. */
async function streamCanvas(
	canvas: OffscreenCanvas,
	mimeType: string,
	quality?: number
): Promise<Uint8Array> {
	const blob = await canvas.convertToBlob({
			type: mimeType,
			quality
		})
	const ab = await blob.arrayBuffer()
	return new Uint8Array(ab)
}
