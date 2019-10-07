'use strict';

const path = require('path');
const {test} = require('tap');
const modernRequire = require('../node-preload-modern-require');

const {generateRequire, processNodePath, needsPathEnv} = modernRequire;
const noSpaceFile = path.resolve('/dir/file.js');
const spaceFile = path.resolve('/space dir/file.js');

test('exports', async t => {
	t.is(typeof modernRequire, 'object');
	t.deepEqual(Object.keys(modernRequire).sort(), ['generateRequire', 'needsPathEnv', 'processNodePath']);
	t.is(typeof generateRequire, 'function');
	t.is(processNodePath, undefined);
	t.is(needsPathEnv, false);
});

test('generateRequire', async t => {
	t.is(generateRequire(noSpaceFile), `--require "${noSpaceFile.replace(/\\/g, '\\\\')}"`);
	t.is(generateRequire(spaceFile), `--require "${spaceFile.replace(/\\/g, '\\\\')}"`);

	if (process.platform !== 'win32') {
		const quoteFile = path.resolve('/dir/file"quote"nospace.js');
		t.is(generateRequire(quoteFile), `--require "${quoteFile.replace(/\\/g, '\\\\').replace(/"/g, '\\"')}"`);
	}
});
