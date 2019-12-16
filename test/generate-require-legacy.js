'use strict';

const path = require('path');
const {test} = require('tape');
const legacyRequire = require('../generate-require-legacy.js');

const {generateRequire, processNodePath, needsPathEnv} = legacyRequire;
const noSpaceFile = path.resolve('/dir/file.js');
const spaceFile = path.resolve('/space dir/file.js');

test('exports', t => {
	t.equal(typeof legacyRequire, 'object');
	t.same(Object.keys(legacyRequire).sort(), ['generateRequire', 'needsPathEnv', 'processNodePath']);
	t.equal(typeof generateRequire, 'function');
	t.equal(typeof processNodePath, 'function');
	t.equal(needsPathEnv(noSpaceFile), false);
	t.equal(needsPathEnv(spaceFile), true);
	t.end();
});

test('generateRequire', t => {
	t.equal(generateRequire(noSpaceFile), `--require ${noSpaceFile}`);
	t.equal(generateRequire(spaceFile), `--require ${path.basename(spaceFile)}`);

	if (process.platform !== 'win32') {
		const quoteFile = path.resolve('/dir/file"quote"nospace.js');
		t.equal(generateRequire(quoteFile), `--require ${quoteFile}`);
	}

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
