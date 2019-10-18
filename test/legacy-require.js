'use strict';

const path = require('path');
const {test} = require('tap');
const legacyRequire = require('../node-preload-legacy-require');

const {generateRequire, processNodePath, needsPathEnv} = legacyRequire;
const noSpaceFile = path.resolve('/dir/file.js');
const spaceFile = path.resolve('/space dir/file.js');

test('exports', async t => {
	t.type(legacyRequire, 'object');
	t.deepEqual(Object.keys(legacyRequire).sort(), ['generateRequire', 'needsPathEnv', 'processNodePath']);
	t.type(generateRequire, 'function');
	t.type(processNodePath, 'function');
	t.is(needsPathEnv(noSpaceFile), false);
	t.is(needsPathEnv(spaceFile), true);
});

test('generateRequire', async t => {
	t.is(generateRequire(noSpaceFile), `--require ${noSpaceFile}`);
	t.is(generateRequire(spaceFile), `--require ${path.basename(spaceFile)}`);

	if (process.platform !== 'win32') {
		const quoteFile = path.resolve('/dir/file"quote"nospace.js');
		t.is(generateRequire(quoteFile), `--require ${quoteFile}`);
	}
});

test('processNodePath', async t => {
	const dirname = path.resolve(__dirname, '..');

	t.is(processNodePath('', dirname), dirname);
	t.is(processNodePath(dirname, dirname), dirname);
	t.is(processNodePath([dirname, __dirname].join(path.delimiter), dirname), [dirname, __dirname].join(path.delimiter));
	t.is(processNodePath(__dirname, dirname), [__dirname, dirname].join(path.delimiter));
});
