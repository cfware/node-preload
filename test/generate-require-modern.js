'use strict';

const path = require('path');
const {test} = require('tape');
const modernRequire = require('../generate-require-modern.js');

const {generateRequire, processNodePath, needsPathEnv} = modernRequire;
const noSpaceFile = path.resolve('/dir/file.js');
const spaceFile = path.resolve('/space dir/file.js');

test('exports', t => {
	t.equal(typeof modernRequire, 'object');
	t.same(Object.keys(modernRequire).sort(), ['generateRequire', 'needsPathEnv', 'processNodePath']);
	t.equal(typeof generateRequire, 'function');
	t.equal(processNodePath, undefined);
	t.equal(typeof needsPathEnv, 'function');
	t.equal(needsPathEnv(noSpaceFile), false);
	t.equal(needsPathEnv(spaceFile), false);
	t.end();
});

test('generateRequire', t => {
	t.equal(generateRequire(noSpaceFile), `--require "${noSpaceFile.replace(/\\/g, '\\\\')}"`);
	t.equal(generateRequire(spaceFile), `--require "${spaceFile.replace(/\\/g, '\\\\')}"`);

	if (process.platform !== 'win32') {
		const quoteFile = path.resolve('/dir/file"quote"nospace.js');
		t.equal(generateRequire(quoteFile), `--require "${quoteFile.replace(/\\/g, '\\\\').replace(/"/g, '\\"')}"`);
	}

	t.end();
});
