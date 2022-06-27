global.regeneratorRuntime = require('regenerator-runtime');
const { getPixels, savePixels } = require('../dist/ndarray-pixels-browser.cjs');
require('./common.test.cjs')('browser', getPixels, savePixels);
