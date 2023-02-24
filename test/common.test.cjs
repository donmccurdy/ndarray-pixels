/* eslint-disable @typescript-eslint/no-var-requires */

require('source-map-support').install();

const test = require('tape');
const ndarray = require('ndarray');

module.exports = function (platform, getPixels, savePixels) {
    test(`ndarray-pixels | ${platform}`, async (t) => {
        let pixelsIn = ndarray(new Uint8Array([
            255, 0, 0, 255,
            0, 0, 0, 255,
            255, 0, 0, 255,
            0, 0, 0, 255,
        ]), [2, 2, 4])

        pixelsIn = pixelsIn.transpose(1, 0); // https://github.com/scijs/get-pixels/issues/52

        const data = await savePixels(pixelsIn, 'image/png');
        const pixelsOut = await getPixels(Buffer.from(data), 'image/png');

        t.deepEqual(pixelsIn.shape, pixelsOut.shape, 'ndarray.shape')
        t.deepEqual(Array.from(pixelsOut.data), Array.from(pixelsIn.data), 'ndarray.data');
        t.end();
    });
};
