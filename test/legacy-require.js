'use strict';

const path = require('path');
const {test} = require('tap');
const legacyRequire = require('../legacy-require');

const {generateRequire, processNodePath} = legacyRequire;
const noSpaceFile = path.resolve('/dir/file.js');
const spaceFile = path.resolve('/space dir/file.js');

test('exports', async t => {
	t.is(typeof legacyRequire, 'object');
	t.deepEqual(Object.keys(legacyRequire).sort(), ['generateRequire', 'processNodePath']);
	t.is(typeof generateRequire, 'function');
	t.is(typeof processNodePath, 'function');
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

	t.is(processNodePath(''), dirname);
	t.is(processNodePath(dirname), dirname);
	t.is(processNodePath([dirname, __dirname].join(path.delimiter)), [dirname, __dirname].join(path.delimiter));
	t.is(processNodePath(__dirname), [__dirname, dirname].join(path.delimiter));
});
