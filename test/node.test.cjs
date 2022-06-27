const { getPixels, savePixels } = require('../dist/ndarray-pixels-node.cjs');
require('./common.test.cjs')('node', getPixels, savePixels);
