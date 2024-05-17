# ndarray-pixels

[![Latest NPM release](https://img.shields.io/npm/v/ndarray-pixels.svg)](https://www.npmjs.com/package/ndarray-pixels)
[![License](https://img.shields.io/badge/license-MIT-007ec6.svg)](https://github.com/donmccurdy/ndarray-pixels/blob/main/LICENSE)
[![npm bundle size](https://img.shields.io/bundlephobia/minzip/ndarray-pixels)](https://bundlephobia.com/package/ndarray-pixels)
[![CI](https://github.com/donmccurdy/ndarray-pixels/workflows/CI/badge.svg?branch=main&event=push)](https://github.com/donmccurdy/ndarray-pixels/actions?query=workflow%3ACI)

Convert [ndarray](https://www.npmjs.com/package/ndarray) ↔ image data, on Web and Node.js.

Designed to be used with [other ndarray-based packages](http://scijs.net/packages/).

## Supported Formats

| Platform | JPEG | PNG | Other                                                                                                 |
|----------|------|-----|-------------------------------------------------------------------------------------------------------|
| Node.js  | ✅    | ✅   | Based on [sharp support](https://sharp.pixelplumbing.com/)                                            |
| Web      | ✅    | ✅   | Based on [browser support](https://developer.mozilla.org/en-US/docs/Web/API/HTMLCanvasElement/toBlob) |

### Known Bugs

- [ ] Web implementation (Canvas 2D) premultiplies alpha.

## Quickstart

```
npm install --save ndarray-pixels
```

### Web

```javascript
import { getPixels, savePixels } from 'ndarray-pixels';

const bytesIn = await fetch('./input.png')
    .then((res) => res.arrayBuffer())
    .then((arrayBuffer) => new Uint8Array(arrayBuffer));

// read
const pixels = await getPixels(bytesIn, 'image/png'); // Uint8Array -> ndarray

// modify
const [width, height] = pixels.shape;
for (let x = 0; x < width; ++x) {
  for (let y = 0; y < height; ++y) {
    pixels.set(x, y, 0, 255); // R
    pixels.set(x, y, 1, 0.0); // G
    pixels.set(x, y, 2, 0.0); // B
    pixels.set(x, y, 3, 255); // A
  }
}

// write
const bytesOut = await savePixels(pixels, 'image/png'); // ndarray -> Uint8Array
```


### Node.js

```javascript
const fs = require('fs');
const { getPixels, savePixels } = require('ndarray-pixels');

const bufferIn = fs.readFileSync('./input.png');

// read
const pixels = await getPixels(bufferIn, 'image/png'); // Uint8Array -> ndarray

// modify
const [width, height] = pixels.shape;
for (let x = 0; x < width; ++x) {
  for (let y = 0; y < height; ++y) {
    pixels.set(x, y, 0, 255); // R
    pixels.set(x, y, 1, 0.0); // G
    pixels.set(x, y, 2, 0.0); // B
    pixels.set(x, y, 3, 255); // A
  }
}

// write
const bufferOut = await savePixels(pixels, 'image/png'); // ndarray -> Uint8Array
fs.writeFileSync('./output.png', bufferOut);
```

## API

<!--- API BEGIN --->


### Function: getPixels()

> **getPixels**(`data`, `mimeType`): `Promise`\<`NdArray`\<`Uint8Array`\>\>

Decodes image data to an `ndarray`.

MIME type is optional when given a path or URL, and required when given a Uint8Array.

Accepts `image/png` or `image/jpeg` in Node.js, and additional formats on browsers with
the necessary support in Canvas 2D.

#### Parameters

• **data**: `Uint8Array`

• **mimeType**: `string`

`image/jpeg`, `image/png`, etc.

#### Returns

`Promise`\<`NdArray`\<`Uint8Array`\>\>

#### Source

[index.ts:17](https://github.com/donmccurdy/ndarray-pixels/blob/c5bf2c6211099ea4610a51aa2cd7a7ed7c7c2df5/src/index.ts#L17)
### Function: savePixels()

> **savePixels**(`pixels`, `typeOrOptions`): `Promise`\<`Uint8Array`\>

Encodes an `ndarray` as image data in the given format.

If the source `ndarray` was constructed manually with default stride, use
`ndarray.transpose(1, 0)` to reshape it and ensure an identical result from getPixels(). For an
ndarray created by getPixels(), this isn't necessary.

Accepts `image/png` or `image/jpeg` in Node.js, and additional formats on browsers with
the necessary support in Canvas 2D.

#### Parameters

• **pixels**: `NdArray`\<`Uint8Array` \| `Uint8ClampedArray`\>

ndarray of shape W x H x 4.

• **typeOrOptions**: `string` \| `object`

object with encoding options or just the type

#### Returns

`Promise`\<`Uint8Array`\>

#### Source

[index.ts:37](https://github.com/donmccurdy/ndarray-pixels/blob/c5bf2c6211099ea4610a51aa2cd7a7ed7c7c2df5/src/index.ts#L37)
<!--- API END --->
