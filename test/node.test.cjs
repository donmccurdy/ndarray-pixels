/* eslint-disable @typescript-eslint/no-var-requires */

const { getPixels, savePixels } = require('../dist/ndarray-pixels-node.cjs');
require('./common.test.cjs')('node', getPixels, savePixels);
