import ndarray from 'ndarray';
import ops from 'ndarray-ops';
import through from 'through';

export interface SavePixelsOptions {quality?: number};

export function savePixels(array: ndarray, type: 'canvas'): HTMLCanvasElement;
export function savePixels(array: ndarray, type: 'png'): through.ThroughStream;
export function savePixels(array: ndarray, type: 'jpeg' | 'jpg', options?: SavePixelsOptions): through.ThroughStream;
export function savePixels(array: ndarray, type: 'canvas' | 'png' | 'jpeg' | 'jpg', options: SavePixelsOptions = {}): through.ThroughStream | HTMLCanvasElement {
	// Create HTMLCanvasElement and write pixel data.

	const canvas = document.createElement('canvas');
	canvas.width = array.shape[0];
	canvas.height = array.shape[1];

	const context = canvas.getContext('2d')!;
	const imageData = context.getImageData(0, 0, canvas.width, canvas.height);

	try {
		handleData(array, imageData.data);
	} catch (e) {
		return handleError(e);
	}

	context.putImageData(imageData, 0, 0);

	// Encode to target format.

	let stream: through.ThroughStream;

	switch (type) {
		case 'canvas':
			return canvas;

		case 'jpg':
		case 'jpeg':
			stream = through();
			canvas.toBlob(async (blob) => {
				if (blob) {
					stream.emit('data', new Uint8Array(await blob.arrayBuffer()));
				} else {
					stream.emit('error', new Error('[ndarray-pixels] Failed to canvas.toBlob().'));
				}
			}, 'image/jpeg', options.quality ? options.quality / 100 : undefined);
			return stream;

		case 'png':
			stream = through();
			canvas.toBlob(async (blob) => {
				if (blob) {
					stream.emit('data', new Uint8Array(await blob.arrayBuffer()));
				} else {
					stream.emit('error', new Error('[ndarray-pixels] Failed to canvas.toBlob().'));
				}
			}, 'image/jpeg', options.quality ? options.quality / 100 : undefined);
			return stream;

		default:
			return handleError(new Error('[ndarray-pixels] Unsupported file type: ' + type));
	}
}


function handleData(array: ndarray, data: Uint8Array | Uint8ClampedArray, frame = -1): Uint8Array | Uint8ClampedArray {
	if (array.shape.length === 4) {
		return handleData(array.pick(frame), data, 0);
	} else if (array.shape.length === 3) {
		if (array.shape[2] === 3) {
			ops.assign(
				ndarray(
					data,
					[array.shape[0], array.shape[1], 3],
					[4, 4 * array.shape[0], 1]
				),
				array
			);
			ops.assigns(
				ndarray(
					data,
					[array.shape[0] * array.shape[1]],
					[4],
					3
				),
				255
			);
		} else if (array.shape[2] === 4) {
			ops.assign(
				ndarray(
					data,
					[array.shape[0], array.shape[1], 4],
					[4, array.shape[0] * 4, 1]
				),
				array
			);
		} else if (array.shape[2] === 1) {
			ops.assign(
				ndarray(
					data,
					[array.shape[0], array.shape[1], 3],
					[4, 4 * array.shape[0], 1]
				),
				ndarray(
					array.data,
					[array.shape[0], array.shape[1], 3],
					[array.stride[0], array.stride[1], 0],
					array.offset
				)
			);
			ops.assigns(
				ndarray(
					data,
					[array.shape[0] * array.shape[1]],
					[4],
					3
				),
				255
			);
		} else {
			throw new Error('[ndarray-pixels] Incompatible array shape.');
		}
	} else if (array.shape.length === 2) {
		ops.assign(
			ndarray(data,
			[array.shape[0], array.shape[1], 3],
			[4, 4 * array.shape[0], 1]),
			ndarray(array.data,
			[array.shape[0], array.shape[1], 3],
			[array.stride[0], array.stride[1], 0],
			array.offset)
		);
		ops.assigns(
			ndarray(data,
			[array.shape[0] * array.shape[1]],
			[4],
			3),
			255
		);
	} else {
		throw new Error('[ndarray-pixels] Incompatible array shape.');
	}
	return data;
}

function handleError(error: Error) {
	const result = through();
	result.emit('error', error);
	return result;
}
