'use strict';

const {test} = require('tap');

require('../node-preload').unload();

const nodeMajor = Number(process.versions.node.split('.')[0]);
const {generateRequire} = nodeMajor < 12 ? require('../legacy-require.js') : require('../modern-require.js');

const nodeOptionRequireSelf = generateRequire(require.resolve('../node-preload.js'));
const exposeGC = '--expose-gc';

test('unload handles NODE_OPTIONS properly', async t => {
	delete process.env.NODE_OPTIONS;
	require('../node-preload').unload();
	t.notOk('NODE_OPTIONS' in process.env);

	process.env.NODE_OPTIONS = nodeOptionRequireSelf;
	require('../node-preload').unload();
	t.notOk('NODE_OPTIONS' in process.env);

	process.env.NODE_OPTIONS = exposeGC + ' ' + nodeOptionRequireSelf;
	require('../node-preload').unload();
	t.is(process.env.NODE_OPTIONS, exposeGC);

	process.env.NODE_OPTIONS = '';
	require('../node-preload').unload();
	t.is(process.env.NODE_OPTIONS, '');
});
