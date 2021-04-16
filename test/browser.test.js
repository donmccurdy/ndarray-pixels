global.regeneratorRuntime = require('regenerator-runtime');
const { getPixels, savePixels } = require('../dist/ndarray-pixels-browser.js');
require('./common.test.js')('browser', getPixels, savePixels);
