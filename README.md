# ndarray-pixels

> **WORK IN PROGRESS**: Experimental.

Convert [ndarray](https://www.npmjs.com/package/ndarray) ↔ image data, on Web and Node.js.

Designed to be used with [other ndarray-based packages](http://scijs.net/packages/).

In Node.js, this package uses [get-pixels](https://www.npmjs.com/package/get-pixels) and [save-pixels](https://www.npmjs.com/package/save-pixels). While both packages could be used on the web, they require polyfills for Node.js builtins. Browserify handles that automatically, but more modern bundlers do not. Moreover, the polyfills increase package size significantly. To avoid these problems, web builds of `ndarray-pixels` reimplement the same functionality with the more portable Canvas API.

## Known Bugs

- [ ] Node.js implementation may break when given an Uint8Array instead of a Buffer; see test suite.
- [ ] Web implementation premultiplies alpha, as a result of Canvas 2D usage.

## Supported Formats

| Platform | JPEG | PNG | Other |
|----------|------|-----|-------|
| Node.js  | ✅   | ✅ | ❌      |
| Web      | ✅   | ✅ | Based on [browser support](https://developer.mozilla.org/en-US/docs/Web/API/HTMLCanvasElement/toBlob) |

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
