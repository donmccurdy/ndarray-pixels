const { getPixels, savePixels } = require('../dist/ndarray-pixels.js');
require('./common.test.js')('node', getPixels, savePixels);
