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
	// Create HTMLCanvasElement and write pixel data.
	const canvas = document.createElement('canvas');
	canvas.width = pixels.shape[0];
	canvas.height = pixels.shape[1];

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

/** Creates readable stream from given HTMLCanvasElement and options. */
function streamCanvas(
	canvas: HTMLCanvasElement,
	mimeType: string,
	quality?: number
): Promise<Uint8Array> {
	return new Promise<Uint8Array>((resolve, reject) => {
		canvas.toBlob(
			async (blob) => {
				if (blob) {
					resolve(new Uint8Array(await blob.arrayBuffer()));
				} else {
					reject(new Error('[ndarray-pixels] Failed to canvas.toBlob().'));
				}
			},
			mimeType,
			quality
		);
	});
}
