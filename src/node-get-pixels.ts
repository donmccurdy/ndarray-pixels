import ndarray, { NdArray } from 'ndarray';
import { PNG } from 'pngjs';
import jpeg from 'jpeg-js';

interface Image {
	data: Uint8Array;
	width: number;
	height: number;
}

export default getPixels;

function getPixels(buffer: Uint8Array, mimeType: string): Promise<NdArray> {
	// Warn for Data URIs, URLs, and file paths. Support removed in v3.
	if (!(buffer instanceof Uint8Array)) {
		throw new Error('[ndarray-pixels] Input must be Uint8Array or Buffer.');
	}

	// Convert Uint8Array → Buffer.
	buffer = Buffer.from(buffer);

	switch (mimeType) {
		case 'image/png':
			return handlePNG(buffer);
		case 'image/jpg':
		case 'image/jpeg':
			return handleJPEG(buffer);
		default:
			throw new Error('[ndarray-pixels] Unsupported file type: ' + mimeType);
	}
}

function handlePNG(buffer: Uint8Array): Promise<NdArray> {
	return new Promise((resolve, reject) => {
		new PNG().parse(buffer as Buffer, (err: Error, image: Image) => {
			if (err) {
				reject(err);
				return;
			}
			resolve(
				ndarray(
					new Uint8Array(image.data),
					[image.width | 0, image.height | 0, 4],
					[4, (4 * image.width) | 0, 1],
					0
				)
			);
		});
	});
}

function handleJPEG(buffer: Uint8Array): Promise<NdArray> {
	return new Promise((resolve, reject) => {
		try {
			const image = jpeg.decode(buffer) as Image;
			if (image) {
				const pixels = ndarray(image.data, [image.height, image.width, 4]);
				resolve(pixels.transpose(1, 0));
			} else {
				reject(new Error('[ndarray-pixels] Error decoding jpeg.'));
			}
		} catch (e) {
			reject(e);
		}
	});
}
