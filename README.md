# ndarray-pixels

[![Latest NPM release](https://img.shields.io/npm/v/ndarray-pixels.svg)](https://www.npmjs.com/package/ndarray-pixels)
[![License](https://img.shields.io/badge/license-MIT-007ec6.svg)](https://github.com/donmccurdy/ndarray-pixels/blob/main/LICENSE)
[![CI](https://github.com/donmccurdy/ndarray-pixels/workflows/CI/badge.svg?branch=main&event=push)](https://github.com/donmccurdy/ndarray-pixels/actions?query=workflow%3ACI)

> **WORK IN PROGRESS**: Experimental.

Convert [ndarray](https://www.npmjs.com/package/ndarray) ↔ image data, on Web and Node.js.

Designed to be used with [other ndarray-based packages](http://scijs.net/packages/).

In Node.js, this package uses [get-pixels](https://www.npmjs.com/package/get-pixels) and [save-pixels](https://www.npmjs.com/package/save-pixels). While both packages could be used on the web, they require polyfills for Node.js builtins. Browserify handles that automatically, but more modern bundlers do not. Moreover, the polyfills increase package size significantly. To avoid these problems, web builds of `ndarray-pixels` reimplement the same functionality with the more portable Canvas API.

## Supported Formats

| Platform | JPEG | PNG | Other |
|----------|------|-----|-------|
| Node.js  | ✅   | ✅ | ❌      |
| Web      | ✅   | ✅ | Based on [browser support](https://developer.mozilla.org/en-US/docs/Web/API/HTMLCanvasElement/toBlob) |

### Known Bugs

- [ ] Node.js implementation may break when given an Uint8Array instead of a Buffer; see test suite.
- [ ] Web implementation premultiplies alpha, as a result of Canvas 2D usage.

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

const pixels = await getPixels(bytesIn, 'image/png'); // Uint8Array -> ndarray

// ... modify ndarray ...

const bytesOut = await savePixels(pixels, 'image/png'); // ndarray -> Uint8Array
```


### Node.js

```javascript
const fs = require('fs');
const { getPixels, savePixels } = require('ndarray-pixels');

const bufferIn = fs.readFileSync('./input.png');
const pixels = await getPixels(bufferIn, 'image/png'); // Uint8Array -> ndarray

// ... modify ndarray ...

const bufferOut = await savePixels(pixels, 'image/png'); // ndarray -> Uint8Array
fs.writeFileSync('./output.png', bufferOut);
```

## API

<!--- API BEGIN --->

### getPixels

▸ **getPixels**(`data`: *string* \| Uint8Array, `mimeType?`: *string*): *Promise*<ndarray\>

Decodes an image (image/png or image/jpeg in Node.js, any with browser support on Web) to an
ndarray.

MIME type is optional when given a path or URL, and required when given a Uint8Array. On
Node.js, it may be necessary to convert the Uint8Array to a Buffer, with Buffer.from(array).

#### Parameters:

Name | Type |
:------ | :------ |
`data` | *string* \| Uint8Array |
`mimeType?` | *string* |

**Returns:** *Promise*<ndarray\>

Defined in: [index.ts:16](https://github.com/donmccurdy/ndarray-pixels/blob/bc81779/src/index.ts#L16)

___

### savePixels

▸ **savePixels**(`pixels`: ndarray, `mimeType`: *string*): *Promise*<Uint8Array\>

Encodes an image (image/png or image/jpeg in Node.js, any with browser support on Web), given an ndarray.

If the source ndarray was constructed with default stride, you may need .transpose(1, 0) to get the result
you expect, i.e. an identical result from getPixels().

#### Parameters:

Name | Type | Description |
:------ | :------ | :------ |
`pixels` | ndarray | ndarray of shape W x H x 4.   |
`mimeType` | *string* |  |

**Returns:** *Promise*<Uint8Array\>

Defined in: [index.ts:38](https://github.com/donmccurdy/ndarray-pixels/blob/bc81779/src/index.ts#L38)
<!--- API END --->
