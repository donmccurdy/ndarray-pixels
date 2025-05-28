import ndarray, { type NdArray } from 'ndarray';
import ops from 'ndarray-ops';

export interface ImageEncodeOptions {
	type?: string;
	quality?: number;
}

export function putPixelData(
	array: NdArray<Uint8Array | Uint8ClampedArray>,
	data: Uint8Array | Uint8ClampedArray,
	frame = -1,
): Uint8Array | Uint8ClampedArray {
	if (array.shape.length === 4) {
		return putPixelData(array.pick(frame), data, 0);
	}

	if (array.shape.length === 3) {
		if (array.shape[2] === 3) {
			ops.assign(
				ndarray(data, [array.shape[0], array.shape[1], 3], [4, 4 * array.shape[0], 1]),
				array,
			);
			ops.assigns(ndarray(data, [array.shape[0] * array.shape[1]], [4], 3), 255);
		} else if (array.shape[2] === 4) {
			ops.assign(
				ndarray(data, [array.shape[0], array.shape[1], 4], [4, array.shape[0] * 4, 1]),
				array,
			);
		} else if (array.shape[2] === 1) {
			ops.assign(
				ndarray(data, [array.shape[0], array.shape[1], 3], [4, 4 * array.shape[0], 1]),
				ndarray(
					array.data,
					[array.shape[0], array.shape[1], 3],
					[array.stride[0], array.stride[1], 0],
					array.offset,
				),
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
				array.offset,
			),
		);
		ops.assigns(ndarray(data, [array.shape[0] * array.shape[1]], [4], 3), 255);
	} else {
		throw new Error('[ndarray-pixels] Incompatible array shape.');
	}

	return data;
}
