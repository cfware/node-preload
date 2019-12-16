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

test('no list', t => {
	delete process.env[preloadListEnv];
	t.deepEqual(preloadList(), []);
	t.end();
});

test('empty list', t => {
	process.env[preloadListEnv] = '';
	t.deepEqual(preloadList(), []);
	t.end();
});

test('one item', t => {
	process.env[preloadListEnv] = file1;
	t.deepEqual(preloadList(), [file1]);
	t.end();
});

test('two items', t => {
	process.env[preloadListEnv] = [file1, file2].join(path.delimiter);
	t.deepEqual(preloadList(), [file1, file2]);
	t.end();
});
