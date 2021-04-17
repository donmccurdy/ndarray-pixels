# ndarray-pixels

> **WORK IN PROGRESS**: Experimental.

Convert ndarray ↔ image data, for Web and Node.js.

Based on [get-pixels](https://www.npmjs.com/package/get-pixels) and [save-pixels](https://www.npmjs.com/package/save-pixels), adding compatibility with modern web bundlers. Node.js builds reuse `save-pixels` and `get-pixels` packages directly. Because those packages rely on Node.js builtins — unfortunately requiring per-bundler configuration and larger bundle sizes — web builds reimplement the same functionality with the more portable Canvas API, and do not currently support GIF decoding/encoding.

## Quickstart

```
npm install --save ndarray-pixels
```

```javascript
import ndarray from 'ndarray';
import { getPixels, savePixels } from 'ndarray-pixels';

const pixels = await getPixels(bufferIn, 'image/png'); // Uint8Array -> ndarray

// ... modify ndarray ...

const bufferOut = await savePixels(pixels, 'image/png'); // ndarray -> Uint8Array
```

Note that the Uint8Array data is encoded with the given MIME type. In Node.js, JPEG and PNG are supported. On the Web, support varies by browser.

## To Do

The Node.js implementation does not seem totally happy with a Uint8Array as input. See test, not sure why.

For whatever reason the typings aren't coming through in gltf-transform right now.
