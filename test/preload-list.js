'use strict';

const path = require('path');
const {test} = require('tap');

const file1 = require.resolve('../fixtures/file1.js');
const file2 = require.resolve('../fixtures/file2.js');

function cleanLoad(propagated) {
	require('../node-preload').unload();
	delete global['node-preload-test'];
	delete require.cache[file1];
	delete require.cache[file2];

	if (propagated) {
		process.env.NODE_PRELOAD_POLYFILL = propagated;
	}

	return require('../node-preload');
}

test('list management', async t => {
	const preloadNode = cleanLoad();

	t.deepEqual(preloadNode.preloadGetList(), []);

	preloadNode.preloadInsert(file1);
	preloadNode.preloadInsert(file2);

	t.deepEqual(preloadNode.preloadGetList(), [file2, file1]);

	preloadNode.preloadInsert(file1);
	t.deepEqual(preloadNode.preloadGetList(), [file1, file2]);

	preloadNode.preloadAppend(file1);
	t.deepEqual(preloadNode.preloadGetList(), [file2, file1]);

	preloadNode.preloadRemove(file1);
	t.deepEqual(preloadNode.preloadGetList(), [file2]);

	preloadNode.preloadRemove(file1);
	t.deepEqual(preloadNode.preloadGetList(), [file2]);
});

test('simulated initial load', async t => {
	t.deepEqual(cleanLoad(file1).preloadGetList(), [file1]);
	t.notOk('NODE_PRELOAD_POLYFILL' in process.env);
	t.deepEqual(global['node-preload-test'], [file1]);

	t.deepEqual(
		cleanLoad([file1, file2].join(path.delimiter)).preloadGetList(),
		[file1, file2]
	);
	t.deepEqual(global['node-preload-test'], [file1, file2]);
	t.notOk('NODE_PRELOAD_POLYFILL' in process.env);

	t.deepEqual(
		cleanLoad([file2, file1].join(path.delimiter)).preloadGetList(),
		[file2, file1]
	);
	t.deepEqual(global['node-preload-test'], [file2, file1]);
	t.notOk('NODE_PRELOAD_POLYFILL' in process.env);
});
