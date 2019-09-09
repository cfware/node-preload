'use strict';

const {test} = require('tap');

function cleanLoad(propagated) {
	require('../node-preload').unload();

	if (propagated) {
		process.env.NODE_PROPAGATE_ENV = JSON.stringify(Object.keys(propagated));
		Object.assign(process.env, propagated);
	} else {
		delete process.env.NODE_PROPAGATE_ENV;
	}

	return require('../node-preload');
}

test('basic', async t => {
	const {propagateEnv, propagateGetEnv} = cleanLoad();

	t.deepEqual(propagateGetEnv(), {});
	t.notOk('NODE_PROPAGATE_ENV' in process.env);

	propagateEnv('name', 'value');
	t.deepEqual(propagateGetEnv(), {name: 'value'});

	propagateEnv('name', 1);
	t.deepEqual(propagateGetEnv(), {name: '1'});

	propagateEnv('name');
	t.deepEqual(propagateGetEnv(), {});
});

test('load propagated', async t => {
	const props = {
		TESTPROPAGATE1: 'value1',
		TESTPROPAGATE2: 'value2'
	};
	const {propagateGetEnv} = cleanLoad(props);

	t.deepEqual(propagateGetEnv(), props);
	t.notOk('NODE_PROPAGATE_ENV' in process.env);

	require('../node-preload').unload();
	t.notOk('NODE_PROPAGATE_ENV' in process.env);

	t.deepEqual(require('../node-preload').propagateGetEnv(), {});
	t.notOk('NODE_PROPAGATE_ENV' in process.env);
});

test('error', async t => {
	require('../node-preload').unload();

	process.env.NODE_PROPAGATE_ENV = 'not valid';

	t.deepEqual(require('../node-preload').propagateGetEnv(), {});
	t.notOk('NODE_PROPAGATE_ENV' in process.env);
});

test('missing var at load', async t => {
	require('../node-preload').unload();

	process.env.NODE_PROPAGATE_ENV = '["TEST1", "TEST2", "TEST3"]';
	process.env.TEST1 = 'value1';
	process.env.TEST2 = '';
	delete process.env.TEST3;

	t.deepEqual(require('../node-preload').propagateGetEnv(), {TEST1: 'value1', TEST2: ''});
	t.notOk('NODE_PROPAGATE_ENV' in process.env);
});
