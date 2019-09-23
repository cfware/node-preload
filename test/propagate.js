'use strict';

const {test} = require('tap');

test('error', async t => {
	require('../node-preload').unload();

	process.env.NODE_POLYFILL_PROPAGATE_ENV = 'not valid';

	t.deepEqual(require('../node-preload').propagateEnv, {});
	t.notOk('NODE_POLYFILL_PROPAGATE_ENV' in process.env);
});

test('missing var at load', async t => {
	require('../node-preload').unload();

	process.env.NODE_POLYFILL_PROPAGATE_ENV = '["TEST1", "TEST2", "TEST3"]';
	process.env.TEST1 = 'value1';
	process.env.TEST2 = '';
	delete process.env.TEST3;

	t.deepEqual(require('../node-preload').propagateEnv, {TEST1: 'value1', TEST2: ''});
	t.notOk('NODE_POLYFILL_PROPAGATE_ENV' in process.env);
});
