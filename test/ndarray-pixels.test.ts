require('source-map-support').install();

import test from 'tape';
import ndarray from 'ndarray';
import { getPixels, savePixels } from '../';

test('ndarray-pixels', async (t) => {
	const pixelsIn = ndarray(new Uint8Array([
		255, 0, 0, 255,
		0, 0, 0, 255,
		255, 0, 0, 255,
		0, 0, 0, 255,
	]), [2, 2, 4]);

	const data: Uint8Array = await new Promise((resolve, reject) => {
		const chunks: Uint8Array[] = [];
		savePixels(pixelsIn, 'png')
			.on('data', (d: Uint8Array) => chunks.push(d))
			.on('end', () => resolve(Buffer.concat(chunks)))
			.on('error', (e: Error) => reject(e));
	});

	const pixelsOut: ndarray = await new Promise((resolve, reject) => {
		getPixels(data, 'image/png', (err: Error | null, pixels: ndarray) => {
			if (err) {
				reject(err);
			} else {
				resolve(pixels);
			}
		});
	});

	t.deepEqual(pixelsIn.shape, pixelsOut.shape, 'ndarray.shape')
	t.deepEqual(Array.from(pixelsOut.data), Array.from(pixelsIn.data), 'ndarray.data');
	t.end();
});
