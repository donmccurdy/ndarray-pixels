import ndarray, { NdArray } from 'ndarray';
import sharp from 'sharp';

export async function getPixelsInternal(
	buffer: Uint8Array,
	_mimeType: string
): Promise<NdArray<Uint8Array>> {
	// Warn for Data URIs, URLs, and file paths. Support removed in v3.
	if (!(buffer instanceof Uint8Array)) {
		throw new Error('[ndarray-pixels] Input must be Uint8Array or Buffer.');
	}

	const { data, info } = await sharp(buffer)
		.ensureAlpha()
		.raw()
		.toBuffer({ resolveWithObject: true });

	return ndarray(
		new Uint8Array(data),
		[info.width, info.height, 4],
		[4, (4 * info.width) | 0, 1],
		0
	);
}
