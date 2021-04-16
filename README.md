# ndarray-pixels

> **WORK IN PROGRESS**: Not yet functional.

Convert ndarray ↔ image data, for Web and Node.js.

Based on [get-pixels](https://www.npmjs.com/package/get-pixels) and [save-pixels](https://www.npmjs.com/package/save-pixels), adding compatibility with modern web bundlers. Node.js builds reuse `save-pixels` and `get-pixels` packages directly. Because those packages rely on Node.js builtins, requiring per-bundler configuration and larger bundle sizes, web builds reimplement the same functionality with the Canvas API, and do not currently support GIF decoding/encoding.
