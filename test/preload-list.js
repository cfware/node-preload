'use strict';

const path = require('path');
const {test} = require('tape');

const preloadListEnv = require('../preload-list-env.js');

const file1 = require.resolve('../fixtures/file1.js');
const file2 = require.resolve('../fixtures/file2.js');

function preloadList() {
	const mod = require.resolve('../preload-list.js');
	delete require.cache[mod];

	return require(mod);
}

test('preload lists', t => {
	delete process.env[preloadListEnv];
	t.same(preloadList(), [], 'empty array');

	process.env[preloadListEnv] = '';
	t.deepEqual(preloadList(), [], 'empty array');

	process.env[preloadListEnv] = file1;
	t.deepEqual(preloadList(), [file1], 'one item');

	process.env[preloadListEnv] = [file1, file2].join(path.delimiter);
	t.deepEqual(preloadList(), [file1, file2], 'two items');

	t.end();
});
