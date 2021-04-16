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

        const data = await new Promise((resolve, reject) => {
            const chunks = [];
            savePixels(pixelsIn, 'png')
                .on('data', (d) => chunks.push(d))
                .on('end', () => resolve(Buffer.concat(chunks)))
                .on('error', (e) => reject(e));
        });

        const pixelsOut = await new Promise((resolve, reject) => {
            getPixels(data, 'image/png', (err, pixels) => {
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
};
