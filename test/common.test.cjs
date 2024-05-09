/* eslint-disable @typescript-eslint/no-var-requires */

require('source-map-support').install();

const test = require('tape');
const ndarray = require('ndarray');

module.exports = function (platform, getPixels, savePixels) {
	test(`ndarray-pixels | ${platform}`, async (t) => {
		let pixelsIn = ndarray(
			new Uint8Array([255, 0, 0, 255, 0, 0, 0, 255, 255, 0, 0, 255, 0, 0, 0, 255]),
			[2, 2, 4],
			[4, 2 * 4, 1] // https://github.com/scijs/get-pixels/issues/52
		);

		const data = await savePixels(pixelsIn, 'image/png');
		const pixelsOut = await getPixels(Buffer.from(data), 'image/png');

		t.deepEqual(pixelsIn.shape, pixelsOut.shape, 'ndarray.shape');
		t.deepEqual(Array.from(pixelsOut.data), Array.from(pixelsIn.data), 'ndarray.data');
		t.end();
	});

	test(`ndarray-pixels (webp lossless) | ${platform}, async ()`, async (t) => {
		const width = 7;
		const height = 13;
		let pixelsIn = ndarray(new Uint8Array(width * height * 4), [width, height, 4]).transpose(
			1,
			0
		);
		for (let i = 0; i < pixelsIn.shape[0]; ++i) {
			for (let j = 0; j < pixelsIn.shape[1]; ++j) {
				pixelsIn.set(i, j, 0, 255 * (i / pixelsIn.shape[0]));
				pixelsIn.set(i, j, 1, 255 * (j / pixelsIn.shape[1]));
				pixelsIn.set(i, j, 3, 255);
			}
		}

		const data = await savePixels(pixelsIn, { type: 'image/webp', quality: 1 });
		const pixelsOut = await getPixels(Buffer.from(data), 'image/webp');

		t.deepEqual(pixelsIn.shape, pixelsOut.shape, 'ndarray.shape');
		t.deepEqual(Array.from(pixelsOut.data), Array.from(pixelsIn.data), 'ndarray.data');
		t.end();
	});

	test(`ndarray-pixels (webp lossy) | ${platform}, async ()`, async (t) => {
		const width = 7;
		const height = 13;
		let pixelsIn = ndarray(new Uint8Array(width * height * 4), [width, height, 4]).transpose(
			1,
			0
		);
		for (let i = 0; i < pixelsIn.shape[0]; ++i) {
			for (let j = 0; j < pixelsIn.shape[1]; ++j) {
				pixelsIn.set(i, j, 0, 255 * (i / pixelsIn.shape[0]));
				pixelsIn.set(i, j, 1, 255 * (j / pixelsIn.shape[1]));
				pixelsIn.set(i, j, 3, 255);
			}
		}

		const data = await savePixels(pixelsIn, { type: 'image/webp', quality: 0.9 });
		const pixelsOut = await getPixels(Buffer.from(data), 'image/webp');

		t.deepEqual(pixelsIn.shape, pixelsOut.shape, 'ndarray.shape');
		t.equal(pixelsOut.data.length, pixelsIn.data.length);
		let distance = 0;
		for (let i = 0; i < pixelsOut.data.length; ++i) {
			distance += Math.abs(pixelsOut.data[i] - pixelsIn.data[i]) / 255;
		}
		distance /= width * height;

		t.assert(0 < distance); // lossy
		t.assert(distance < 0.05, `mean pixel distance = ${distance}`); // but not overly lossy
		t.end();
	});
};
