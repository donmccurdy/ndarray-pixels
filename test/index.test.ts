require('source-map-support').install();

import * as test from 'tape';
import { implemented } from '../';

test('test', t => {
	t.equals(implemented, true, 'implement library');
	t.end();
});
