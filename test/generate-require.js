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
	t.equal(typeof legacyRequire, 'object');
	t.same(Object.keys(legacyRequire).sort(), ['generateRequire', 'needsPathEnv', 'processNodePath']);
	t.equal(typeof generateRequire, 'function');
	t.equal(typeof processNodePath, 'function');
	t.equal(needsPathEnv(plainFile), isWindows);
	t.equal(needsPathEnv(spaceFile), true);
	t.equal(needsPathEnv(quoteFile), true);
	t.equal(needsPathEnv(backslashFile), true);
	t.end();
});

test('generateRequire', t => {
	t.equal(generateRequire(plainFile), `--require ${isWindows ? path.basename(plainFile) : plainFile}`);
	t.equal(generateRequire(spaceFile), `--require ${path.basename(spaceFile)}`);
	t.equal(generateRequire(quoteFile), `--require ${path.basename(quoteFile)}`);
	t.equal(generateRequire(backslashFile), `--require ${path.basename(backslashFile)}`);

	t.end();
});

test('processNodePath', t => {
	const dirname = path.resolve(__dirname, '..', 'preload-path');

	t.equal(processNodePath('', dirname), dirname);
	t.equal(processNodePath(dirname, dirname), dirname);
	t.equal(processNodePath([dirname, __dirname].join(path.delimiter), dirname), [dirname, __dirname].join(path.delimiter));
	t.equal(processNodePath(__dirname, dirname), [__dirname, dirname].join(path.delimiter));
	t.end();
});
