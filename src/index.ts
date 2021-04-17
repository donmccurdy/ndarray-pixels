import getPixelsInternal from 'get-pixels';
import ndarray from 'ndarray';
import savePixelsInternal from 'save-pixels';

/**
 * Decodes an image (image/png or image/jpeg in Node.js, any with browser support on Web) to an
 * ndarray.
 *
 * MIME type is optional when given a path or URL, and required when given a Uint8Array. On
 * Node.js, it may be necessary to convert the Uint8Array to a Buffer, with Buffer.from(array).
 *
 * @param data
 * @param mimeType
 * @returns
 */
async function getPixels (data: string | Uint8Array, mimeType?: string): Promise<ndarray> {
    return new Promise((resolve, reject) => {
        getPixelsInternal(data, mimeType, (err?: Error, pixels?: ndarray) => {
            if (pixels && !err) {
                resolve(pixels);
            } else {
                reject(err);
            }
        });
    });
}

/**
 * Encodes an image (image/png or image/jpeg in Node.js, any with browser support on Web), given an ndarray.
 *
 * If the source ndarray was constructed with default stride, you may need .transpose(1, 0) to get the result
 * you expect, i.e. an identical result from getPixels().
 *
 * @param pixels ndarray of shape W x H x 4.
 * @param mimeType
 * @returns
 */
async function savePixels (pixels: ndarray, mimeType: string): Promise<Uint8Array> {
    return new Promise((resolve, reject) => {
        const chunks: Uint8Array[] = [];
        savePixelsInternal(pixels, mimeType.replace('image/', ''))
            .on('data', (d: Uint8Array) => chunks.push(d))
            .on('end', () => resolve(concat(chunks)))
            .on('error', (e: Error) => reject(e));
    });
}

function concat (arrays: Uint8Array[]): Uint8Array {
    let totalByteLength = 0;
    for (const buffer of arrays) {
        totalByteLength += buffer.byteLength;
    }

    const result = new Uint8Array(totalByteLength);

    let byteOffset = 0;
    for (const array of arrays) {
        result.set(array, byteOffset);
        byteOffset += array.byteLength;
    }

    return result;
}

export {getPixels, savePixels};
