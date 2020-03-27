'use strict';

const path = require('path');
const {test} = require('tape');
const legacyRequire = require('../generate-require.js');

const {generateRequire, processNodePath, needsPathEnv} = legacyRequire;
const plainFile = path.resolve('/dir/file.js');
const spaceFile = path.resolve('/space dir/file.js');
const quoteFile = path.resolve('/"quoted"/file.js');
const backslashFile = path.resolve('/back\\slash/file.js');

const isWindows = process.platform === 'win32';

test('exports', t => {
	t.same(
		Object.keys(legacyRequire).sort().map(name => [name, typeof legacyRequire[name]]),
		[
			['generateRequire', 'function'],
			['needsPathEnv', 'function'],
			['processNodePath', 'function']
		],
		'exports functions'
	);

	t.end();
});

test('needsPathEnv', t => {
	t.equal(needsPathEnv(plainFile), isWindows, 'plain file');
	t.equal(needsPathEnv(spaceFile), true, 'space file');
	t.equal(needsPathEnv(quoteFile), true, 'quote file');
	t.equal(needsPathEnv(backslashFile), true, 'backslash file');

	t.end();
});

test('generateRequire', t => {
	t.equal(generateRequire(plainFile), `--require ${isWindows ? path.basename(plainFile) : plainFile}`, 'plain file');
	t.equal(generateRequire(spaceFile), `--require ${path.basename(spaceFile)}`, 'space file');
	t.equal(generateRequire(quoteFile), `--require ${path.basename(quoteFile)}`, 'quote file');
	t.equal(generateRequire(backslashFile), `--require ${path.basename(backslashFile)}`, 'backslash file');

	t.end();
});

test('processNodePath', t => {
	const dirname = path.resolve(__dirname, '..', 'preload-path');

	t.equal(processNodePath('', dirname), dirname, 'started empty');
	t.equal(processNodePath(dirname, dirname), dirname, 'ignore single path duplicate');
	t.equal(
		processNodePath([dirname, __dirname].join(path.delimiter), dirname),
		[dirname, __dirname].join(path.delimiter),
		'ignore multiple path duplicate'
	);
	t.equal(
		processNodePath(__dirname, dirname),
		[__dirname, dirname].join(path.delimiter),
		'add path'
	);
	t.end();
});
