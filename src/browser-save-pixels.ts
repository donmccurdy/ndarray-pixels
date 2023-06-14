import ndarray from 'ndarray';
import type { NdArray } from 'ndarray';
import ops from 'ndarray-ops';

export interface EncoderOptions {
	quality?: number;
}

export async function savePixelsInternal(array: NdArray, mimeType: string): Promise<Uint8Array>;
export async function savePixelsInternal(
	array: NdArray,
	mimeType: string,
	options?: EncoderOptions
): Promise<Uint8Array>;
export async function savePixelsInternal(
	array: NdArray,
	mimeType: string,
	options: EncoderOptions = {}
): Promise<Uint8Array> {
	// Create HTMLCanvasElement and write pixel data.
	const canvas = document.createElement('canvas');
	canvas.width = array.shape[0];
	canvas.height = array.shape[1];

	const context = canvas.getContext('2d')!;
	const imageData = context.getImageData(0, 0, canvas.width, canvas.height);

	putPixelData(array, imageData.data);
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

function putPixelData(
	array: NdArray,
	data: Uint8Array | Uint8ClampedArray,
	frame = -1
): Uint8Array | Uint8ClampedArray {
	if (array.shape.length === 4) {
		return putPixelData(array.pick(frame), data, 0);
	} else if (array.shape.length === 3) {
		if (array.shape[2] === 3) {
			ops.assign(
				ndarray(data, [array.shape[0], array.shape[1], 3], [4, 4 * array.shape[0], 1]),
				array
			);
			ops.assigns(ndarray(data, [array.shape[0] * array.shape[1]], [4], 3), 255);
		} else if (array.shape[2] === 4) {
			ops.assign(
				ndarray(data, [array.shape[0], array.shape[1], 4], [4, array.shape[0] * 4, 1]),
				array
			);
		} else if (array.shape[2] === 1) {
			ops.assign(
				ndarray(data, [array.shape[0], array.shape[1], 3], [4, 4 * array.shape[0], 1]),
				ndarray(
					array.data,
					[array.shape[0], array.shape[1], 3],
					[array.stride[0], array.stride[1], 0],
					array.offset
				)
			);
			ops.assigns(ndarray(data, [array.shape[0] * array.shape[1]], [4], 3), 255);
		} else {
			throw new Error('[ndarray-pixels] Incompatible array shape.');
		}
	} else if (array.shape.length === 2) {
		ops.assign(
			ndarray(data, [array.shape[0], array.shape[1], 3], [4, 4 * array.shape[0], 1]),
			ndarray(
				array.data,
				[array.shape[0], array.shape[1], 3],
				[array.stride[0], array.stride[1], 0],
				array.offset
			)
		);
		ops.assigns(ndarray(data, [array.shape[0] * array.shape[1]], [4], 3), 255);
	} else {
		throw new Error('[ndarray-pixels] Incompatible array shape.');
	}
	return data;
}
