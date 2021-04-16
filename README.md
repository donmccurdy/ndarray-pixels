# ndarray-pixels

> **WORK IN PROGRESS**: Not yet functional.

Convert ndarray ↔ image data, for Web and Node.js.

Based on [get-pixels](https://www.npmjs.com/package/get-pixels) and [save-pixels](https://www.npmjs.com/package/save-pixels), adding compatibility with modern web bundlers. Node.js builds reuse `save-pixels` and `get-pixels` packages directly. Because those packages rely on Node.js builtins — unfortunately requiring per-bundler configuration and larger bundle sizes — web builds reimplement the same functionality with the more portable Canvas API, and do not currently support GIF decoding/encoding.

## To Do

Currently implements the same API in Node.js and Web, with a very incomplete Readable shim in place of the more complex stream-browserify. This isn't necessarily the API I actually want; we could wrap both in async methods —

```js
const pixels = await getPixelsAsync(data, 'image/png');
const data = await savePixelsAsync(pixels, 'image/png');
```

This also provides the option of having ensuring consistency on the mime type usage, where the `save-pixels` and `get-pixels` packages are inconsistent now.
